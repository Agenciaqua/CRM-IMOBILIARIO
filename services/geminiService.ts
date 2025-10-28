
import { GoogleGenAI } from "@google/genai";
import { Lead } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const generateFollowUpEmail = async (lead: Lead): Promise<string> => {
  if (!ai) {
    return `Olá ${lead.name},

Espero que esteja bem!

Gostaria de saber se você teve a oportunidade de pensar sobre o ${lead.propertyOfInterest.title} que conversamos. O imóvel tem ${lead.propertyOfInterest.bedrooms} quartos e ${lead.propertyOfInterest.bathrooms} banheiros, com ${lead.propertyOfInterest.area}m² de área.

Estou à disposição para responder qualquer dúvida ou agendar uma nova visita, se desejar. Seria um prazer ajudá-lo a encontrar o imóvel ideal para você.

Aguardo seu retorno.

Atenciosamente,
Equipe RealtyFlow`;
  }

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
