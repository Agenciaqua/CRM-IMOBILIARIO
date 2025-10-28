
import { GoogleGenAI } from "@google/genai";
import { Lead } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // A real application should handle this more gracefully.
  // For this context, we assume the key is present.
  console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateFollowUpEmail = async (lead: Lead): Promise<string> => {
  const prompt = `
    You are a professional and friendly real estate agent. 
    Write a concise follow-up email in Portuguese (Brazil) to a potential client.

    Client Details:
    - Name: ${lead.name}
    - Interested in: ${lead.propertyOfInterest.title} (${lead.propertyOfInterest.type})
    - Price: R$ ${lead.propertyOfInterest.price.toLocaleString('pt-BR')}
    - Client's expressed needs: ${lead.clientNeeds}
    - Last contact date: ${lead.lastContact}

    The email should:
    1. Greet the client warmly by their name.
    2. Briefly mention the property they are interested in.
    3. Reiterate that you are available to help and ask if they have any further questions or if they would like to schedule another visit.
    4. Keep the tone professional, but approachable and helpful.
    5. Do not include a subject line. Just generate the body of the email.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating email with Gemini API:", error);
    return "Desculpe, ocorreu um erro ao gerar o e-mail. Por favor, tente novamente.";
  }
};
