# Puter Integration for Open Lovable

This repository has been converted to use **Puter's AI API** exclusively.

## What Changed

- ❌ Removed OpenAI, Anthropic, Google, and Groq dependencies
- ✅ Added Puter AI integration (`https://js.puter.com/v2/`)
- ✅ Updated API routes to call Puter's chat API
- ✅ Created a standalone Puter integration interface

## Quick Start

### 1. Setup

No API keys needed! Puter provides free access.

```bash
npm install
# or
bun install
```

### 2. Run Development Server

```bash
npm run dev
# or
bun dev
```

### 3. Access Puter Integration

Visit: `http://localhost:3000/puter-integration.html`

This provides a web interface to test Puter's AI API directly.

## API Integration

### Using Puter in Backend Routes

```typescript
// Example in /app/api/generate-ai-code-stream/route.ts
const response = await fetch('https://puter.com/api/v1/ai/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: userPrompt,
    model: 'gpt-5-nano', // or 'gpt-5'
  }),
});

const data = await response.json();
const aiResponse = data.response || data.text;
```

### Using Puter in Browser

```javascript
// Include Puter SDK
<script src="https://js.puter.com/v2/"></script>

// Use it
puter.ai.chat("Your prompt here", { model: "gpt-5-nano" })
  .then(response => console.log(response));
```

## Available Models

- `gpt-5-nano` - Fast, lightweight model (default)
- `gpt-5` - Full GPT-5 model

## Environment Variables

No API keys are required for basic usage. The `.env.example` has been updated to reflect this.

Optional configurations:
- `FIRECRAWL_API_KEY` - For web scraping
- `MORPH_API_KEY` - For fast code application
- Sandbox provider (Vercel or E2B)

## File Structure

```
/workspaces/open-lovable/
├── public/
│   └── puter-integration.html    # Standalone Puter AI interface
├── app/api/
│   ├── generate-ai-code-stream/route.ts  # Updated for Puter
│   └── analyze-edit-intent/route.ts      # Updated for Puter
├── lib/ai/
│   └── provider-manager.ts        # Simplified for Puter only
├── config/
│   └── app.config.ts             # Updated with Puter models
└── package.json                  # Removed AI SDK dependencies
```

## Removed Dependencies

- `@ai-sdk/anthropic` - Anthropic Claude integration
- `@ai-sdk/openai` - OpenAI GPT integration
- `@ai-sdk/google` - Google Gemini integration
- `@ai-sdk/groq` - Groq inference integration
- `@anthropic-ai/sdk` - Anthropic SDK

## Features

✅ Code generation and editing with Puter AI
✅ File context awareness
✅ Streaming responses
✅ Model selection (Nano vs Full GPT-5)
✅ No authentication required
✅ Free tier available

## Testing

```bash
# Test API endpoints
npm run test:api

# Test code execution
npm run test:code

# Run all tests
npm run test:all
```

## Deployment

Works with Vercel, Docker, or any Node.js hosting:

```bash
# Build
npm run build

# Start
npm start
```

## Support

For Puter API documentation: https://puter.com/docs
For Open Lovable: https://github.com/firecrawl/open-lovable

## License

Same as original Open Lovable project (MIT)
