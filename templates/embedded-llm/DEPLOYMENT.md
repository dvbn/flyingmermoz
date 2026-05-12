# Deployment Notes

This template targets Netlify static hosting plus Netlify Functions.

## Setup

1. Copy this folder into `work/<project-name>/`.
2. Edit `netlify/lib/runtime-contract.mjs`.
3. Install dependencies with `npm install`.
4. Test locally with `npm run dev`.
5. Confirm the external LLM provider is institutionally acceptable before
   setting `LLM_API_KEY`; the default adapter sends approved student text and
   approved context to Anthropic's Messages API unless you replace
   `netlify/lib/llm-provider.mjs`.
6. Configure production environment variables in Netlify.
7. Deploy and run the checks in `VERIFICATION.md`.

## Required Environment Variables For Hosted Sessions

```text
WIZARD_ACCESS_KEY=<student-access-key>
WIZARD_ADMIN_KEY=<instructor-export-key>
WIZARD_SESSION_SECRET=<random-session-signing-secret>
ALLOWED_ORIGIN=<deployed-site-origin>
```

## Required Environment Variables For Live LLM Calls

```text
LLM_API_KEY=<provider-api-key>
LLM_MODEL_ID=<approved-model-id>
WIZARD_DAILY_BUDGET_USD=5
LLM_INPUT_USD_PER_M_TOKENS=<input-price>
LLM_OUTPUT_USD_PER_M_TOKENS=<output-price>
```

The default `netlify/lib/llm-provider.mjs` adapter calls the Anthropic Messages
API using `LLM_API_KEY` and `LLM_MODEL_ID`. Replace that adapter before
deploying with another provider, local model, or institutional gateway.

## Recommended Environment Variables

```text
WIZARD_SESSION_HOURS=24
WIZARD_MAX_CALLS_PER_SESSION=10
WIZARD_MAX_REQUESTS_PER_MINUTE=20
WIZARD_RETENTION_DAYS=30
```

Use the exact deployed site origin for `ALLOWED_ORIGIN`; hosted browser requests
fail closed when it is missing. Set both token price variables to positive
values; otherwise the starter fails closed and disables live LLM calls because
the daily budget cannot be enforced.
