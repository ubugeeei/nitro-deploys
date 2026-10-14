import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout } from "node:timers/promises";

const remoteURL = process.argv[2];
const baseURL = new URL(remoteURL || "http://127.0.0.1:3100/base/");
assert(baseURL.pathname.endsWith("/"), "The deployment URL must end with /base/");

const server = remoteURL
  ? undefined
  : spawn(process.execPath, [".output/server/index.mjs"], {
      env: { ...process.env, AWS_LAMBDA_HTTP_ENDPOINT: "127.0.0.1:3100" },
      stdio: "inherit",
    });

async function request(path: string, init?: RequestInit) {
  const response = await fetch(new URL(path, baseURL), {
    ...init,
    signal: AbortSignal.timeout(15_000),
  });
  assert.equal(response.status, 200, `${path || "/"}: HTTP ${response.status}`);
  return response;
}

try {
  if (server) {
    for (let attempt = 0; ; attempt++) {
      try {
        const response = await request("hello");
        await response.body?.cancel();
        break;
      } catch (error) {
        if (server.exitCode !== null || attempt >= 39) throw error;
        await setTimeout(250);
      }
    }
  }

  assert.match(await (await request("")).text(), /Nitro Test Deployment/);
  assert.equal((await (await request("hello")).json()).api, "works");
  assert.equal(await (await request("tests/api")).text(), "Hello, world!");
  console.log("PASS: page and API routes under /base/");

  assert.match(await (await request("nitro.svg")).text(), /<svg/);
  const asset = await request("_dist/tailwind@3.4.17.js");
  assert.match(asset.headers.get("cache-control") || "", /max-age=31536000/);
  assert((await asset.arrayBuffer()).byteLength > 0);
  const pdf = await (await request("data.pdf")).arrayBuffer();
  assert.equal(Buffer.from(pdf).subarray(0, 5).toString(), "%PDF-");
  console.log("PASS: packaged public assets and cache headers");

  const form = new FormData();
  form.set("name", "John Doe");
  const formResponse = await request("tests/form-data", { method: "POST", body: form });
  assert.equal((await formResponse.json()).data.name, "John Doe");

  form.set("file", new Blob([pdf], { type: "application/pdf" }), "data.pdf");
  const multipartResponse = await request("tests/multipart-form-data", {
    method: "POST",
    body: form,
  });
  assert.deepEqual((await multipartResponse.json()).data, {
    name: "John Doe",
    fileName: "data.pdf",
    fileType: "application/pdf",
    fileSize: pdf.byteLength,
  });
  console.log("PASS: form and multipart uploads");

  const stream = await request("stream");
  assert.match(stream.headers.get("content-type") || "", /text\/html/);
  const reader = stream.body!.getReader();
  const first = await reader.read();
  assert(!first.done && first.value.byteLength > 0, "Expected an initial stream chunk");
  const second = await reader.read();
  assert(!second.done && second.value.byteLength > 0, "Expected another stream chunk");
  await reader.cancel();
  console.log("PASS: incremental HTTP response streaming");

  console.log(`Lambda Web smoke checks passed: ${baseURL}`);
} finally {
  server?.kill();
}
