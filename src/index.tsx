import { serve } from "bun";
import index from "./index.html";
import { processNanoBanana, type NanoBananaRequest } from "./backend/gemini";
import { globalQueue } from "./backend/queue";
import { file } from "bun";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },

    "/api/nano-banana": {
      async POST(req) {
        try {
          const body = await req.json() as NanoBananaRequest;
          
          if (!body.imageData || !body.prompt) {
            return Response.json({
              success: false,
              error: "Missing imageData or prompt"
            }, { status: 400 });
          }

          const { queueId, position } = await globalQueue.addToQueue();
          
          // Simple wait for turn implementation
          await globalQueue.waitForTurn(queueId);
          
          try {
            const result = await processNanoBanana(body);
            return Response.json({ ...result, queueId });
          } finally {
            globalQueue.completeRequest(queueId);
          }
        } catch (error) {
          return Response.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
          }, { status: 500 });
        }
      }
    },

    "/api/queue-status": {
      async GET(req) {
        const url = new URL(req.url);
        const queueId = url.searchParams.get('queueId');
        const status = globalQueue.getQueueStatus(queueId || undefined);
        return Response.json(status);
      }
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
