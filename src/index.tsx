import { serve } from "bun";
import index from "./index.html";
import { processNanoBanana, type NanoBananaRequest } from "./backend/gemini";

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

          const result = await processNanoBanana(body);
          return Response.json(result);
        } catch (error) {
          return Response.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
          }, { status: 500 });
        }
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
