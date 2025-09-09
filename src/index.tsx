import { serve } from "bun";
import index from "./index.html";
import opengraphImage from "./opengraph-image.png";
import { processNanoBanana, type NanoBananaRequest } from "./backend/gemini";
import { globalQueue } from "./backend/queue";
import { logImageGeneration } from "./backend/events";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/opengraph-image": new Response(Bun.file(opengraphImage)),

    "/api/nano-banana": {
      async POST(req: Request) {
        const startTime = Date.now();
        
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
            const processingTimeMs = Date.now() - startTime;
            
            // Log completed generation with both images (non-blocking)
            logImageGeneration(
              body.prompt,
              result.success,
              body.imageData, // Original image
              result.imageData, // Generated image (if successful)
              result.error,
              processingTimeMs
            );
            
            return Response.json({ ...result, queueId });
          } finally {
            globalQueue.completeRequest(queueId);
          }
        } catch (error) {
          const processingTimeMs = Date.now() - startTime;
          
          // Log failed generation (non-blocking)
          logImageGeneration(
            "Unknown", // We might not have the prompt if parsing failed
            false,
            undefined, // No original image if parsing failed
            undefined, // No generated image
            error instanceof Error ? error.message : "Unknown error",
            processingTimeMs
          );
          
          return Response.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
          }, { status: 500 });
        }
      }
    },

    "/api/queue-status": {
      async GET(req: Request) {
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
