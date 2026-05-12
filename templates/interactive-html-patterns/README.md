# Interactive HTML Pattern Catalog

Use these patterns as public-safe design references when planning standalone
HTML modules, static wizards, LLM-enabled wizards, or classroom games. They are
not copy-paste requirements. Pick the pattern that best matches the learning
objective, then simplify aggressively until the first version can be reviewed.

Every pattern must include deliberate pedagogical moments. See
`checklists/pedagogical-moments.md`.

## Parameter Explorer

Best for concepts where students learn by moving sliders and seeing the model
respond immediately, such as discount rates, public-good contributions,
matching grants, or marginal abatement costs.

Core structure:

- A small set of sliders or numeric inputs with clear units.
- Preset buttons for meaningful scenarios, not arbitrary decoration.
- A live chart, payoff card, or summary metric that updates on every change.
- An insight panel that translates the numeric result into course language.
- A checkpoint asking students which parameter mattered most and why.

Minimal state sketch:

```js
const state = {
  params: { rate: 0.03, horizon: 30, contribution: 20 },
  presetId: "baseline",
  result: null,
  reflection: ""
};
```

## Policy Lever Sandbox

Best for supply-demand, externalities, quotas, taxes, subsidies, price controls,
or other policy comparisons.

Core structure:

- A central diagram or canvas with the economic object students manipulate.
- Controls grouped by intervention type.
- Welfare or outcome cards showing surplus, deadweight loss, revenue, quantity,
  price, or elasticities as relevant.
- Toggleable layers so students can isolate one mechanism at a time.
- A checkpoint after the first intervention: "What changed mechanically? What
  changed in welfare terms?"

Minimal state sketch:

```js
const state = {
  demand: { intercept: 100, slope: -1 },
  supply: { intercept: 10, slope: 1 },
  policy: { type: "none", amount: 0 },
  metrics: {}
};
```

## Structured Decision Calculator

Best for cost-benefit analysis, present value, project comparison, break-even
analysis, or other decision tools.

Core structure:

- Preset projects plus editable rows for instructor customization.
- Separate cost and benefit tables with year, amount, growth, and notes.
- Horizon and discount-rate controls with clear defaults.
- Decision cards such as net present value, benefit-cost ratio, internal rate of
  return, payback, or sensitivity results.
- A checkpoint asking when the recommendation changes and which assumption
  drives the reversal.

Minimal state sketch:

```js
const state = {
  rows: [{ kind: "benefit", year: 1, amount: 1000, growth: 0 }],
  horizon: 20,
  discountRate: 0.03,
  decisionMetrics: {}
};
```

## Transfer Or Benchmark Tool

Best for benefit transfer, valuation comparisons, meta-analysis summaries, or
methods where students choose reference studies or benchmark cases.

Core structure:

- Scenario tabs or a guided source-selection sequence.
- A table of candidate studies or reference cases with inclusion toggles.
- A visible adjustment formula, such as income, geography, time, or unit
  conversion.
- Sensitivity controls for elasticities or transfer assumptions.
- A checkpoint comparing two methods that can plausibly produce very different
  values.

Minimal state sketch:

```js
const state = {
  scenarioId: "demo-site",
  selectedStudies: new Set(),
  adjustment: { incomeElasticity: 1.0, unit: "per-year" },
  estimate: null
};
```

## Solo-First Game Engine

Best for market games, auctions, repeated decisions, trading simulations, or
strategic games that may later become multiplayer.

Core structure:

- A local single-player version with bot opponents or scripted scenarios.
- A pure model engine separated from rendering code.
- A small `model_spec` defining agents, decision space, payoff or clearing
  rules, randomization ranges, and edge cases.
- An explorer screen where students can inspect their own payoff, cost, value,
  or strategy curve before playing.
- A final debrief comparing observed play to the model benchmark.

Minimal state sketch:

```js
const state = {
  round: 1,
  player: { budget: 100, inventory: 0, strategy: null },
  bots: [],
  market: { orders: [], clearingPrice: null },
  history: []
};
```

## Multiplayer Classroom Flow

Best for activities where student interaction itself is the learning object:
public goods, markets, voting, ESG screening, resource allocation, bargaining,
or forecasting.

Core structure:

- Separate instructor, student, and projection screens.
- A phase machine with explicit states: lobby, instructions, decision,
  reflection pause, reveal, debrief, next round, final summary.
- Room codes, reconnect behavior, timer synchronization, export/reset/delete,
  and a non-networked fallback.
- Instructor-controlled pauses after meaningful rounds or reveals.
- Projection prompts that connect aggregate behavior to the target concept.

Minimal session sketch:

```js
const session = {
  meta: { phase: "lobby", round: 0, timerEnd: null },
  students: {},
  rounds: {},
  publicResults: {},
  debriefs: {}
};
```

## Strategic Chapter Game

Best for prisoner's dilemma, common-pool resources, repeated games, signaling,
screening, or other concepts where formal terms should appear after experience.

Core structure:

- Three to five chapters with a linear flow.
- Each chapter includes player action, system logic, feedback or visualization,
  and a concept reveal.
- Navigation stays locked until the required action is complete.
- The final chapter names the formal model and summarizes what students should
  now be able to explain.

Minimal state sketch:

```js
const state = {
  chapter: 1,
  choices: {},
  unlocked: { 1: true },
  conceptReveals: {},
  finalReflection: ""
};
```

## Verification Focus

- Units, formulas, labels, random draws, and edge cases are visible and
  testable.
- Presets, benchmarks, and scenarios map to source notes.
- Students can reset or restart before the next activity.
- The diagram, formula, and text explanation agree.
- The module names simplifying assumptions rather than hiding them.
- Projection and student screens never expose private per-student information.
- The instructor guide explains exactly when to pause and what to ask.
