# Course Document Pattern Catalog

Use these patterns when generating lecture notes, exams, solutions, or course
handouts. They are designed to keep outputs source-grounded, reviewable, and
easy to package for publication or classroom use.

## Lecture Notes: Source Lanes

Separate source material before drafting:

- Slides or outlines: usually the backbone for sequence and coverage.
- Instructor notes: canonical definitions, notation, proofs, and warnings.
- Transcripts: narrative support only after cleaning; never canonical by
  default.
- Readings and articles: enrichment, examples, and references; summarize rather
  than copy.
- Existing tools or games: optional callouts that connect theory to practice.

The source inventory should become `SOURCE_NOTES.md` or a local manifest. Each
claim that is not obvious course structure should be traceable to a source lane
or marked for instructor review.

## Lecture Notes: Semantic Blocks

For LaTeX or structured Markdown notes, ask the instructor whether to use a
small set of semantic blocks. Typical blocks are:

- `definition`: precise terminology students must retain.
- `concept`: intuition, mechanism, or economic logic.
- `example`: worked numeric or applied example.
- `attention`: common error, caveat, or misleading intuition.
- `result`: theorem, proposition, formula, or key takeaway.
- `remark`: optional extension or interpretation.
- `tool`: link or callout to an interactive module, calculator, game, or data
  exercise.

The same block logic can be rendered as Markdown callouts, LaTeX environments,
or LMS boxes.

## Lecture Notes: Figure And Tool Plan

Before drafting full notes, create a compact figure/tool plan:

- Identify figures that teach structure, such as supply-demand diagrams, tax or
  subsidy wedges, externality gaps, permit-market equilibria, present-value
  decay, total-economic-value trees, decision timelines, or payoff matrices.
- Decide whether each figure is instructor-provided, generated as code, drawn in
  LaTeX/TikZ, or replaced by a textual explanation.
- Add `tool` callouts where an interactive artifact can help students test a
  concept after reading it.
- Keep visual work purposeful. Decorative visuals are not a substitute for
  source-grounded explanation.

## Lecture Notes: Reviewable Build

A robust notes package usually includes:

- `lecture_manifest.md` with scope, source lanes, output format, and open
  questions.
- `notes.md` or `notes.tex` as the editable source.
- `_preamble.tex` only when LaTeX output is requested.
- `figure_plan.md` when diagrams are requested.
- `compile_log.md` or `VERIFICATION.md` when PDF generation is promised.

The first pass should compile or render before stylistic polish. Fix build
errors incrementally instead of regenerating long notes blindly.

## Exam: Format Extraction

When prior exams are provided, use them first as format evidence, not as a
question bank unless explicitly approved.

Extract:

- Page structure, title block, instructions, allowed aids, and answer-space
  conventions.
- Numbering scheme, subquestion style, point distribution, and expected length.
- The balance of conceptual, computational, applied, and text-analysis tasks.
- Rubric style and whether partial-credit guidance is expected.

Record this as `FORMAT_SPEC.md` before drafting.

## Exam: Blueprint Before Questions

Produce `BLUEPRINT.md` before writing a full exam. It should map:

- Learning objectives to question numbers.
- Source sections to question topics.
- Question type to point value and expected time.
- Cognitive level, such as recall, interpretation, application, synthesis, or
  critique.
- Whether a solution, rubric, or grading note is required.

The instructor approves the blueprint before any student-facing exam is drafted.

## Exam: Question Pattern Library

Use these patterns as starting points, then adapt to the course:

- Short conceptual question: one concept, one precise task, compact answer key.
- Mechanism explanation: ask students to explain why a model result occurs, not
  only state it.
- Comparative policy question: require a tradeoff, welfare consequence, or
  distributional implication.
- Numeric or diagram question: include units, assumptions, and point allocation
  for each step.
- Current-event or reading application: summarize the source briefly, cite it,
  and ask students to apply course concepts without copying article text.
- Text-analysis question: give a bounded excerpt or summary, then ask
  subquestions that move from identification to interpretation to critique.

Every generated solution should include expected answer elements, common
mistakes, acceptable alternatives, and point breakdown when requested.

## Exam: Security Separation

Keep assessment outputs physically separated:

- Student-facing exam: no answers, hidden hints, grading notes, prompt logs, or
  internal filenames.
- Instructor-only solution: clearly labeled and stored separately.
- Rubric or corrector notes: instructor-only by default.
- Public examples: toy topics only, never live assessment material.
