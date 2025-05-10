import { FeedbackInput } from "@/lib/schema";

export const FEEDBACK_CLASSIFICATION_PROMPT = `**Act as a feedback classification engine.**

Input is ONE single-line JS object with these keys:

- **from**: string (user's email)
- **text**: string (raw feedback)
- **name?**: string (user's full name)
- **metadata?**: object (optional extra info, can includes subscription tier, a pathname or both)
    - **tier?**: string (subscription tier of the user, e.g., "free", "pro")
    - **path?**: string (pathname where the feedback was submitted, e.g., "/search")

Return—and only return—a minified, valid JSON object with exactly these keys:

\`\`\`json
{
  "tags": ["string"],
  "impact": "string",
  "subject": "string",
  "summary": "string"
}
\`\`\`

**Allowed tags (no others):**

- **bug** → A defect or error in the functionality of the product.
- **feature_request** → A suggestion for a completely new functionality not currently available.
- **enhancement** → A suggestion to improve or modify an existing feature.
- **ui** → Issues related to the visual design and layout of the user interface (colors, fonts, spacing, etc.).
- **ux** → Issues related to the usability and overall user experience (difficulty completing tasks, confusing navigation, etc.).
- **performance** → Issues related to the speed, responsiveness, and efficiency of the product.
- **security** → Potential vulnerabilities or concerns related to the security of the product or user data.
- **billing** → Issues related to payments, subscriptions, or account billing.
- **api** → Issues specifically related to the product's API (integration problems, errors, etc.).
- **dx** → Issues related to the overall experience of developers using the product (documentation, tooling, onboarding, etc.).
- **lang** → Issues related to translations, cultural appropriateness, or language support.
- **legal** → Issues related to compliance with laws, regulations, or legal requirements (e.g., GDPR, CCPA).

**Rules:**

1. Output exactly one JSON object—no extra text or line breaks.
2. **impact**: either "minor", "major" or "critical".
3. **summary**: one natural‐language sentence restating the feedback; start with the user's first name if known (otherwise "The user"); include metadata.plan or metadata.path if present.
4. **subject**: concise (1–6 words) giving instant context (e.g. "Mobile button too tiny to tap").
5. **tags**: choose ≥1 from allowed list; prefer one unless multiple issues clearly exist.
6. Use a confident, formal, friendly tone; no hedging or apologies.
7. Maintain any URLs unchanged; do not inject new information.

**Examples:**

**Example 1: Basic feature request**

Input:

\`\`\`json
{
  "from": "alice@example.com",
  "text": "Please add a dark mode to reduce eye strain at night."
}
\`\`\`

Output: 

\`\`\`json
{
  "tags": ["feature_request"],
  "impact": "minor",
  "subject": "Requesting dark mode",
  "summary": "Alice requests a dark mode to reduce eye strain at night."
}
\`\`\`

**Example 2: Bug report with metadata**
Input:

\`\`\`json
{
  "from": "c.perigord@example.com",
  "name": "Carol de Talleyrand-Périgord",
  "text": "The signup button is too small on mobile and hard to tap.",
  "metadata": {
    "plan": "free",
    "path": "/billing"
  }
}
\`\`\`

Output:

\`\`\`json
{
  "tags": ["ui", "ux"],
  "impact": "major",
  "subject": "Mobile button too tiny to tap when checking out",
  "summary": "Carol, on the free plan, says the mobile signup button is too small and difficult to tap on '/billing' path, which makes it hard for her to checkout."
}
\`\`\`

Example 3: Multiple-issue report
Input:

\`\`\`json
{
  "from": "heidi@example.com",
  "text": "The app crashes on iOS when opening the settings screen, and the layout is broken.",
  "metadata": {
    "plan": "pro"
  }
}
\`\`\`

Output:

\`\`\`json
{
  "tags": ["bug", "performance", "ui", "ux"],
  "impact": "critical",
  "subject": "iOS settings crash",
  "summary": "Heidi, on the pro plan, reports that the app crashes on iOS when opening settings and the layout appears broken."
}
\`\`\`

Now classify this feedback:

Input: 

\`\`\`json
{
  "from": "dan@example.com",
  "text": "Search results take over 15 seconds to load when I apply filters.",
  "metadata": {
    "tier": "free",
    "path": "/search"
  }
}
\`\`\``;

export function getFeedbackPrompt(input: FeedbackInput): string {
  const inputJson = JSON.stringify(input, null, 2);
  return `${FEEDBACK_CLASSIFICATION_PROMPT}\n\nInput: \n\`\`\`json\n${inputJson}\n\`\`\``;
}
