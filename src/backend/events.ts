/**
 * Discord webhook logging system for Nano Banana events
 * Non-blocking, fire-and-forget logging that won't affect application flow
 */

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

// Simplified interfaces - keeping for future extensibility
export interface LogEvent {
  type: string;
  timestamp: string;
  prompt: string;
}

/**
 * Converts base64 image data to a Buffer for Discord upload
 */
function base64ToBuffer(base64Data: string): Buffer {
  return Buffer.from(base64Data, 'base64');
}

/**
 * Truncates text to a reasonable length for Discord messages
 */
function truncateText(text: string, maxLength: number = 1000): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Sends a Discord embed message with optional multiple image attachments
 * This is completely non-blocking and fire-and-forget
 * Returns early if no webhook URL is configured
 */
async function sendToDiscord(
  embed: any,
  images?: { data: string; filename: string }[]
): Promise<void> {
  // Skip logging if no webhook URL is configured
  if (!DISCORD_WEBHOOK_URL) {
    return;
  }

  // Run in background, don't await or throw errors
  setImmediate(async () => {
    try {
      const formData = new FormData();
      
      // Create payload with embed
      const payload: any = {
        embeds: [embed]
      };
      
      // Add multiple images if provided
      if (images && images.length > 0) {
        images.forEach((image, index) => {
          const imageBuffer = base64ToBuffer(image.data);
          const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
          formData.append(`file${index}`, blob, image.filename);
        });
        
        // Set images in embed: original as thumbnail, generated as main image
        if (images.length >= 2 && images[0] && images[1]) {
          // Both images available
          embed.thumbnail = {
            url: `attachment://${images[0].filename}` // Original image as thumbnail
          };
          embed.image = {
            url: `attachment://${images[1].filename}` // Generated image as main image
          };
        } else if (images.length === 1 && images[0]) {
          // Only one image available (likely original for failed generation)
          embed.image = {
            url: `attachment://${images[0].filename}`
          };
        }
      }
      
      formData.append('payload_json', JSON.stringify(payload));
      
      // Send to Discord with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
    } catch (error) {
      // Silently fail - logging should never affect the main application
      console.warn('Discord webhook failed (non-critical):', error instanceof Error ? error.message : 'Unknown error');
    }
  });
}

/**
 * Logs a completed image generation with both original and result images
 */
export function logImageGeneration(
  prompt: string,
  success: boolean,
  originalImageData?: string,
  generatedImageData?: string,
  error?: string,
  processingTimeMs?: number
): void {
  const statusEmoji = success ? '✅' : '❌';
  const processingTime = processingTimeMs 
    ? `${Math.round(processingTimeMs / 1000)}s` 
    : 'Unknown';
  
  const embed: any = {
    title: `${statusEmoji} ${success ? 'Image Generated' : 'Generation Failed'}`,
    fields: [
      {
        name: "Prompt:",
        value: truncateText(prompt, 1000),
        inline: false
      },
      {
        name: "Processing Time:",
        value: processingTime,
        inline: true
      }
    ],
    color: success ? 0x57F287 : 0xED4245, // Green for success, red for failure
    timestamp: new Date().toISOString(),
    footer: {
      text: "Nano Banana"
    }
  };
  
  // Add error field if generation failed
  if (!success && error) {
    embed.fields.push({
      name: "Error:",
      value: truncateText(error, 500),
      inline: false
    });
  }
  
  // Prepare images array - always include original, add generated if successful
  const images: { data: string; filename: string }[] = [];
  
  if (originalImageData) {
    images.push({ data: originalImageData, filename: 'original.jpg' });
  }
  
  if (success && generatedImageData) {
    images.push({ data: generatedImageData, filename: 'generated.jpg' });
  }
  
  sendToDiscord(embed, images);
}

// Removed logEvent and getUserId functions as they're no longer needed for the simplified approach
