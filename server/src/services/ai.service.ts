import { GoogleGenAI } from "@google/genai";
 
import {
  AIJobDraft,
  AIRequirements,
  AICVImprovement,
  aiJobDraftSchema,
  aiRequirementsSchema,
  improveCVSchema,
} from "../validators/ai.validator.js";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured");
}

const ai = new GoogleGenAI({
  apiKey,
});

export const generateJobDraft = async (
  idea: string,
): Promise<AIJobDraft> => {
  const prompt = `
You are an AI assistant for AfriLance, a freelance marketplace for African professionals.

Generate a professional job posting from this client idea:

"${idea}"

Return ONLY valid JSON.

Required JSON structure:
{
  "title": "string",
  "description": "string",
  "skills": ["string"],
  "experienceLevel": "entry" | "intermediate" | "expert",
  "requirements": ["string"],
  "deliverables": ["string"]
}

Rules:
- Do not generate budget.
- Do not generate deadline.
- Do not generate location.
- Do not invent client information.
- Keep the job realistic and specific.
- Use concise professional language.
- Skills should be relevant technical or professional skills.
- Requirements should describe what the freelancer needs to have.
- Deliverables should describe what the freelancer should produce.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  const text = response.text?.trim();

  if (!text) {
    throw new Error("AI returned an empty response");
  }

  const cleanedText = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: unknown;

  try {
    parsed = JSON.parse(cleanedText);
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  const result = aiJobDraftSchema.safeParse(parsed);

  if (!result.success) {
    throw new Error("AI returned invalid job data");
  }

  return result.data;
};



export const extractJobRequirements = async (
  idea: string,
): Promise<AIRequirements> => {
  const prompt = `
You are an AI assistant for AfriLance, a freelance marketplace for African professionals.

Analyze this job idea:

"${idea}"

Extract the most relevant professional skills and concrete job requirements.

Return ONLY valid JSON.

Required JSON structure:
{
  "skills": ["string"],
  "requirements": ["string"]
}

Rules:
- Return only skills genuinely relevant to the job.
- Do not invent unnecessary skills.
- Requirements must be specific and actionable.
- Do not generate budget, deadline, location, or client information.
- Keep the output concise and professional.
- Maximum 20 skills.
- Maximum 15 requirements.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  const text = response.text?.trim();

  if (!text) {
    throw new Error("AI returned an empty response");
  }

  const cleanedText = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: unknown;

  try {
    parsed = JSON.parse(cleanedText);
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  const result = aiRequirementsSchema.safeParse(parsed);

  if (!result.success) {
    throw new Error("AI returned invalid requirements data");
  }

  return result.data;
};



export const improveCV = async (
  resume: AICVImprovement,
): Promise<AICVImprovement> => {
  const prompt = `
You are an AI CV improvement assistant for AfriLance.

Improve the following professional resume.

IMPORTANT RULES:
- Do NOT invent experience.
- Do NOT invent companies.
- Do NOT invent education.
- Do NOT invent certifications.
- Do NOT invent skills.
- Do NOT invent achievements, metrics, responsibilities, or technologies.
- Do NOT change dates.
- Do NOT remove real information.
- Preserve the original meaning.
- Improve grammar, clarity, professionalism, and impact.
- Make descriptions concise and ATS-friendly.
- Use strong professional language only when supported by the original content.
- Keep the same number of experience, project, education, and certification items.
- Return ONLY valid JSON.

Resume:
${JSON.stringify(resume, null, 2)}

Return this exact JSON structure:
{
  "headline": "string",
  "professionalSummary": "string",
  "skills": ["string"],
  "experience": [
    {
      "company": "string",
      "position": "string",
      "startDate": "date",
      "endDate": "date",
      "current": true,
      "description": "string"
    }
  ],
  "projects": [
    {
      "title": "string",
      "description": "string",
      "projectUrl": "string"
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "fieldOfStudy": "string",
      "startDate": "date",
      "endDate": "date",
      "description": "string"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "issueDate": "date",
      "credentialUrl": "string"
    }
  ]
}
`;

  let response: Awaited<
  ReturnType<typeof ai.models.generateContent>
> | undefined;

for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    break;
  } catch (error: unknown) {
    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error
        ? (error as { status?: number }).status
        : undefined;

    if (status !== 503 || attempt === 3) {
      throw error;
    }

    const delay = attempt * 2000;

    console.log(
      `Gemini temporarily unavailable. Retrying in ${delay}ms...`,
    );

    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

if (!response) {
  throw new Error("AI request failed after retries");
}



    


  const text = response.text?.trim();

  if (!text) {
    throw new Error("AI returned an empty response");
  }

  const cleanedText = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let parsed: unknown;

  try {
    parsed = JSON.parse(cleanedText);
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  const result = improveCVSchema.safeParse(parsed);

  if (!result.success) {
    throw new Error("AI returned invalid CV data");
  }

  return result.data;
};



