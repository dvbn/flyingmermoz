# Firebase Multiplayer Teaching Game Pipeline

## Purpose

Produce a real-time classroom game with separate instructor, student, and
projection screens; a concrete Firebase Realtime Database contract; deployment
guidance; verification notes; and a non-networked fallback plan.

This pipeline should not ask the LLM to invent the backend. Use
`checklists/firebase-realtime-runtime.md` and
`templates/firebase-multiplayer/` as the default runtime contract. Use
`templates/interactive-html-patterns/README.md` and
`checklists/pedagogical-moments.md` for classroom-flow design.

## Suitable Use Cases

- In-class simulations where students join a shared room.
- Instructor-led games with rounds, timers, dashboards, aggregate results, or
  private student information.
- Activities that need temporary room state but not a full custom backend.
- Market, negotiation, allocation, voting, forecasting, or team-decision games.

## Inputs

- Course name, level, target audience, and expected class size.
- Interaction language for the planning conversation.
- Output language for the game and guides.
- Learning objectives and source packet or source paths, converted to `.md`,
  `.tex`, `.txt`, `.json`, CSV, or another machine-readable format before the
  agent run unless already cleanly machine-readable.
- Source hierarchy: canonical, supporting, assessment, private, quarantine.
- Game concept, phases, rounds, scoring, roles, constraints, and debrief goals.
- Pedagogical moments: strategy pause, aggregate reveal, concept bridge,
  instructor debrief, or final reflection.
- Data policy: anonymous, pseudonymous, named, export-only, or no persistence.
- Firebase plan: existing project, new project, emulator/local prototype, or
  fallback-only.
- Deployment target: local, static host, Netlify, Firebase Hosting, LMS link, or
  other platform.
- Time/token budget and verification depth.
- Output directory, normally `work/<project-name>/`.

## User Decisions

Ask the instructor to choose:

- Learning objectives and classroom format.
- Interaction language and output language.
- Tone and emoji preference, with emojis off by default unless explicitly
  requested.
- Visual direction: no added visuals, diagrams only, instructor-provided images,
  AI-generated images, or a mixed visual package.
- Branding/colors: HEC-inspired academic palette by default unless another
  brand system is provided.
- Footer attribution: default Flying Mermoz footer, or instructor
  override/removal if needed.
- Brevity defaults: 3-6 planning questions at a time, concise instructions,
  and bounded student responses unless the instructor expands the scope.
- Student identity mode and data-retention policy.
- Whether free-text student responses are collected.
- Room lifecycle: create, join, start, pause, transition rounds, reveal results,
  export, close, and delete.
- Pedagogical pause design: when the instructor stops the game, what students
  discuss, what appears on the projection screen, and which course concept is
  named after the experience.
- Instructor controls and projection-screen content.
- Firebase risk level: prototype classroom rules, Firebase Auth, server-mediated
  instructor actions, or fallback-only.
- Deployment target and installation support needed.

## LLM Autonomy Boundaries

The LLM may propose:

- Phase machine, room lifecycle, and screen flow.
- Pedagogical pause phases and projection debrief prompts.
- Room code format and local fallback behavior.
- Realtime Database schema under `games/<game-id>/sessions/{roomCode}/`.
- Placeholder Firebase config and rules templates.
- Instructor/student/projection UI layout and verification tests.

The instructor decides:

- Whether Firebase or any external service is allowed.
- Whether student data is collected and how long it persists.
- Whether identifiers are anonymous, pseudonymous, or named.
- Whether broad prototype rules are acceptable for the class context.
- Whether stronger authentication or server-mediated teacher actions are
  required before deployment.

The LLM must not:

- Publish real Firebase project IDs, database URLs, API keys, passwords,
  deployment URLs, student data, or private source details.
- Present client-side teacher passwords as real security.
- Recommend broad `.read: true, .write: true` rules without labeling them as
  prototype-only.
- Skip the fallback plan or the three-screen dry run.
- Add emojis, generic decorative images, or AI-generated visuals by default.

Default colors should follow an HEC-inspired academic palette: deep navy
`#002855`, accent blue `#0072CE`, teal `#00AEC7`, light blue `#e6f1fa`, white,
and neutral grays. Generated artifacts should include a small footer by default:
"Created with Flying Mermoz, an open-source toolkit for educational content."

## Step-By-Step Workflow

1. Ask clarifying questions about objectives, class size, roles, phase flow,
   language choices, tone, emoji preference, visual direction, branding/colors,
   data policy, pedagogical pauses, room lifecycle, Firebase access, deployment,
   fallback needs, time/token budget, and verification depth.
2. Classify sources and confirm that raw documents have already been converted
   to machine-readable formats. If not, stop for preprocessing.
3. Draft a plan with game loop, phase machine, pedagogical pause map, Firebase
   root path, room schema, write ownership, rules risk level, screen list,
   expected files, fallback behavior, and checks.
4. Audit the plan against `checklists/firebase-realtime-runtime.md`; resolve
   unresolved assumptions with the instructor before production.
5. Build a deterministic local version of the game flow first, with no Firebase
   dependency required to inspect the UI and rules.
6. Add Firebase integration behind `firebase-config.example.js` placeholders.
7. Implement instructor room creation, student join/reconnect, projection
   `?room=XXXX`, `meta/timerEnd` timer sync, phase transitions, submissions,
   reflection pauses, result publishing, export/reset/delete behavior, and
   fallback mode.
8. Write `USER_GUIDE.md`, `DEPLOYMENT.md`, `VERIFICATION.md`, and
   `SOURCE_NOTES.md`.
9. Run a three-context dry run: instructor page, student page, projection page.
10. Ask the instructor to test with a small group or three browser profiles.
11. Revise through another question, audit, and production pass if comments are
    provided.
12. If there are no comments, offer help configuring Firebase, Netlify or
    Firebase Hosting, database rules, LMS links, QR codes, and classroom run
    instructions.

## Expected Outputs

Write to `work/<project-name>/` unless the instructor chooses another path:

- `instructor.html`
- `student.html`
- `screen.html`
- `firebase-config.example.js`
- `firebase-rules.prototype.json`
- `firebase-rules.schema-example.json` or stronger project-specific rules
- optional local fallback file or mode
- `USER_GUIDE.md`
- `DEPLOYMENT.md`
- `VERIFICATION.md`
- `SOURCE_NOTES.md`

The generated schema should start from this public-safe shape:

```text
games/<game-id>/sessions/{roomCode}/
  meta/{phase, createdAt, updatedAt, timerEnd, status}
  students/{studentId}/{displayName, joinedAt, lastSeen, connected}
  rounds/{roundId}/submissions/{studentId}/{payload, submittedAt}
  rounds/{roundId}/reflections/{studentId}/{payload, submittedAt}
  publicResults/{roundId}/{payload, publishedAt}
  debriefs/{roundId}/{prompt, concept, revealedAt}
  privateMessages/{studentId}/{payload, sentAt}
```

Game-specific branches must state their writer, reader, size cap, and retention
policy. Examples:

- `orders/{roundId}/{studentId}` for market games.
- `marketResults/{roundId}` for clearing-price games.
- `allocations/{roundId}/{studentId}` for budget-allocation games.
- `tips/{studentId}` or `privateMessages/{studentId}` for private signals.
- `debriefs/{roundId}` for instructor-published concept bridges.

In auth-free Realtime Database games, per-student private branches are
client-filtered only. They may be acceptable for low-risk classroom hints, but
they are not suitable for sensitive student information unless Firebase Auth or
server-mediated reads are added.

## Verification Gates

- Gate 0: unresolved questions about student data, Firebase, identifiers,
  deployment, rules risk level, and time/token budget are answered or explicitly
  deferred.
- Gate 1: sources are classified and private material is excluded from public
  output.
- Gate 2: objectives, language choices, tone, emoji preference, visual direction,
  branding/colors, footer attribution, brevity caps, data policy, room lifecycle,
  pedagogical pause map, time/token budget, deployment, and output path are
  locked.
- Gate 3: local flow works without Firebase; Firebase calls fail gracefully when
  unconfigured; fallback mode is available.
- Gate 4: Realtime Database root path, schema, write ownership, timer sync,
  reconnect behavior, rules caveat, export/reset/delete behavior, and
  `?room=XXXX` projection flow are documented.
- Gate 5: instructor, student, and projection screens pass a full dry run with
  no uncaught browser-console errors; at least one reflection pause, aggregate
  reveal, and final debrief are tested.
- Gate 6: the bundle includes user, deployment, verification, source notes, and
  the approved footer attribution unless disabled; no secrets, real Firebase
  credentials, personal information, student data, copied private material, or
  process clutter appear in public-facing files.

## Review And Revision Loop

Ask the instructor to test room creation, student joining, projection updates,
phase transitions, timer sync, submissions, results, export, reset/delete, and
fallback mode. If comments are provided, clarify only what is needed, revise the
plan, update files, and rerun the functional checks.

Remind the instructor that polished multiplayer flow is not verification. They
must read, test, and edit the game before sharing it with students.

## Installation Or Deployment Assistance

If the instructor has no further comments, offer help with:

- Creating a Firebase project and enabling Realtime Database.
- Registering a Web app and copying the same Firebase config into all screens.
- Choosing a region and disabling Analytics unless needed.
- Setting prototype or stronger database rules.
- Deploying to Netlify, Firebase Hosting, or a static site.
- Testing instructor, student, and projection URLs.
- Creating QR codes or LMS links for the student page.
- Cleaning old rooms after class.

## Low-Token Path

- Produce a local deterministic multiplayer mock first.
- Use anonymous room codes and no persistent student identifiers.
- Provide Firebase schema and rules as placeholders.
- Use prototype rules only with a clear warning.
- Include one instructor-controlled pause and one final projection debrief.
- Keep deployment notes concise.

## Enriched Path

- Add instructor dashboards, export tools, accessibility checks, emulator tests,
  detailed Firebase security notes, cleanup tooling, QR codes, and print-ready
  fallback instructions.
- Add game-specific math or clearing algorithms when the source packet defines
  them.
- Add richer classroom orchestration: strategy prompts before decisions,
  round-by-round aggregate reveals, private hint or signal mechanics when
  pedagogically justified, and instructor notes for connecting behavior to the
  course model.
- Search official Firebase or hosting documentation when current setup details,
  pricing, limits, or console labels are required.

## Failure Modes And Recovery

- Firebase setup unavailable: use fallback local or instructor-led mode.
- Firestore chosen by accident: stop and switch to Realtime Database unless the
  plan was explicitly changed.
- `databaseURL` missing: Realtime Database is not configured or the wrong SDK
  config was copied.
- `PERMISSION_DENIED`: rules block the room path; show the exact root path to
  review.
- Projection not updating: verify `?room=XXXX`, same Firebase config, and the
  database root path.
- Room state bugs: simplify schema and verify one transition at a time.
- Client password risk: explain that it is classroom friction only, not a
  security boundary.
- Classroom network risk: provide printable or projected fallback instructions.

## Public/Private Content Policy

The instructor is responsible for student privacy, service configuration,
source rights, institutional approval, and deployment review. Do not publish
real Firebase configs, passwords, API keys, student data, private course files,
copied readings, answer keys, personal information, or identifying metadata.

Firebase web config may be pasted into a private generated artifact when the
instructor approves it, but public templates and examples must use placeholders.

## Example Status And Sanitized Example Plan

Use toy room data and placeholder Firebase identifiers. A typical multiplayer
plan can look like this:

- Pattern: multiplayer classroom flow with a solo-first fallback.
- Screens: instructor control panel, student decision page, projection dashboard.
- Phases: lobby, instructions, decision, strategy pause, aggregate reveal,
  debrief, next round, final summary.
- Schema: `submissions` for decisions, `publicResults` for class aggregates,
  `debriefs` for instructor-published prompts, and optional `privateMessages`
  only for low-risk hints.
- Pedagogical moments: before round 2, ask students whether they changed
  strategy; after the reveal, project aggregate behavior and name the relevant
  concept; after the final round, ask students to explain the gap between
  individual incentives and collective outcome.
- Verification: run three browser contexts, refresh each screen, test timer
  sync, test `PERMISSION_DENIED`, export/delete a test room, and run the
  fallback instructions.

Example public-safe plan shape:

- Build a three-screen allocation game in `work/example-room-game/`.
- Use `games/example-room-game/sessions/{roomCode}/` as the root path.
- Use anonymous display names capped at 80 characters.
- Store one bounded JSON submission per student per round.
- Publish only aggregate results to the projection screen.
- Use prototype rules for local dry-run documentation, with a warning that
  repeated public use needs Firebase Auth or server-mediated instructor writes.
- Include deployment, verification, source, and cleanup notes.

## Public Presentation Requirements

Public outputs should read as professional setup and teaching documentation.
Do not include prompt logs, internal notes, model chatter, LLM-coauthor framing,
private source excerpts, real Firebase identifiers, or course-specific
passwords.
