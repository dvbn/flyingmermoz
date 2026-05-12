# Verification Checklist

Run these checks before sharing the wizard.

- Static page opens and remains usable without a backend.
- `POST /api/auth-wizard` succeeds with the valid access key.
- `POST /api/auth-wizard` rejects client-supplied `student_id`; the starter
  generates course-local student ids server-side.
- Invalid access keys eventually trigger lockout behavior.
- `POST /api/ask-wizard` succeeds with a valid session and supported
  `interaction_id`.
- Overlong `student_text` returns a clear 400 response.
- Unsupported `interaction_id` returns a clear 400 response.
- Expired or invalid sessions return 401.
- Client-supplied `system`, `model`, `context`, `temperature`, or `max_tokens`
  fields are rejected.
- The session call limit returns 429 when exhausted.
- Daily budget exhaustion returns a graceful fallback.
- `POST /api/save-progress` ignores unknown progress fields and rejects empty or
  oversized progress payloads.
- `POST /api/feedback-wizard` rejects overlong feedback.
- `GET /api/export-responses` rejects missing or invalid admin authorization.
- Export authorization works only with an `Authorization: Bearer <key>` header,
  not with query-string secrets.
- CSV export contains only approved fields.
- CSV export prefixes spreadsheet-formula values such as `=`, `+`, `-`, and
  `@`.
- `POST /api/reset-student` deletes the current student's stored data.
- Browser-visible files contain no secrets, answer keys, private source text, or
  provider API keys.
- Generated bundle contains no prompt logs, model chatter, LLM-coauthor framing,
  or internal process notes.

Example endpoint tests:

```text
POST /api/auth-wizard with a valid access key
POST /api/auth-wizard with a client-supplied student_id
POST /api/auth-wizard with invalid keys until lockout behavior is seen
POST /api/ask-wizard with a valid session and interaction id
POST /api/ask-wizard with an expired session
POST /api/ask-wizard with overlong student_text
POST /api/ask-wizard with an unsupported interaction_id
POST /api/ask-wizard with client-supplied system/model/context/max_tokens fields
POST /api/save-progress with an invalid session
POST /api/feedback-wizard with overlong feedback
GET  /api/export-responses without instructor authorization
GET  /api/export-responses with Authorization bearer token and format=csv
POST /api/reset-student with a valid session
```
