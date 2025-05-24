# Remark Node.js SDK

Node.js library for the Remark API.

## Install

```bash
bun add @remark-sh/sdk
```

## Setup

First, you need to get an API key from the [Remark](https://www.remark.sh/api-keys) dashboard.

```ts
import { Remark } from "@remark-sh/sdk";
const remark = new Remark("your_api_key");
```

## Usage

### Contacts

Create a contact:

```ts
const result = await remark.contacts.create({
  name: "John Doe",
  email: "user@example.com",
  metadata: {
    tier: "premium",
  },
});
```

Update a contact:

```ts
const result = await remark.contacts.update({
  name: "John Smith",
  email: "updated@example.com",
  metadata: {
    tier: "enterprise",
  },
});
```

Delete a contact:

```ts
const result = await remark.contacts.delete({
  email: "user@example.com",
});
```

### Feedbacks

Create a feedback:

```ts
const result = await remark.feedbacks.create({
  from: "your_user_id",
  message: "Hello world!",
  metadata: {
    path: "/page",
  },
});
```

## License

MIT License
