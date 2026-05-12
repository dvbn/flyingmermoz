# Privacy Notes

Complete this file before using hosted LLM calls with students.

## Data Sent To The Provider

Document exactly what is sent to the LLM provider for each `interaction_id`:
student text, locale, approved context summary, and prompt policy. Do not send
private source text, assessment material, or identifiable data unless explicitly
approved for that deployment.

## Data Stored By The Template

The starter stores:

- a session record with course id, student id, display name if provided, session
  timestamps, and call counters
- progress fields allowed by `PROGRESS_SCHEMA`
- feedback ratings and short feedback text
- raw LLM exchanges only when the selected interaction sets `storeExchange:
  true`

The export endpoint purges records older than `WIZARD_RETENTION_DAYS` before
building the export. Students can use `POST /api/reset-student` with a valid
session to delete their session, progress, feedback, and stored exchanges.

## Required Instructor Decisions

- Whether server-generated course-local ids are sufficient, or whether named
  identity requires Firebase/Auth/LMS identity binding.
- Whether raw LLM exchanges are stored.
- Who can access exports.
- Retention and deletion/reset policy.
- Provider retention/logging settings and institutional review requirements.
