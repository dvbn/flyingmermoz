# Lecture Notes Generation Pipeline

## Purpose

Produce source-grounded lecture notes from instructor-provided course materials,
with clear source boundaries, revision checkpoints, optional LaTeX/PDF build
steps, and human review before publication.

Use this recipe with `templates/course-document-patterns/README.md`.

## Suitable Use Cases

- Turning slides, outlines, readings, and instructor notes into lecture notes.
- Cleaning and structuring transcript-derived material.
- Producing Markdown, LaTeX, or PDF-ready course notes for instructor review.

## Inputs

- Course name, level, target audience, and lecture topic.
- Interaction language for the planning conversation.
- Output language for the notes and guides.
- Learning objectives and source packet or source paths, converted to `.md`,
  `.tex`, `.txt`, `.json`, CSV, or another machine-readable format before the
  agent run unless already cleanly machine-readable.
- Source hierarchy: canonical, supporting, assessment, private, quarantine.
- Desired output format: Markdown, LaTeX, PDF, DOCX, or LMS-ready text.
- Deployment/export target: local files, PDF, DOCX, LMS, static site, print, or
  another instructor-specified target.
- Style requirements, notation conventions, bibliography expectations, and
  figure/table needs.
- Existing interactive tools or games that should be referenced as optional
  `tool` callouts.
- Time/token budget.
- Output directory, normally `work/<project-name>/`.
- Verification depth.

## User Decisions

Ask the instructor to choose:

- Lecture scope and target length.
- Interaction language and output language.
- Tone: concise notes, textbook style, lecture script, tutorial, or exam-prep.
- Emoji use: off by default unless explicitly requested.
- Visual direction: no added visuals, diagrams only, instructor-provided images,
  AI-generated images, or a mixed visual package.
- Branding/colors: HEC-inspired academic palette by default unless another
  brand system is provided.
- Footer attribution: default Flying Mermoz footer, or instructor
  override/removal if needed.
- Brevity defaults: 3-6 planning questions at a time, concise note sections,
  and bounded generated expansions unless the instructor expands the scope.
- Source hierarchy and whether transcripts may be used.
- Output format and build target.
- Deployment/export target and whether setup or publishing help is needed.
- How formal notation, examples, figures, and exercises should be handled.
- Whether to use semantic blocks such as definition, concept, example,
  attention, result, remark, and tool callout.
- Whether existing calculators, games, or wizards should be linked from the
  notes as course-grounded practice moments.
- Whether to include citations, reading links, or bibliography placeholders.

## LLM Autonomy Boundaries

The LLM may propose structure, section ordering, summaries, diagrams, exercises,
and build steps after the plan is approved.

The instructor decides canonical sources, factual priority, notation style,
depth, examples, publication readiness, and whether transcript material is
usable.

The LLM must not invent facts, copy copyrighted readings, treat noisy
transcripts as canonical, expose private notes, or publish generated notes
without instructor review.

The LLM must not add emojis or AI-generated images by default. Visuals should be
purposeful, polished, legible, accessible, and tied to the lecture sequence.
Prefer clear diagrams, figures, and tables over decorative filler.

Default colors should follow an HEC-inspired academic palette: deep navy
`#002855`, accent blue `#0072CE`, teal `#00AEC7`, light blue `#e6f1fa`, white,
and neutral grays. The instructor may replace this with another brand system.

Generated artifacts should include a small, unobtrusive footer by default:
"Created with Flying Mermoz, an open-source toolkit for teaching artifacts."
Link the product name to the public repository URL when configured.

Default brevity caps should keep the first notes package reviewable: short
planning questions, concise sections, bounded examples, and compact exercises
unless the instructor requests a fuller treatment.

## Step-By-Step Workflow

1. Ask clarifying questions about lecture scope, audience, source hierarchy,
   language choices, tone, emoji preference, visual direction, branding/colors,
   footer attribution, brevity defaults, output format, deployment/export
   target, notation, semantic blocks, figures, tool callouts, time/token budget,
   and verification.
2. Draft a plan with note outline, source lanes, semantic block choices, figure
   and tool plan, format, expected files, and checks.
3. Wait for instructor approval before creating files.
4. Create a source inventory and local source notes.
5. Create a compact figure/tool plan when visuals or interactive callouts are
   requested.
6. Draft the notes in the selected format.
7. Add figures, examples, exercises, citations, bibliography placeholders, and
   tool callouts as approved.
8. Compile or render if a build target is requested.
9. Write the user guide, verification report, and deployment/packaging notes.
10. Ask the instructor to review the notes and provide comments.
11. Revise through another plan and production pass if comments are provided.
12. If there are no comments, offer help exporting, compiling, uploading, or
    publishing the notes.

## Expected Outputs

Write to `work/<project-name>/` unless the instructor chooses another path:

- lecture notes in the selected source format, such as `notes.md` or `notes.tex`
- optional rendered PDF, DOCX, or LMS-ready export
- optional figure or bibliography files
- optional `lecture_manifest.md`, `_preamble.tex`, `figure_plan.md`, or
  `compile_log.md` when useful for the selected output format
- `USER_GUIDE.md`
- `VERIFICATION.md`
- `SOURCE_NOTES.md`
- `DEPLOYMENT.md` if export, upload, publishing, LMS, PDF, DOCX, static-site,
  print, or other setup workflow is requested

## Verification Gates

- Gate 0: unresolved questions about source hierarchy, transcripts, format,
  output language, deployment/export target, and time/token budget are answered
  or explicitly deferred.
- Gate 1: sources are classified; transcripts, readings, and generated notes are
  handled according to their source lane.
- Gate 2: outline, language choices, tone, emoji preference, visual direction,
  branding/colors, footer attribution, brevity caps, output format,
  deployment/export target, semantic blocks, figure/tool plan, time/token
  budget, source use, and output path are locked.
- Gate 3: notes build or render if promised; links, figures, diagrams, notation,
  visual quality, and references are checked.
- Gate 4: the bundle includes user, verification, source, and `DEPLOYMENT.md`
  notes when export, upload, publishing, LMS, PDF, DOCX, static-site, print, or
  other setup is relevant, plus the approved footer attribution unless disabled.
- Gate 5: the instructor reviews factual accuracy, sequence, depth, notation,
  examples, and source use; comments trigger revision.
- Gate 6: public-facing files contain no copied readings, raw transcripts,
  personal information, private course material, secrets, or process clutter.

## Review And Revision Loop

Ask the instructor to review the outline first when possible, then the rendered
or source notes. If comments are provided, revise the outline or affected
sections before regenerating the full output.
Remind the instructor that polished notes are not verification; they should
read, test examples, check claims, and edit before sharing with students.

## Installation Or Deployment Assistance

If the instructor has no further comments, offer help with:

- LaTeX compilation and PDF export
- Markdown to PDF or DOCX conversion
- LMS upload formatting
- bibliography or figure packaging
- static-site publishing

## Low-Token Path

- Use only canonical instructor-provided sources.
- Produce Markdown notes with concise verification notes.
- Skip broad enrichment, web search, and complex build targets.

## Enriched Path

- Add figures, exercises, citations, LaTeX/PDF build, visual QA, accessibility
  checks, semantic environments, interactive tool callouts, and supplementary
  reading maps.
- Search for public references only with approval or when current facts are
  required.

## Failure Modes And Recovery

- Source overload: reduce to one lecture scope and canonical materials.
- Transcript noise: use transcripts only as supporting context after cleanup.
- Copyright risk: summarize readings instead of copying text.
- Build errors: simplify the template and compile incrementally.
- Factual uncertainty: mark claims for instructor review.

## Public/Private Content Policy

The instructor is responsible for source rights, citation policy, and final
publication review. Do not publish private course files, copied readings, raw
transcripts, student data, personal information, or identifying metadata.

## Example Status And Sanitized Example Plan

Use invented lecture topics or public-domain teaching material in public
examples. A typical plan can look like this:

- Source lanes: slides provide sequence, instructor notes provide definitions
  and notation, transcript excerpts are supporting only after cleanup, readings
  are summarized rather than copied.
- Structure: learning objectives, intuition, formal definition, worked example,
  common mistake, result box, short exercise, synthesis.
- Semantic blocks: `definition` for the formal term, `concept` for intuition,
  `example` for the worked application, `attention` for the common mistake,
  `result` for the takeaway, and `tool` for an optional interactive calculator
  or game.
- Figure/tool plan: one diagram for the mechanism, one table for assumptions,
  and one tool callout where students can test the concept after reading.
- Verification: confirm every claim maps to a source lane, compile/render the
  selected format, test links, check notation consistency, and mark unresolved
  claims for instructor review.

## Public Presentation Requirements

Public outputs should read as professional lecture-note documentation. Do not
include prompt logs, internal notes, model chatter, LLM-coauthor framing, or
private source excerpts.
