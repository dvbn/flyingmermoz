# Pedagogical Moments Checklist

Use this checklist for interactive HTML modules, wizards, games, simulations,
and multiplayer classroom activities.

## Design Requirement

Every interactive artifact must include deliberate pedagogical moments. These
are short pauses where the artifact stops the action, consolidates what just
happened, connects it to the course material, and asks the student to think or
respond before continuing.

## Minimum Pattern

Each pedagogical moment should include:

- a brief recap of the action, choice, result, or observation students just saw
- an explicit link to the relevant learning objective, course concept, theorem,
  model, reading, slide, or instructor-provided source section
- one short student task, such as explaining a strategy, predicting the next
  result, identifying a tradeoff, naming the concept, checking a calculation, or
  writing a one-sentence takeaway
- concise feedback, reveal text, or instructor debrief notes that explain what
  students should learn from the moment
- a clear continue action so the pause feels intentional rather than like a
  broken flow

## Placement

- Short modules: at least one pedagogical moment before the final summary.
- Wizards: one checkpoint at the end of each act or major scene group.
- Standalone games: one pause after the first meaningful decision/result and one
  final debrief.
- Multiplayer games: instructor-controlled pauses after important rounds,
  reveals, or phase changes; include prompts for strategy discussion and a short
  concept bridge for the projection screen.
- LLM-enabled wizards: LLM feedback should support the checkpoint, not replace
  the course-grounded recap.

## Quality Bar

- Keep the pause short: usually 2-5 sentences plus 1-2 focused prompts.
- Avoid generic reflection prompts. Ask about the specific decision, strategy,
  result, model, or misconception in the artifact.
- Do not merely summarize the UI state. Explain why the result matters for the
  course.
- Make the link to source material auditable in `SOURCE_NOTES.md` or the local
  source manifest without copying private material into public output.
- For instructor-led activities, include optional facilitation notes in
  `USER_GUIDE.md`.

## Example Moments

Standalone game:

> You chose a low contribution while the group outcome depended on everyone
> contributing. That gap is the core public-good tension: the individually
> attractive action can reduce total surplus. Before continuing, write one
> sentence explaining whether your next strategy will protect your own payoff or
> improve the group result.

Static wizard:

> Moving the discount-rate slider changed the present value more than the future
> amount itself. This is why the course treats discounting as an ethical and
> empirical assumption, not a technical detail. Predict what happens to a
> long-run environmental benefit when the rate increases, then reveal the next
> panel.

LLM-enabled wizard:

> First answer in your own words. The assistant may give bounded feedback on
> whether your explanation uses the course concept correctly, but it will not
> replace the recap. After reading the response, revise one sentence so it names
> the mechanism more precisely.

Multiplayer projection:

> The class aggregate shows a different pattern from many individual choices.
> Pause here and ask: who changed strategy after seeing the first result, and
> why? Then connect the answers to the target concept before starting the next
> round.

## Verification

- Confirm every planned pedagogical moment appears in the artifact.
- Confirm each moment maps to a learning objective or source-backed concept.
- Confirm prompts are short enough for classroom use.
- Confirm feedback teaches rather than only saying correct/incorrect.
- Confirm the instructor guide explains when to pause, what to ask, and what
  concept to connect back to.
