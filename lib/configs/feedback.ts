import { FeedbackInput } from "@/lib/schema";

export const FEEDBACK_CLASSIFICATION_PROMPT = `Act as a feedback classification engine.

You get exactly one single-line JS object with these keys:
-  from: user's email
-  text: raw feedback
-  name?: user's full name
-  metadata?: extra info
  - os?: operating system 
  - tier?: user's subscription plan 
  - path?: page where feedback came from 
  - device?: device type 
  - browser?: browser name 

What to do:

1. Return exactly one minified JSON object—no extra text or notes:

\`\`\`json
{"tags":["string"],"impact":"string","subject":"string","summary":"string","metadata":{"os":"string","browser":"string","device":"string"}}
\`\`\`

2. Follow this example for multi-issue feedback:

\`\`\`json
{"tags":["ui","ux"],"impact":"major","subject":"Example issues","summary":"User has two problems:\n1. First problem description.\n2. Second problem description.","metadata":{"os":"macOS","browser":"Google Chrome","device":"desktop"}}
\`\`\`

3. Allowed tags (pick at least one):
bug, feature_request, ui, ux, speed, security, pricing, billing, dx, i18n, compliance, a11y, kudos

4. Impact should be one of:
-  minor (small annoyance)
-  major (big problem)
-  critical (blocks use or loses data)
-  positive (user is happy with something)

5. Subject: 1–6 words
-  Single issue: name it (e.g. "Dark mode support")
-  Multiple issues: a short title (e.g. "Latest update breaks search")

6. Summary:
-  Talk like a helpful teammate. Use the first name if you have it; otherwise say "The user."
-  **When writing the summary, do not copy chunks of the user's text verbatim. Instead, capture the meaning and explain it in your own, natural words.
-  If there are multiple issues, list them with numbers (\n1.…\n2.…).
-  Keep important details: what broke and why it matters.
-  Keep URLs as they are.

7. Metadata normalization (only if metadata fields are present):
- os: Normalize to a clean, simple name if you recognize it (e.g. "Windows NT 10.0" → "Windows", "Mac OS X 10_15_7" → "macOS", "iPhone OS 17_2_1" → "iOS"). If you don't recognize the OS name, omit the field.
- browser: Normalize to common browser names if recognized (e.g. "Chrome", "Firefox", "Safari", "Edge", "Opera", "Brave", "Arc", "Zen", "Samsung Internet"). If not recognized, omit the field.
- device: Use one of: "mobile", "tablet", "desktop", "console", "smarttv", "wearable", "embedded". If not recognized, omit the field.

---

Examples:

1. Multi-issue 
Input:
\`\`\`json
{
  "from": "alice@example.com",
  "text": "hey y'all… dropdown disappears, link too small, dark mode text unreadable",
  "metadata": {
    "path": "/search",
    "os": "Windows NT 10.0",
    "device": "desktop",
    "browser": "Chrome"
  }
}
\`\`\`

Output:
\`\`\`json
{
  "tags": ["bug", "ui"],
  "impact": "major",
  "subject": "Search page needs fixes",
  "summary": "Alice has three issues on the /search page:\n1. The dropdown disappears during search.\n2. The feedback link is too tiny to click.\n3. The dark mode text is unreadable.",
  "metadata": {
    "os": "Windows",
    "device": "desktop",
    "browser": "Chrome"
  }
}
\`\`\`

2. Kudos
Input:
\`\`\`json
{
  "from": "bob@example.com",
  "name": "Bob",
  "text": "The new dark theme looks amazing! Much easier on the eyes during night coding sessions.",
  "metadata": {
    "os": "Unknown OS v2.1",
    "device": "desktop",
    "browser": "Firefox 115.6.0esr"
  }
}
\`\`\`

Output:
\`\`\`json
{
  "tags": ["kudos"],
  "impact": "positive",
  "subject": "Love the new dark theme",
  "summary": "Bob loves the revamped dark theme, especially when coding at night.",
  "metadata": {
    "device": "desktop",
    "browser": "Firefox"
  }
}
\`\`\`

3. Bug
Input:
\`\`\`json
{
  "from": "danyboo@example.com",
  "text": "When I try to download my invoice as a PDF, it's corrupted, i can't even open it. Please fix this.",
  "metadata": {
    "path": "/billing",
    "os": "iPhone OS 17_2_1",
    "device": "mobile",
    "browser": "Safari 17.2"
  }
}
\`\`\`

Output:
\`\`\`json
{
  "tags": ["bug", "billing"],
  "impact": "critical",
  "subject": "Corrupted PDF export",
  "summary": "Exporting an invoice as PDF creates a corrupted file.",
  "metadata": {
    "os": "iOS",
    "device": "mobile",
    "browser": "Safari"
  }
}
\`\`\`

4. Feature request
Input:
\`\`\`json
{
  "from": "amoucas@example.com",
  "name": "Amélie Oudéa-Castéra",
  "text": "Could you add a way to switch between the light and dark themes? For instance, by clicking on the m key on my keyboard, this would be perfect!",
  "metadata": {
    "os": "Linux x86_64",
    "device": "desktop",
    "browser": "Edge 120.0.2210.91"
  }
}
\`\`\`

Output:
\`\`\`json
{
  "tags": ["feature_request", "ui"],
  "impact": "minor",
  "subject": "Theme shortcut",
  "summary": "Amélie wants to be able to press the M key on her keyboard to switch between the light and dark theme.",
  "metadata": {
    "os": "Linux",
    "device": "desktop",
    "browser": "Edge"
  }
}
\`\`\`

5. Question
Input:
\`\`\`json
{
  "from": "jason@example.com",
  "name": "Jason",
  "text": "Hi, is there a way to export my project data as a CSV file? I couldn't find the option anywhere in the UI.",
  "metadata": {
    "os": "Android 14",
    "device": "mobile",
    "browser": "Samsung Internet 23.0.1.1"
  }
}
\`\`\`

Output:
\`\`\`json
{
  "tags": ["ux"],
  "impact": "major",
  "subject": "Can't find CSV export",
  "summary": "Jason can't find how to export his data as a CSV file in the app. Maybe we should check if it's there and make sure it's easy to find.",
  "metadata": {
    "os": "Android",
    "device": "mobile",
    "browser": "Samsung Internet"
  }
}
\`\`\`

Classify this feedback:
\`\`\`json
`;

export function getFeedbackPrompt(input: FeedbackInput): string {
  const inputJson = JSON.stringify(input, null, 2);
  return `${FEEDBACK_CLASSIFICATION_PROMPT}${inputJson}\n\`\`\`\n\nA:`;
}
