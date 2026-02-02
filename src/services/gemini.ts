/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI } from "@google/genai";
import { extractHtmlFromText } from "../utils/html";

// Lazy initialization helper
let genAI: GoogleGenAI | null = null;
const getGenAI = (): GoogleGenAI => {
    if (!genAI) {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
        if (!apiKey) {
            throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your .env file.");
        }
        console.log("Initializing Gemini with key:", apiKey ? "Present (Starts with " + apiKey.substring(0, 4) + ")" : "Missing");
        genAI = new GoogleGenAI({ apiKey: apiKey });
    }
    return genAI;
};

// Internal helper for backward compatibility within this file
const ai = {
    get models() {
        return getGenAI().models;
    },
    generateContent: (args: any) => getGenAI().generateContent(args),
    generateContentStream: (args: any) => getGenAI().generateContentStream(args)
};

export const IMAGE_SYSTEM_PROMPT = "Generate an isolated object/scene on a simple background.";
export const VOXEL_PROMPT = "I have provided an image. Code a beautiful voxel art scene inspired by this image using Three.js as a single-page HTML. \n" +
    "CRITICAL: The avatar must be interactive and cute (Pet Society style). \n" +
    "1. Add Raycaster to detect clicks: \n" +
    "   - Clicking the head: 'Pat' reaction (slight jump or heart particles). \n" +
    "   - Clicking the body: 'Tickle' reaction (wobble or giggle animation). \n" +
    "2. Support Mood States: The code should listen for messages from the parent window to change moods ('happy', 'sad', 'excited', 'sleepy'). Each mood should have a distinct animation or visual cue. \n" +
    "3. Use a soft, clay-like lighting and material. \n" +
    "4. Ensure it's responsive and centered.";

export const generateImage = async (prompt: string, aspectRatio: string = '1:1', optimize: boolean = true): Promise<string> => {
    try {
        let finalPrompt = prompt;

        if (optimize) {
            finalPrompt = `${IMAGE_SYSTEM_PROMPT}\n\nSubject: ${prompt}`;
        }

        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
            config: {
                responseMimeType: "image/png",
            },
        } as any);

        const part = (result as any).candidates?.[0]?.content?.parts?.[0];

        if (part && part.inlineData) {
            const base64ImageBytes = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || 'image/png';
            return `data:${mimeType};base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image generated.");
        }
    } catch (error) {
        console.error("Image generation failed:", error);
        throw error;
    }
};

export const generateVoxelScene = async (
    imageBase64: string,
    onThoughtUpdate?: (thought: string) => void
): Promise<string> => {
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    const mimeMatch = imageBase64.match(/^data:(.*?);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

    let fullHtml = "";

    try {
        const result = await ai.models.generateContentStream({
            model: "gemini-2.0-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            inlineData: {
                                mimeType: mimeType,
                                data: base64Data
                            }
                        },
                        {
                            text: VOXEL_PROMPT
                        }
                    ]
                }
            ]
        } as any);

        for await (const chunk of (result as any)) {
            const text = (chunk as any).text || "";
            fullHtml += text;

            if (onThoughtUpdate) {
                const matches = text.match(/\*\*([^*]+)\*\*/g);
                if (matches) {
                    onThoughtUpdate(matches[matches.length - 1].replace(/\*\*/g, ''));
                }
            }
        }

        return extractHtmlFromText(fullHtml);

    } catch (error) {
        console.error("Voxel scene generation failed:", error);
        throw error;
    }
};
