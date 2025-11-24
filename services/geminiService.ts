import { GoogleGenAI, Modality } from "@google/genai";

// Initialize Gemini Client
// Note: In a real production app, requests should go through a backend to protect the API Key.
// We default to process.env.API_KEY, but premium models require checking for a user-selected key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert URL to base64
const urlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting URL to base64:", error);
    throw error;
  }
};

/**
 * Styles a user using the chat model.
 * Uses gemini-3-pro-preview with Thinking Mode for complex reasoning.
 */
export const getAiStylingAdvice = async (userQuery: string, context: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are "DripBot", a high-end Gen Z fashion stylist for Stash, an underground luxury streetwear app.
      
      Context about the item/user: ${context}
      
      User Question: ${userQuery}
      
      Task: Provide specific, trendy, and actionable styling advice. 
      - Suggest matching items (colors, silhouettes).
      - Mention specific occasions (dates, raves, brunch).
      - Use Gen Z slang appropriately but keep it sophisticated (drip, statement piece, silhouette, aesthetic).
      - Keep it under 100 words.`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }, // Max thinking budget for deep reasoning
      }
    });
    return response.text || "Sorry bestie, my connection is a bit glitched. Try again?";
  } catch (error) {
    console.error("Styling error:", error);
    return "My neural networks are tangling. Can't style right now!";
  }
};

/**
 * Performs the Virtual Try-On simulation.
 * Uses gemini-3-pro-image-preview for high fidelity instruction following.
 */
export const generateVirtualTryOn = async (
  userImageBase64: string,
  productImageInput: string,
  productDescription: string
): Promise<string> => {
  try {
    // 1. Check/Prompt for API Key for this premium model
    // @ts-ignore
    if (window.aistudio && window.aistudio.hasSelectedApiKey && window.aistudio.openSelectKey) {
       // @ts-ignore
       const hasKey = await window.aistudio.hasSelectedApiKey();
       if (!hasKey) {
           // @ts-ignore
           await window.aistudio.openSelectKey();
       }
    }

    // 2. Re-init AI to ensure we have the selected key
    const aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Helper to parse base64 correctly including mime type
    const getMimeTypeAndData = (base64: string) => {
      // Check if it has the data URI scheme
      const match = base64.match(/^data:(image\/[a-zA-Z+.-]+);base64,(.+)$/);
      if (match) {
        return { mimeType: match[1], data: match[2] };
      }
      // Fallback: assume JPEG if raw base64 is passed.
      return { mimeType: 'image/jpeg', data: base64 };
    };

    let finalProductImage = productImageInput;

    // If input is a URL, convert to base64 first
    if (productImageInput.startsWith('http://') || productImageInput.startsWith('https://')) {
        finalProductImage = await urlToBase64(productImageInput);
    }

    const userImg = getMimeTypeAndData(userImageBase64);
    const prodImg = getMimeTypeAndData(finalProductImage);

    const response = await aiClient.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: `You are an advanced Virtual Try-On AI specializing in high-fidelity garment transfer.

            INPUTS:
            1. USER PHOTO: The person wearing the clothes.
            2. PRODUCT PHOTO: The specific clothing item to be worn.

            TASK:
            Generate a photorealistic image of the person from the USER PHOTO wearing the item from the PRODUCT PHOTO.

            CRITICAL INSTRUCTIONS:
            1. EXACT GARMENT MATCH: You MUST transfer the clothing from the PRODUCT PHOTO exactly. 
               - Preserve the TEXTURE, PATTERN, PRINT, LOGOS, and COLOR of the product photo. 
               - Do NOT generate a generic version of the item. If the product photo has a specific graphic, that graphic must appear on the user.
               - Ignore the text description if it conflicts with the visual reality of the Product Photo.
            2. IDENTITY PRESERVATION: The face, hair, body type, and skin tone of the person in USER PHOTO must remain unchanged.
            3. REALISTIC FIT: Warping and shading must apply to the garment so it fits naturally on the user's pose.
            4. BACKGROUND: Keep the original background of the USER PHOTO.
            5. OUTPUT: Generate a high-quality, 3:4 aspect ratio image.

            Product Context: ${productDescription} (Use this only for understanding material/fit, not for visual details).
            
            Output ONLY the generated image.`
          },
          {
            inlineData: {
              mimeType: userImg.mimeType,
              data: userImg.data
            }
          },
          {
            inlineData: {
              mimeType: prodImg.mimeType,
              data: prodImg.data
            }
          }
        ]
      },
      config: {
        responseModalities: [Modality.IMAGE],
        // Adding aspect ratio and limiting tokens slightly can help speed without hurting quality too much
        imageConfig: {
            aspectRatio: "3:4"
        }
      }
    });

    // Extract the generated image
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts && parts.length > 0) {
        // Find the part with inlineData (the image)
        const imagePart = parts.find((p: any) => p.inlineData);
        if (imagePart && imagePart.inlineData && imagePart.inlineData.data) {
            return `data:image/png;base64,${imagePart.inlineData.data}`;
        }
    }
    
    throw new Error("No image generated");

  } catch (error) {
    console.error("Try-on error:", error);
    throw error;
  }
};

/**
 * Generates a video from an image using Veo.
 */
export const generateVeoVideo = async (
  imageBase64: string,
  aspectRatio: '16:9' | '9:16' = '9:16'
): Promise<string> => {
  try {
    // 1. API Key Selection for Veo (Paid Feature)
    // @ts-ignore
    if (window.aistudio && window.aistudio.hasSelectedApiKey && window.aistudio.openSelectKey) {
       // @ts-ignore
       const hasKey = await window.aistudio.hasSelectedApiKey();
       if (!hasKey) {
           // @ts-ignore
           await window.aistudio.openSelectKey();
       }
    }

    // Re-init AI to ensure we have the selected key
    const aiVeo = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Helper to parse base64 correctly including mime type
    const getMimeTypeAndData = (base64: string) => {
      const match = base64.match(/^data:(image\/[a-zA-Z+.-]+);base64,(.+)$/);
      if (match) return { mimeType: match[1], data: match[2] };
      return { mimeType: 'image/png', data: base64 };
    };

    const { mimeType, data } = getMimeTypeAndData(imageBase64);

    console.log("Starting Veo generation...");
    
    let operation = await aiVeo.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      image: {
        imageBytes: data,
        mimeType: mimeType,
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });

    console.log("Veo operation started. Polling...");

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5s interval
      operation = await aiVeo.operations.getVideosOperation({ operation: operation });
      console.log("Polling Veo status...");
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed: No URI returned.");

    // The response body contains the MP4 bytes. We must append the API key.
    const videoRes = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const videoBlob = await videoRes.blob();
    
    return URL.createObjectURL(videoBlob);

  } catch (error) {
    console.error("Veo error:", error);
    throw error;
  }
};