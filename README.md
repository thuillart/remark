# Remark

This is my first web app. I learned to code by building it.

## What it does

Remark collects feedback from your users and uses AI to organize it. Instead of reading hundreds of messages, you get a clean list of what people want, sorted by how many asked for it.

When someone sends feedback, AI reads it and:
- Tags it (bug, feature, design issue, etc.)
- Groups it with similar requests
- Shows you which features people want most

## Features

- [x] AI-powered feedback categorization and deduplication
- [x] TypeScript SDK for collecting user feedback
- [x] Dashboard to view and manage feedback
- [x] Automatic vote counting for feature requests
- [x] Priority scoring based on user demand
- [x] Similar request detection using vector embeddings

## Running the app

**Prerequisites**
- Node.js 18+
- PostgreSQL
- API keys: Google AI, Resend, Polar (optional)

**Setup**

```bash
git clone https://github.com/thuillart/remark.git
cd remark
bun install
cp .env.template .env
# Fill in your API keys in .env
bun run db:push
bun run dev
```

Open `http://localhost:3000`

## Using the SDK

```bash
npm install @remark-sh/sdk
```

```typescript
import { Remark } from "@remark-sh/sdk";

const remark = new Remark("your_api_key");

await remark.feedbacks.create({
  from: "user@example.com",
  text: "The app is slow on mobile",
  metadata: { os: "iOS", device: "mobile" }
});
```
