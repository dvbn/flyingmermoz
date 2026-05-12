# Firebase Multiplayer Template

This template is a public-safe contract for generating a real-time classroom
game with Firebase Realtime Database. It is intentionally not a complete game;
it gives the agent enough structure to build one without guessing the backend.

## Generated Project File Set

This template folder ships only the reusable contract plus Firebase config and
rules examples. A generated project should include:

```text
instructor.html
student.html
screen.html
firebase-config.example.js
firebase-rules.prototype.json
firebase-rules.schema-example.json
USER_GUIDE.md
DEPLOYMENT.md
VERIFICATION.md
SOURCE_NOTES.md
```

## Runtime Contract

- Three screens: instructor control panel, student interaction page, projection
  page.
- Static-first frontend: HTML/CSS/JS, Firebase Web SDK by CDN, no npm required.
- Realtime Database root: `games/<game-id>/sessions/{roomCode}/`.
- Room codes: uppercase alphanumeric, 4-8 characters.
- Student identity: anonymous or pseudonymous by default; named only if the
  instructor approves it.
- Pedagogical phases: include at least one instructor-controlled pause, one
  aggregate reveal, and one final debrief.
- Data retention: delete test and classroom rooms manually or through a
  generated cleanup function.
- Deployment: any static host, with Netlify as the default guide target.

## Firebase Console Setup Checklist

Use the official Firebase setup docs when generating a project-specific guide;
console labels can change. The generated `DEPLOYMENT.md` should still give the
instructor this concrete sequence:

- Create or choose a Firebase project.
- Add a Web app and copy the web config into the private generated
  `firebase-config.js`; keep public templates on `firebase-config.example.js`.
- Create a Realtime Database, choose a region, and copy the exact
  `databaseURL` into the config.
- Start from locked mode or a clearly labeled prototype rule set; never publish
  broad public read/write rules as a production recommendation.
- Paste the generated rules into the Realtime Database Rules tab and confirm the
  root path matches `games/<game-id>/sessions/{roomCode}/`.
- Deploy the static files to Netlify, Firebase Hosting, an LMS, or another
  static host.
- Test instructor, student, and projection URLs with one room before class.
- Delete the test room and document the classroom cleanup procedure.

## Generic Session Schema

```text
games/<game-id>/sessions/{roomCode}/
  meta/
    phase
    createdAt
    updatedAt
    timerEnd
    status
  students/{studentId}/
    displayName
    joinedAt
    lastSeen
    connected
  rounds/{roundId}/submissions/{studentId}/
    payload
    submittedAt
  rounds/{roundId}/reflections/{studentId}/
    payload
    submittedAt
  publicResults/{roundId}/
    payload
    publishedAt
  debriefs/{roundId}/
    prompt
    concept
    revealedAt
  privateMessages/{studentId}/
    payload
    sentAt
```

Game-specific schemas should extend this shape with explicit write ownership.
For example, a market game may add `orders/{roundId}/{studentId}` and
`marketResults/{roundId}`; an investment game may add
`allocations/{roundId}/{studentId}`, `tips/{studentId}`, and
`realizedReturns/{roundId}`.

`firebase-rules.schema-example.json` assumes Firebase Auth is enabled, student
records are written by `auth.uid`, and instructor-only writes use a custom claim
such as `auth.token.role == 'instructor'`. The example caps `payload` as a JSON
string for portability; generated projects may replace it with a stricter
object schema when the game-specific fields are known.

In prototype or auth-free games, `privateMessages` is only client-filtered, not
cryptographically private. Without Firebase Auth or server-mediated reads, use
it only for low-risk classroom hints or signals. Do not store sensitive student
information there.

## Required Implementation Notes

- Use `firebase.database.ServerValue.TIMESTAMP` for writes that need server
  timestamps.
- Use `meta/timerEnd` as the synchronized timer source. Clients compute
  remaining time locally from that timestamp.
- Model the classroom as a phase machine. Typical phases are `lobby`,
  `instructions`, `decision`, `reflection`, `reveal`, `debrief`, `nextRound`,
  and `closed`.
- Use `sessionStorage` to reconnect the current browser to the same student or
  instructor room after refresh.
- Use idempotent writes for purchases, tips, orders, or submissions.
- Use transactions for shared mutable balances such as budgets, points,
  permits, or tokens.
- Keep projection reads public and instructor-only actions separate in the
  schema.
- Show clear recovery messages for missing config, missing room, and
  `PERMISSION_DENIED`.

## Security Baseline

The Firebase web config is not a secret. The database rules and data model are
the real security controls.

Prototype classroom rules can be useful for a low-risk dry run, but they are
not a professional security model. For a repeated public deployment, add
Firebase Auth, server-mediated instructor actions, or a deliberate no-sensitive-
data classroom policy with short-lived rooms.

Official references to check when writing a generated deployment guide:

- Firebase Realtime Database web setup:
  `https://firebase.google.com/docs/database/web/start`
- Realtime Database security rules:
  `https://firebase.google.com/docs/database/security`

## Verification

Before classroom use, test with three browser contexts:

1. Create a room in `instructor.html`.
2. Join from `student.html` with the room code.
3. Open `screen.html?room=XXXX`.
4. Run every phase transition and one full round.
5. Refresh each screen and confirm recovery.
6. Trigger one Firebase rules error intentionally and verify the message is
   understandable.
7. Delete the test room from Realtime Database.
