import {
  GoogleGenAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/genai';

export interface NanoBananaRequest {
  imageData: string | string[];  // Support single or array
  prompt: string;
  mimeType?: string | string[];  // Support single or array
  model?: 'flash' | 'pro';  // flash = 2.5-flash-image, pro = 3-pro-image-preview
}

export interface NanoBananaResponse {
  success: boolean;
  imageData?: string;
  mimeType?: string;
  error?: string;
}

export async function processNanoBanana(request: NanoBananaRequest): Promise<NanoBananaResponse> {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const config = {
      responseModalities: ['IMAGE', 'TEXT'],
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    };

    const model = request.model === 'pro' ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';

    // Build image parts - support single or multiple images
    const imageParts: { inlineData: { mimeType: string; data: string } }[] = [];
    if (Array.isArray(request.imageData)) {
      request.imageData.forEach((imgData, index) => {
        const mime = Array.isArray(request.mimeType)
          ? request.mimeType[index] || 'image/jpeg'
          : 'image/jpeg';
        imageParts.push({ inlineData: { mimeType: mime, data: imgData } });
      });
    } else {
      imageParts.push({
        inlineData: {
          mimeType: (request.mimeType as string) || 'image/jpeg',
          data: request.imageData
        }
      });
    }

    const contents = [
      {
        role: 'user',
        parts: [
          ...imageParts,
          {
            text: request.prompt,
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });

    // Check if the prompt was blocked
    // @ts-ignore - promptFeedback exists on response
    if (response.promptFeedback?.blockReason) {
      return {
        success: false,
        error: 'Your prompt was blocked due to safety filters. Try a different prompt.',
      };
    }

    // Check if we have any candidates
    if (!response.candidates || response.candidates.length === 0) {
      return {
        success: false,
        error: 'Image was blocked due to safety filters. Try a different prompt.',
      };
    }

    const candidate = response.candidates[0];

    // Check various blocked/safety finish reasons
    const blockedReasons = ['SAFETY', 'PROHIBITED_CONTENT', 'BLOCKLIST', 'SPII'];
    if (candidate?.finishReason && blockedReasons.includes(candidate.finishReason)) {
      return {
        success: false,
        error: 'Image was blocked due to safety filters. Try a different prompt.',
      };
    }

    const parts = candidate?.content?.parts || [];
    for (const part of parts) {
      // @ts-ignore
      if (part.inlineData?.data) {
        return {
          success: true,
          // @ts-ignore
          imageData: part.inlineData.data,
          // @ts-ignore
          mimeType: part.inlineData.mimeType || 'image/png',
        };
      }
    }

    // No image was generated - likely content policy related
    return {
      success: false,
      error: 'Unable to generate this image. Try a different prompt.',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
  