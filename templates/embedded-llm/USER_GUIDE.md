# User Guide

This starter demonstrates a static-first wizard with optional live LLM feedback.
Students can read and complete the activity without a backend. Live feedback
requires an approved deployment with server functions and environment variables.

## Student Flow

1. Open the deployed page.
2. Enter the instructor-provided access key.
3. Write a short reflection in the bounded text area.
4. Request feedback only when ready.
5. Continue the activity if the assistant is unavailable or the call limit is
   reached.

## Instructor Review

Before sharing with students, replace the placeholder activity copy, edit
`netlify/lib/runtime-contract.mjs`, and verify every interaction id, prompt,
context summary, token cap, storage setting, and fallback message.

See `README.md`, `PRIVACY.md`, `COST_NOTES.md`, and `DEPLOYMENT.md` in the
generated bundle before enabling hosted LLM calls.

## Share Feedback

If you build something useful with Flying Mermoz, please share the creation,
feedback, issues, or improvement ideas on the GitHub repository:
https://github.com/dvbn/flyingmermoz.
