# Exam Generation Pipeline

## Purpose

Produce a source-grounded exam package with a blueprint, student-facing exam,
solution or marking guide when requested, review notes, and strict separation
between assessment material and student-facing outputs.

Use this recipe with `templates/course-document-patterns/README.md`.

## Suitable Use Cases

- Drafting a new university-level exam from instructor-provided course sources.
- Creating variants from an approved blueprint.
- Producing instructor-only answer keys, marking notes, or review checklists.

## Inputs

- Course name, level, audience, and assessment context.
- Interaction language for the planning conversation.
- Output language for the exam and guides.
- Learning objectives and source packet or source paths, converted to `.md`,
  `.tex`, `.txt`, `.json`, CSV, or another machine-readable format before the
  agent run unless already cleanly machine-readable.
- Source hierarchy: canonical, supporting, assessment, private, quarantine.
- Exam format requirements, allowed question types, duration, point allocation,
  and difficulty.
- Prior exams or question banks only if the instructor has rights and wants them
  used as assessment material.
- Current or recent assessments that should be excluded from reuse or overlap.
- Instructor instructions on format, style, current events, allowed aids,
  answer-space conventions, and grading expectations.
- Deployment/export target: Markdown, DOCX, PDF, LaTeX, LMS, print, or another
  instructor-specified format.
- Time/token budget.
- Output directory, normally `work/<project-name>/`.
- Verification depth.

## User Decisions

Ask the instructor to choose:

- Exam purpose: practice, quiz, midterm, final, oral, or take-home.
- Interaction language and output language.
- Tone and emoji preference, with emojis off by default unless explicitly
  requested.
- Visual direction for any diagrams, figures, tables, or layout elements.
- Branding/colors: HEC-inspired academic palette by default unless another
  brand system is provided.
- Footer attribution: default Flying Mermoz footer, or instructor
  override/removal if needed.
- Brevity defaults: 3-6 planning questions at a time, concise exam sections,
  and bounded generated variants unless the instructor expands the scope.
- Question types, duration, point totals, and allowed aids.
- Difficulty distribution and coverage priorities.
- Whether to produce answer keys, grading rubrics, or instructor-only notes.
- Whether prior exams are format guidance only or approved assessment sources.
- Whether a current-event, reading, or text-analysis question is required.
- How assessment and answer-key files should be separated.
- Whether any generated questions are allowed to be student-facing.
- Deployment/export target and whether setup or packaging help is needed.

## LLM Autonomy Boundaries

The LLM may propose a blueprint, draft questions, suggest point allocation,
write rubrics, and flag coverage gaps after the instructor approves the plan.

The instructor decides canonical source priority, assessment scope, question
style, grading policy, allowed aids, and whether solution materials can be
generated.

The LLM must not expose answer keys in student-facing outputs, invent facts,
reuse private assessment material without permission, or treat generated exams
as final without instructor review.

The LLM must not add emojis or AI-generated images by default. Visuals should be
used only when pedagogically necessary, such as diagrams, tables, charts, or
figures that are clear, printable, accessible, and aligned with the assessment.

Default colors should follow an HEC-inspired academic palette: deep navy
`#002855`, accent blue `#0072CE`, teal `#00AEC7`, light blue `#e6f1fa`, white,
and neutral grays. The instructor may replace this with another brand system.

Generated artifacts should include a small, unobtrusive footer by default:
"Created with Flying Mermoz, an open-source toolkit for educational content."
Link the product name to the public repository URL when configured.

Default brevity caps should keep the first exam package reviewable: short
planning questions, a concise blueprint, bounded question variants, and compact
rubric notes unless the instructor requests expansion.

## Step-By-Step Workflow

1. Ask clarifying questions about exam purpose, audience, source hierarchy,
   language choices, tone, emoji preference, visual direction, branding/colors,
   footer attribution, brevity defaults, format, duration, points, difficulty,
   prior-exam use, overlap exclusions, answer-key handling, deployment/export
   target, time/token budget, and verification depth.
2. Extract a `FORMAT_SPEC.md` from prior exams or instructor instructions when
   available, without reusing live assessment content unless approved.
3. Draft an exam blueprint mapping objectives to sections, question types,
   points, expected time, cognitive level, and sources.
4. Wait for instructor approval before generating exam files.
5. Draft the student-facing exam.
6. Draft instructor-only solutions, grading notes, or rubrics only if requested.
7. Write verification, source notes, and user guide.
8. Ask the instructor to review the exam and answer-key separation.
9. Revise through another plan and production pass if comments are provided.
10. If there are no comments, offer help packaging the exam for DOCX, PDF, LMS,
   or print workflows.

## Expected Outputs

Write to `work/<project-name>/` unless the instructor chooses another path:

- `exam.md` or requested document source
- `BLUEPRINT.md`
- optional `FORMAT_SPEC.md` when prior exams, templates, or detailed format
  instructions are provided
- optional `answer-key-instructor-only.md`
- optional `rubric-instructor-only.md`
- `USER_GUIDE.md`
- `VERIFICATION.md`
- `SOURCE_NOTES.md`
- `DEPLOYMENT.md` if LMS, DOCX, PDF, LaTeX, print, export, upload, or other
  setup workflow is requested

## Verification Gates

- Gate 0: unresolved questions about format, answer keys, source hierarchy,
  output language, deployment/export target, and time/token budget are answered
  or explicitly deferred.
- Gate 1: sources are classified, with assessment material separated from
  student-facing material.
- Gate 2: blueprint, point allocation, question types, language choices, tone,
  emoji preference, visual direction, branding/colors, solution handling,
  prior-exam use, overlap exclusions, footer attribution, brevity caps,
  deployment/export target, time/token budget, and output path are locked.
- Gate 3: exam sections, points, numbering, visuals if any, and requested
  solution files are complete, legible, printable, and internally consistent.
- Gate 3 also checks that current or excluded assessments are not reused, point
  totals match, and answer spaces or LMS formatting match the approved format
  spec.
- Gate 4: the bundle includes user, verification, source, and `DEPLOYMENT.md`
  notes when LMS, DOCX, PDF, LaTeX, print, export, upload, or other setup is
  relevant, plus the approved footer attribution unless disabled.
- Gate 5: the instructor reviews factual correctness, difficulty, coverage,
  wording, and answer-key separation; comments trigger revision.
- Gate 6: student-facing files contain no answer keys, private assessment bank
  text, copied private material, personal information, secrets, or process
  clutter.

## Review And Revision Loop

Ask the instructor to review the blueprint first, then the exam and any
instructor-only materials. If comments are provided, revise the blueprint or
question set before regenerating affected outputs.
Remind the instructor that polished assessment prose is not verification; they
must check facts, points, solutions, rubrics, and answer-key separation before
using the exam.

## Installation Or Deployment Assistance

If the instructor has no further comments, offer help with:

- converting to DOCX, PDF, or LaTeX
- formatting for LMS import
- preparing print-ready copies
- separating student and instructor-only files

## Low-Token Path

- Use only the canonical source packet and instructor instructions.
- Produce a concise blueprint, exam draft, and optional answer key.
- Avoid broad ideation and variant generation.

## Enriched Path

- Add coverage analysis, variant generation, detailed rubrics, distractor
  review, current-event or text-analysis question support, accessibility
  checks, and formatting for multiple delivery modes.

## Failure Modes And Recovery

- Source coverage unclear: produce a blueprint gap list before writing questions.
- Difficulty mismatch: rebalance by objective and cognitive level.
- Answer-key leak risk: split instructor-only files and mark them clearly.
- Overreliance on prior exams: use them only as format guidance unless approved.
- Factual uncertainty: mark unresolved claims for instructor review.

## Public/Private Content Policy

The instructor is responsible for assessment security, source rights, and final
review. Do not publish exams, answer keys, private question banks, student data,
copied readings, personal information, or identifying metadata.

## Example Status And Sanitized Example Plan

Use invented course material and toy questions that are not reusable as live
assessments. A typical plan can look like this:

- Format extraction: prior exams define numbering, point totals, answer-space
  conventions, and rubric style, but their question text is not reused unless
  explicitly approved.
- Blueprint: short conceptual questions for core definitions, one mechanism
  explanation, one diagram or numeric application, one comparative policy
  question, and one applied text-analysis question if requested.
- Student-facing exam: concise instructions, visible point values, clean
  subquestion progression, and no hidden hints or solutions.
- Instructor-only files: answer key with expected elements, common mistakes,
  acceptable alternatives, and point breakdown; rubric kept physically separate
  from the student exam.
- Verification: total points, duration fit, objective coverage, no overlap with
  excluded assessments, source traceability, answer-key separation, and print or
  LMS formatting.

## Public Presentation Requirements

Public outputs should read as professional assessment documentation. Do not
include prompt logs, process notes, model chatter, LLM-coauthor framing, or
private source excerpts.
