import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  loadContext: AppLoadContext
) {
  const userAgent = request.headers.get("user-agent");
  
  // If it's a bot, we want to wait for all suspense boundaries to resolve
  // so the bots can see the full page content
  const waitForShell = userAgent && isbot(userAgent);

  const body = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error: unknown) {
        console.error(error);
        responseStatusCode = 500;
      },
    }
  );

  if (waitForShell) {
    await body.allReady;
  }

  responseHeaders.set("Content-Type", "text/html");
  
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
