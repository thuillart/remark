import { FeedbackInput } from "@/lib/schema";

export const FEEDBACK_CLASSIFICATION_PROMPT = `Act as a feedback classification engine.

You receive exactly one single-line JS object with these keys:

- from: string (user's email)
- text: string (raw feedback)
- name?: string (user's full name)
- metadata?: object (optional extra info, can includes subscription tier, a pathname or both)
    - tier?: string (subscription tier of the user, e.g., "free", "pro")
    - path?: string (pathname where the feedback was submitted, e.g., "/search")

Instruction: 

Return exactly one minified JSON object with these four keys—no extra text:

\`\`\`json
{
  "tags": ["string"],
  "impact": "string",
  "subject": "string",
  "summary": "string"
}
\`\`\`

tags (pick ≥1, no others):

bug, feature_request, enhancement, ui, ux, performance, security, billing, api, dx, lang, legal, appraisal

impact: one of "minor", "major", "critical", based on how much this issue will hurt user satisfaction or retention:

- minor → small annoyance or cosmetic issue unlikely to drive users away
- major → significant usability or performance problem that may frustrate many users
- critical → blocking bug or data loss that will cause users to churn immediately

subject (1–6 words):

- For single-issue feedback, name that issue (e.g. "Dark mode support").
- For multi-issue feedback, use a short umbrella phrase (e.g. "New search UI/UX issues").

summary:

- Write as a friendly human assistant (use first name if given; otherwise, use "The user").
- If there are multiple distinct issues, enumerate them as a numbered list.
- Preserve nuance: what fails, why it matters (lost data, unreadable text, etc.).
- Preserve URLs exactly as given.

---

Examples:

1. Multi-issue  

Input:

\`\`\`json
{
  "from": "alice@example.com",
  "text": "hey y'all, love the new ui but every time i try to search for 'budget', the dropdown just… disappears? also that lil feedback link is like so tiny i can't even click it lol. and dark mode text is barely visible 😂",
  "metadata": {
    "path": "/search"
  }
}
\`\`\`

Output: 

\`\`\`json
{
  "tags": ["ui","ux"],
  "impact": "major",
  "subject": "New search UI/UX issues",
  "summary": "Alice is having three issues:\n1. Latest /search updates make searching unusable because as soon he tries to search something, the dropdown dissapear.\n2. The feedback link seems too small for him to click on it, which makes navigation hard.\n3. Text, when in dark mode seems to be barely visible, which make reading very complex."
}
\`\`\`

1. Appraisal

Input:

\`\`\`json
{
  "from": "bob@example.com",
  "name": "Bob",
  "text": "Just wanted to say the new onboarding flow is fantastic—smooth and intuitive!"
}
\`\`\`

Output:

\`\`\`json
{
  "tags": ["appraisal"],
  "impact": "minor",
  "subject": "New onboarding flow kudos",
  "summary": "Bob is loving the new onboarding flow and finds it smooth and intuitive."
}
\`\`\`

1. Single-issue

Input:

\`\`\`json
{
  "from": "danyboo@example.com",
  "text": "When exporting as a PDF, it generates a corrupted file. I really need it resolved by the end of the week!",
  "metadata": {
    "path": "/reports"
  }
}
\`\`\`

Output:

\`\`\`json
{
  "tags": ["bug"],
  "impact": "major",
  "subject": "Corrupted PDF export",
  "summary": "The user reports that exporting a report as PDF on /reports produces a corrupted file."
}
\`\`\`

1. Feature request

Input:

\`\`\`json
{
  "from": "amoucas@example.com",
  "name": "Amélie Oudéa-Castéra",
  "text": "Could you add a way to switch between the light and dark themes? For instance, by clicking on the m key on my keyboard, this would be perfect!"
}
\`\`\`

Output:

\`\`\`json
{
  "tags": ["feature_request", "ui"],
  "impact": "minor",
  "subject": "Theme toggle shortcut",
  "summary": "Amélie is requesting a keyboard shortcut (m key) to toggle between light and dark themes."
}
\`\`\`

1. Inquiry

Input:

\`\`\`json
{
  "from": "jason@example.com",
  "name": "Jason",
  "text": "Hi, is there a way to export my project data as a CSV file? I couldn't find the option anywhere in the UI."
}
\`\`\`

Output:

\`\`\`json
{
  "tags": ["dx"],
  "impact": "minor",
  "subject": "Question about CSV export",
  "summary": "Jason is asking how to export his project data as a CSV file, since he can't find the option anywhere in the app."
}
\`\`\`

Classify this feedback:

Input: \`\`\`json
`;

export function getFeedbackPrompt(input: FeedbackInput): string {
  const inputJson = JSON.stringify(input, null, 2);
  const prompt = `${FEEDBACK_CLASSIFICATION_PROMPT}${inputJson}\n\`\`\`\n\nA:`;
  return prompt;
}
