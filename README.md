# Nitro deployments

Continues [Nitro](https://nitro.unjs.io/) deployments for end-to-end testing deployment providers.

## AWS Lambda Web Functions

This branch tests the `aws-lambda-web` preset with
[`https://pkg.pr.new/nitro@4777`](https://github.com/nitrojs/nitro/pull/4777).
Use Node.js 24, the pnpm version in `package.json`, and a current
[AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
that supports `aws lambda-web deploy`.

Authenticate and deploy to Tokyo (`ap-northeast-1`):

```sh
aws login --profile nitro-deploys --region ap-northeast-1
pnpm install --frozen-lockfile
AWS_PROFILE=nitro-deploys pnpm deploy:aws-lambda-web
```

The command builds and uploads the entire `.output` directory, including public
assets, with `server/index.mjs` as the entry point. It creates or updates the
`nitro-deploys` Web Function and its `dev` endpoint. The endpoint is public
(`ApplicationManaged`) and uses the Tokyo home Region. On the first deployment,
the AWS CLI also creates an execution role and deployment bucket if needed.
See the [deployment command reference](https://docs.aws.amazon.com/cli/latest/reference/lambda-web/deploy.html).

Open the returned URL with `/base/` appended. To verify the deployment:

```sh
pnpm test:aws-lambda-web https://YOUR-ENDPOINT.lambda-web.ap-northeast-1.on.aws/base/
```

For local verification, run `pnpm build:aws-lambda-web` followed by
`pnpm test:aws-lambda-web`. The check starts the built server with
`AWS_LAMBDA_HTTP_ENDPOINT` and verifies pages, API routes, public assets, uploads,
and streaming. The **AWS Lambda Web** GitHub Actions workflow runs these checks
on Linux Arm64 with Node.js 24 and uploads the deployment output as an artifact.

The page also contains provider capability tests. AWS currently rejects the
`QUERY` method and removes the `Upgrade` header, so its QUERY and WebSocket tests
are not supported by Lambda Web endpoints. See
[AWS HTTP request handling](https://docs.aws.amazon.com/lambda/latest/dg/web-functions-http.html).

## Providers

<!-- automd:deployments -->

- Alwaysdata (broken) ([docs](https://nitro.unjs.io/deploy/providers/alwaysdata) | [deployment](https://nitro.alwaysdata.net/base/))
- AWS Lambda (not available) ([docs](https://nitro.unjs.io/deploy/providers/aws) | ~~deployment~~)
- AWS Amplify (not available) ([docs](https://nitro.unjs.io/deploy/providers/aws-amplify) | ~~deployment~~)
- Azure Static Web Apps (broken) ([docs](https://nitro.unjs.io/deploy/providers/azure#azure-static-web-apps) | [deployment](https://delightful-mushroom-0f662f303.4.azurestaticapps.net/base/))
- Azure Functions (not available) ([docs](https://nitro.unjs.io/deploy/providers/azure#azure-functions) | ~~deployment~~)
- Cleavr (not available) ([docs](https://nitro.unjs.io/deploy/providers/cleavr) | ~~deployment~~)
- Cloudflare Pages ([docs](https://nitro.unjs.io/deploy/providers/cloudflare) | [deployment](https://nitro-deployment.pages.dev/base/))
- Cloudflare Workers ([docs](https://nitro.unjs.io/deploy/providers/cloudflare) | [deployment](https://nitro.sandbox-d13.workers.dev/base/))
- Deno Deploy ([docs](https://nitro.unjs.io/deploy/providers/deno-deploy) | [deployment](https://nitro.deno.dev/base/))
- DigitalOcean (not available) ([docs](https://nitro.unjs.io/deploy/providers/digitalocean) | ~~deployment~~)
- Edgio (not available) ([docs](https://nitro.unjs.io/deploy/providers/edgio) | ~~deployment~~)
- EdgeOne Pages (not available) ([docs](https://nitro.build/deploy/providers/edgeone) | ~~deployment~~)
- Firebase Hosting (not available) ([docs](https://nitro.unjs.io/deploy/providers/firebase) | ~~deployment~~)
- Firebase App Hosting ([docs](https://nitro.unjs.io/deploy/providers/firebase) | [deployment](https://nitro-app--nitro-949b8.europe-west4.hosted.app/base/))
- Flightcontrol (not available) ([docs](https://nitro.unjs.io/deploy/providers/flightcontrol) | ~~deployment~~)
- Genezio (not available) ([docs](https://nitro.unjs.io/deploy/providers/genezio) | ~~deployment~~)
- Heroku (not available) ([docs](https://nitro.unjs.io/deploy/providers/heroku) | ~~deployment~~)
- Koyeb ([docs](https://nitro.unjs.io/deploy/providers/koyeb) | [deployment](https://shy-constancy-pi0-229c4ed6.koyeb.app/base/))
- Netlify Functions ([docs](https://nitro.unjs.io/deploy/providers/netlify) | [deployment](https://nitro-deployment.netlify.app/base/))
- Netflify Edge ([docs](https://nitro.unjs.io/deploy/providers/netlify#netlify-edge-functions) | [deployment](https://nitro-deployment-edge.netlify.app/base/))
- Platform.sh (broken) ([docs](https://nitro.build/deploy/providers/platform-sh) | [deployment](https://main-bvxea6i-gtpvl3hzdfys2.de-2.platformsh.site/base/))
- Render.com ([docs](https://nitro.unjs.io/deploy/providers/render) | [deployment](https://nitro-app.onrender.com/base/))
- Stormkit ([docs](https://nitro.unjs.io/deploy/providers/stormkit) | [deployment](https://nitro.stormkit.dev/base/))
- Vercel ([docs](https://nitro.unjs.io/deploy/providers/vercel) | [deployment](https://nitro-app.vercel.app/base/))
- Zeabur (not available) ([docs](https://nitro.unjs.io/deploy/providers/zeabur) | ~~deployment~~)
- Zerops (outdated) ([docs](https://nitro.unjs.io/deploy/providers/zerops) | [deployment](https://app-a46-3000.prg1.zerops.app/base/))

<!-- /automd -->
