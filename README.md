# Remark - AI-Powered Feedback Management Platform

> **Note:** This is my first-ever software/web application project, archived to showcase my early work in coding and software engineering.

Remark is an intelligent feedback management platform that helps product teams collect, categorize, and prioritize user feedback automatically using AI. It transforms scattered user requests into actionable insights without manual effort.

## 🎯 Overview

Remark offers two core products for developers:

### 1. **Roadmap SDK** (`@remark-sh/sdk`)
A TypeScript SDK that integrates into your application to automatically send user feedback to Remark's AI categorization engine.

### 2. **Dashboard** (Web Application)
A comprehensive web dashboard where you can:
- View all user feedback categorized by AI-determined priority
- See feedback labeled with predefined tags based on request type/purpose
- Track duplicate requests - even when users phrase the same request differently
- Let your users vote on features by automatically detecting similar feedback
- Build your product roadmap based on real user demand

## ✨ Key Features

### Intelligent Feedback Processing
- **AI Categorization**: Automatically tags feedback (bug, feature_request, ui, ux, speed, security, etc.)
- **Impact Assessment**: Classifies feedback as critical, major, minor, or positive
- **Smart Deduplication**: Uses vector embeddings to identify similar requests across different phrasings
- **Automated Summarization**: Generates concise summaries of user feedback

### Priority-Based Roadmap
- **Vote Aggregation**: Groups similar feedback into votes with automatic counting
- **User Metadata**: Tracks browser, OS, and device information
- **Status Management**: Track feedback from pending to completed
- **Analytics Dashboard**: Visualize feedback trends and priority distribution

### Developer-Friendly SDK
- Simple TypeScript API
- Automatic metadata collection
- Built-in error handling
- Rate limiting support

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- API keys for:
  - Google AI (Gemini)
  - Resend (email service)
  - Polar (billing, optional)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/thuillart/roadmap.git
cd roadmap
```

#### 2. Install Dependencies

```bash
bun install
```

#### 3. Configure Environment Variables

Copy the environment template and fill in your credentials:

```bash
cp .env.template .env
```

Required variables:
```env
# Authentication
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000

# Database
DATABASE_URL=your_postgres_connection_string

# OAuth Providers
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Email Service
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# AI Processing
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key

# Cron Jobs
CRON_SECRET=your_cron_secret

# Billing (Optional)
POLAR_ACCESS_TOKEN=your_polar_token
POLAR_WEBHOOK_SECRET=your_webhook_secret
POLAR_PLUS_PRODUCT_ID=your_plus_product_id
POLAR_PRO_PRODUCT_ID=your_pro_product_id
```

#### 4. Setup Database

```bash
bun run db:push
```

#### 5. Start Development Server

```bash
bun run dev
```

The application will be available at `http://localhost:3000`

## 📦 Using the SDK

### Installation

```bash
npm install @remark-sh/sdk
# or
bun add @remark-sh/sdk
```

### Basic Usage

```typescript
import { Remark } from "@remark-sh/sdk";

// Initialize with your API key
const remark = new Remark("your_api_key");

// Create a feedback
const result = await remark.feedbacks.create({
  from: "user@example.com",
  text: "The dashboard loads really slowly on mobile devices. It takes about 30 seconds to load.",
  metadata: {
    os: "iOS",
    device: "mobile",
    browser: "Safari",
    path: "/dashboard"
  }
});

if (result.error) {
  console.error("Failed to submit feedback:", result.error);
} else {
  console.log("Feedback submitted:", result.data);
}
```

### Managing Contacts

```typescript
// Create a contact
await remark.contacts.create({
  name: "John Doe",
  email: "john@example.com",
  metadata: {
    tier: "premium"
  }
});

// Update a contact
await remark.contacts.update({
  email: "john@example.com",
  name: "John Smith",
  metadata: {
    tier: "enterprise"
  }
});

// Delete a contact
await remark.contacts.delete({
  email: "john@example.com"
});
```

## 🏗️ Technical Architecture

### Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Radix UI Components
- TanStack Table
- Motion (Framer Motion)

**Backend:**
- Next.js API Routes
- Better Auth (Authentication)
- Drizzle ORM
- PostgreSQL with pgvector extension
- Server Actions

**AI/ML:**
- Google Gemini 2.5 Flash (Text generation)
- Google Text Embedding 004 (Vector embeddings)
- Semantic similarity matching

**Infrastructure:**
- Vercel (Hosting)
- Neon/PostgreSQL (Database)
- Resend (Email service)
- Polar (Subscription management)

### Key Components

#### AI-Powered Feedback Enrichment

The `enrichFeedback` function uses Google's Gemini AI to:
1. Classify feedback into appropriate tags
2. Assess the impact level
3. Generate a concise subject line
4. Create a detailed summary
5. Normalize metadata (OS, browser, device)

```typescript
// Example AI enrichment result
{
  "tags": ["speed", "ui"],
  "impact": "major",
  "subject": "Slow dashboard load on mobile",
  "summary": [
    "User reports the dashboard takes 30 seconds to load on their iPhone.",
    "The issue specifically affects mobile Safari users."
  ],
  "metadata": {
    "os": "iOS",
    "device": "mobile",
    "browser": "Safari"
  }
}
```

#### Vector-Based Similarity Detection

Remark uses vector embeddings to find similar feedback:

1. Generate embedding from feedback subject using Google's text-embedding-004
2. Store embedding in PostgreSQL with pgvector extension
3. Use cosine similarity to find related feedback (threshold: 0.8)
4. Group similar feedback into votes automatically

#### Cron Job for Vote Aggregation

The `/api/group-similar-feedback` endpoint runs periodically to:
- Process new feedback from paid users
- Find similar feedback using vector similarity
- Create or update vote records
- Aggregate metadata across similar requests

### Database Schema

**Key Tables:**
- `user` - User accounts and authentication
- `feedback` - Individual feedback submissions with AI enrichment
- `vote` - Aggregated feedback representing feature requests
- `contact` - Contact information and metadata
- `apikey` - API keys for SDK integration

## 🔐 Security Features

- API key authentication with rate limiting
- OAuth integration (GitHub, GitLab)
- Email verification
- Passkey support
- Session management
- CORS protection
- Input validation with Zod schemas

## 📊 Dashboard Features

### Feedbacks View
- Sortable table with all user feedback
- Filter by tags, impact, and date
- Search functionality
- Pagination
- Detailed feedback view with metadata

### Votes View
- Aggregated feature requests
- Vote count and priority
- Status tracking (pending, in progress, completed)
- Browser/OS/Device breakdown
- Related feedback grouping

### API Keys Management
- Create and manage API keys
- Rate limiting configuration
- Usage statistics
- Key permissions

## 🧪 Development

### Project Structure

```
roadmap/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (core)/            # Main application pages
│   │   ├── feedbacks/     # Feedback management
│   │   ├── votes/         # Vote aggregation
│   │   ├── api-keys/      # API key management
│   │   └── ...
│   └── api/               # API routes
├── components/            # Reusable React components
├── lib/                   # Shared utilities
│   ├── db/               # Database queries and actions
│   ├── configs/          # Configuration files
│   └── auth.ts           # Authentication setup
├── packages/
│   └── node/             # SDK package
│       └── src/          # SDK source code
└── public/               # Static assets
```

### Available Scripts

```bash
# Development
bun run dev              # Start dev server with Turbopack

# Building
bun run build            # Build for production

# Database
bun run db:push          # Push schema changes
bun run db:generate      # Generate migrations

# Linting
bun run lint             # Run ESLint
```

### Building the SDK

```bash
cd packages/node
bun run build            # Builds to dist/ folder
```

## 🤝 API Endpoints

### Public Endpoints

**POST `/api/feedbacks`**
- Submit new feedback
- Requires API key authentication
- Rate limited based on subscription tier

**GET `/api/group-similar-feedback`**
- Cron job endpoint for vote aggregation
- Requires bearer token authentication

## 📈 Subscription Tiers

- **Free**: Basic feedback collection
- **Plus**: Advanced analytics and higher rate limits
- **Pro**: Unlimited requests and priority support

## 🔧 Configuration

### API Key Limits (lib/configs/api-key.ts)

```typescript
free: { 
  limit: 100,           // requests per month
  refillInterval: 2592000000  // 30 days
}
plus: { 
  limit: 1000,
  refillInterval: 2592000000
}
pro: { 
  limit: 10000,
  refillInterval: 2592000000
}
```

## 📝 License

MIT License

## 🙏 Acknowledgments

This project was built as a learning experience and showcases:
- Full-stack TypeScript development
- AI/ML integration with LLMs
- Vector database usage for semantic search
- Real-time feedback aggregation
- Subscription-based SaaS architecture
- Modern React patterns with Next.js

---

**Built with ❤️ as my first major software project**
