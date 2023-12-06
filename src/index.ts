/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

const srcPathPattern = /^\/(?<repo>[\w\-\/]+)-(?<hash>[a-zA-Z0-9]+)(?<fPath>\/.*)/

/*
/ {repo-id} - {git-hash} / {fpath}
=>
/ {repo-id} / resolve / {git-hash} / {fpath}
*/
export function convertPath(path: string): string {
	const match = path.match(srcPathPattern)
	if (!match?.groups) {
		throw new Error(`Invalid path: ${path}`)
	}
	const {repo, hash, fPath} = match.groups
	return `${repo}/resolve/${hash}${fPath}`
}

const newBase = 'https://hf.co';
const statusCode = 301;

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url)
		let newPath: string
		try {
			newPath = convertPath(url.pathname)
		} catch (e) {
			console.log(e)
			return new Response(undefined, { status: 404 })
		}

		const destinationURL = `${newBase}/${newPath}`
		console.log(`Redirecting ${request.url} to ${destinationURL}`);
		return Response.redirect(destinationURL, statusCode);
	},
};
