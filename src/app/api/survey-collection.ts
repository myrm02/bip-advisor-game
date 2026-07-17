import type { SurveySubmitResponse } from '../../types/SurveySubmitType';

const VITE_API_KEY = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_KEY) || '';

export default async function SatisfactionSurvey (name: string, prenom: string, type: string, language: string, rating: number, message: string): Promise<SurveySubmitResponse> {

  let result : SurveySubmitResponse;

  const url =
  "https://895gv9.api.infobip.com/people/2/persons";

  const res = await fetch(url, {
    method: 'POST',
    headers: {
        'Authorization': `App ${VITE_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        firstName: name,
        lastName: prenom,
        preferredLanguage: language,
        tags: [
            "Demo_Bip_Advisor"
        ],
        customAttributes: {
            "Job Title": type,
            "Bip Advisor Game Rating": rating,
            "Game survey comment": message
        }
    }),
  });


  result = await res.json();

  return result;

}