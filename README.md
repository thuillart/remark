# Remark

> **Note:** This is my first software project. I'm archiving it to show my early work.

Remark helps teams manage user feedback with AI. When users submit feedback, AI reads it, tags it, and groups similar requests together. No manual sorting needed.

## What it does

Remark has two parts:

### 1. The SDK (`@remark-sh/sdk`)
Add this to your TypeScript app. When users send feedback, it goes to Remark's AI for sorting.

### 2. The Dashboard
A web app where you can:
- See all feedback sorted by priority
- View tags that AI adds (bug, feature request, UI issue, etc.)
- Find duplicate requests, even when people say things differently
- Track which features users want most
- Build your roadmap from what users actually ask for

## Key features

**AI does the work**
- Tags feedback automatically (bug, feature request, UI, UX, speed, security, etc.)
- Rates impact (critical, major, minor, or positive)
- Finds similar requests using AI, even when worded differently
- Writes short summaries of each piece of feedback

**Vote system**
- Groups similar feedback together
- Counts how many users want each feature
- Tracks browser, OS, and device info
- Shows status (pending, in progress, done)

**Easy to use SDK**
- Simple TypeScript API
- Collects metadata automatically
- Handles errors
- Includes rate limiting

## Getting started

### What you need

- Node.js 18 or higher
- PostgreSQL database
- API keys from Google AI (Gemini), Resend (email), and Polar (billing, optional)

### How to install

**1. Clone the repo**

```bash
git clone https://github.com/thuillart/roadmap.git
cd roadmap
```

**2. Install packages**

```bash
bun install
```

**3. Set up environment variables**

Copy the template and add your API keys:

```bash
cp .env.template .env
```

Fill in these values:
```env
# Authentication
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000

# Database
DATABASE_URL=your_postgres_connection_string

# OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITLAB_CLIENT_ID=your_gitlab_client_id
GITLAB_CLIENT_SECRET=your_gitlab_client_secret
GITLAB_ISSUER=https://gitlab.com

# Email
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# AI
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key

# Cron jobs
CRON_SECRET=your_cron_secret

# Billing (optional)
POLAR_ACCESS_TOKEN=your_polar_token
POLAR_WEBHOOK_SECRET=your_webhook_secret
POLAR_PLUS_PRODUCT_ID=your_plus_product_id
POLAR_PRO_PRODUCT_ID=your_pro_product_id
```

**4. Set up the database**

```bash
bun run db:push
```

**5. Start the dev server**

```bash
bun run dev
```

Open `http://localhost:3000` in your browser.

## Using the SDK

### Install it

```bash
npm install @remark-sh/sdk
# or
bun add @remark-sh/sdk
```

### Send feedback

```typescript
import { Remark } from "@remark-sh/sdk";

// Start with your API key
const remark = new Remark("your_api_key");

// Send feedback
const result = await remark.feedbacks.create({
  from: "user@example.com",
  text: "The dashboard loads really slowly on mobile. Takes about 30 seconds.",
  metadata: {
    os: "iOS",
    device: "mobile",
    browser: "Safari",
    path: "/dashboard"
  }
});

if (result.error) {
  console.error("Failed:", result.error);
} else {
  console.log("Sent:", result.data);
}
```

### Manage contacts

```typescript
// Add a contact
await remark.contacts.create({
  name: "John Doe",
  email: "john@example.com",
  metadata: { tier: "premium" }
});

// Update a contact
await remark.contacts.update({
  email: "john@example.com",
  name: "John Smith",
  metadata: { tier: "enterprise" }
});

// Delete a contact
await remark.contacts.delete({
  email: "john@example.com"
});
```

## How it works

### What I used

**Frontend**
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Radix UI
- TanStack Table

**Backend**
- Next.js API Routes
- Better Auth
- Drizzle ORM
- PostgreSQL with pgvector
- Server Actions

**AI**
- Google Gemini 2.5 Flash (reads and tags feedback)
- Google Text Embedding 004 (finds similar feedback)

**Other services**
- Vercel (hosting)
- Neon (database)
- Resend (emails)
- Polar (billing)

### AI enrichment

When feedback comes in, AI does this:
1. Reads the feedback
2. Adds tags (bug, feature request, etc.)
3. Rates the impact
4. Writes a short subject line
5. Creates a summary
6. Cleans up the metadata

Example output:
```typescript
{
  "tags": ["speed", "ui"],
  "impact": "major",
  "subject": "Slow dashboard load on mobile",
  "summary": [
    "User says the dashboard takes 30 seconds to load on their iPhone.",
    "The issue affects mobile Safari users."
  ],
  "metadata": {
    "os": "iOS",
    "device": "mobile",
    "browser": "Safari"
  }
}
```

### Finding similar feedback

Remark finds duplicate requests like this:

1. Turns the feedback subject into numbers (embedding)
2. Saves it in PostgreSQL
3. Compares with other feedback using math (cosine similarity)
4. Groups similar feedback together if they're 80% similar or more

### Vote system

A background job runs every so often and:
- Looks at new feedback from paying users
- Finds similar feedback
- Groups them into votes
- Counts how many users want each thing

### Database tables

Main tables:
- `user` for accounts
- `feedback` for submissions with AI tags
- `vote` for grouped feature requests
- `contact` for contact info
- `apikey` for SDK access

## Security

- API keys with rate limits
- GitHub and GitLab login
- Email verification
- Passkeys
- Session management
- Input validation

## Dashboard

**Feedback page**
- Sort and filter all feedback
- Search by keyword
- See tags, impact, and details

**Votes page**
- See grouped feature requests
- View vote counts
- Track status (pending, in progress, done)
- See which browsers and devices users have

**API keys page**
- Make new API keys
- Set rate limits
- Check usage stats

## Development

### Folder structure

```
roadmap/
├── app/                # Next.js pages
│   ├── (auth)/        # Login pages
│   ├── (core)/        # Main app
│   │   ├── feedbacks/ # Feedback page
│   │   ├── votes/     # Votes page
│   │   └── api-keys/  # API keys page
│   └── api/           # API endpoints
├── components/        # React components
├── lib/               # Utilities
│   ├── db/           # Database code
│   ├── configs/      # Settings
│   └── auth.ts       # Auth setup
├── packages/
│   └── node/         # SDK code
└── public/           # Images and files
```

### Commands

```bash
bun run dev        # Start dev server
bun run build      # Build for production
bun run db:push    # Update database
bun run db:generate # Make migrations
bun run lint       # Check code style
```

### Build the SDK

```bash
cd packages/node
bun run build     # Creates dist/ folder
```

## API

**POST `/api/feedbacks`**
- Send feedback
- Needs API key
- Has rate limits

**GET `/api/group-similar-feedback`**
- Groups similar feedback (cron job)
- Needs auth token

## Pricing

- **Free**: 250 requests/month, max 25/day
- **Plus**: 2,500 requests/month, no daily limit
- **Pro**: Unlimited

## Rate limits

Code from `lib/configs/api-key.ts`:

```typescript
free: { 
  remaining: 250,        // Requests per month
  refillAmount: 250,     // Refill each month
  refillInterval: 2592000, // 30 days
  rateLimitMax: 25,      // Max per day
}
plus: { 
  remaining: 2500,       // Requests per month
  refillAmount: 2500,    // Refill each month
  refillInterval: 2592000, // 30 days
}
pro: { 
  // No limits
}
```

## License

MIT

## What I learned

This was my first big project. I learned:
- Full-stack TypeScript
- How to use AI and LLMs
- Vector databases and similarity search
- Real-time data processing
- Building a SaaS product
- Modern React with Next.js

---

Built as my first software project.
