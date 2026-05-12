# Firebase Realtime Multiplayer Runtime Checklist

Use this checklist for classroom games that need live room state across an
instructor screen, student screens, and an optional projection screen.

## Architecture Contract

- Use **Firebase Realtime Database**, not Firestore, unless the instructor
  explicitly chooses a different backend.
- Build three public entry points by default:
  `instructor.html`, `student.html`, and `screen.html`.
- Keep the app static-first: vanilla HTML/CSS/JS, Firebase Web SDK by CDN, no
  build step unless the instructor asks for one.
- Keep all live state under one root path:
  `games/<game-id>/sessions/{roomCode}/`.
- Use one room code per class session. Normalize with uppercase alphanumeric
  characters, reject empty codes, and avoid ambiguous characters when practical.
- Store short-lived reconnect data in `sessionStorage`, never in public source
  files.

## Required Firebase Config Placeholder

Use placeholders in templates and public examples. In a private generated app,
the instructor may paste the real Firebase web config after review.

```js
const FIREBASE_CONFIG = {
  apiKey: "<firebase-web-api-key>",
  authDomain: "<project-id>.firebaseapp.com",
  databaseURL: "https://<project-id>-default-rtdb.firebaseio.com",
  projectId: "<project-id>",
  storageBucket: "<project-id>.appspot.com",
  messagingSenderId: "<sender-id>",
  appId: "<app-id>"
};
```

The Firebase web API key is designed to be visible in browser code. The
security boundary is the Realtime Database rules, not secrecy of this config.

## Minimum Database Shape

```text
games/<game-id>/sessions/{roomCode}/
  meta/
    phase: "setup" | "round_1" | "results_1" | "final" | "debrief"
    createdAt: <server timestamp>
    updatedAt: <server timestamp>
    timerEnd: <timestamp ms, 0 when inactive>
    status: "open" | "running" | "closed"
  students/{studentId}/
    displayName: "..."
    joinedAt: <server timestamp>
    lastSeen: <timestamp ms>
    connected: true|false
  rounds/{roundId}/submissions/{studentId}/
    payload: <bounded game-specific object>
    submittedAt: <server timestamp>
  publicResults/{roundId}/
    payload: <bounded public result object>
    publishedAt: <server timestamp>
  privateMessages/{studentId}/
    payload: <bounded private message object>
    sentAt: <server timestamp>
```

Add game-specific branches only after the plan defines their purpose,
permitted writer, permitted reader, and retention policy.

Without Firebase Auth or server-mediated reads, per-student branches such as
`privateMessages/{studentId}` are only client-filtered. They are acceptable for
low-risk classroom hints, but they are not a place for sensitive student data.

## Instructor Decisions To Lock

- Game identifier and root path.
- Class size and expected simultaneous devices.
- Whether students are anonymous, pseudonymous, or named.
- Whether any free-text student input is collected.
- Whether results are public, private, exported, or deleted after class.
- Whether the instructor page needs an access code, Firebase Auth, or a
  server-side teacher action endpoint.
- Room lifecycle: create, join, start, pause, transition rounds, reveal
  results, export, close, delete.
- Fallback mode if Wi-Fi, Firebase, or projection fails.

## Rules Policy

Prototype rules are acceptable only for a short-lived classroom test on a
dedicated database root:

```json
{
  "rules": {
    "games": {
      "$gameId": {
        "sessions": {
          "$roomCode": {
            ".read": true,
            ".write": true
          }
        }
      }
    }
  }
}
```

Label these rules as **prototype only**. They are not a strong public security
model because any browser user who knows the room path can write under it.

For a public or repeated deployment, require one of these before release:

- Firebase Auth with custom claims or role paths for instructor-only writes.
- Server-mediated instructor actions through Netlify/Firebase functions.
- A deliberately low-risk anonymous classroom deployment with a short-lived
  room, no sensitive data, and manual deletion after class.

At minimum, schema rules should reject unknown roots and oversized or wrongly
typed student writes. Client-side passwords are useful friction for classroom
UX, but they are not security boundaries.

## Setup Steps

1. Create a Firebase project and disable Analytics unless needed.
2. Create a **Realtime Database**. Do not use Firestore by accident.
3. Register a Web app and copy the Firebase web config.
4. Paste the exact same config into all three entry points or one shared config
   file.
5. Set database rules for the chosen risk level.
6. Deploy to Netlify, Firebase Hosting, or another static host.
7. Test with three browser contexts: instructor, student, projection.
8. Delete test rooms from Realtime Database before using the game in class.

## Verification Flow

- No template placeholders remain in the private generated app.
- The same Firebase config is used by all screens.
- Instructor creates a room and sees a room code.
- Student joins with code and display name.
- Projection opens with `?room=XXXX` and receives live updates.
- Phase transitions update all screens without refresh.
- `meta/timerEnd` drives synchronized countdowns on student and projection
  screens.
- Submissions are idempotent or clearly overwrite the previous submission.
- Student refresh restores identity through `sessionStorage`.
- Instructor refresh restores the active room without losing state.
- Firebase unavailable or `PERMISSION_DENIED` produces a clear recovery message.
- Export/reset/delete behavior matches the approved data-retention policy.
- Browser console has no uncaught errors during a complete dry run.

## Public Release Checks

- Public templates contain only placeholders, invented room data, and toy
  examples.
- No real Firebase project ID, database URL, API key, password, student name,
  course roster, private source text, or deployment URL is committed.
- Documentation says the instructor is responsible for privacy, copyright,
  institutional approval, and final classroom testing.
