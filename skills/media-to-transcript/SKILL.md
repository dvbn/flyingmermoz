---
name: media-to-transcript
description: Prepare video or audio source material for Flying Mermoz pipelines by normalizing approved media, producing timestamped transcripts, writing manifests, and enforcing privacy safeguards before source classification.
---

# Media To Transcript Source Preparation

Use this skill when an instructor has approved converting private video or audio
recordings into clean, machine-readable transcripts before running a teaching
artifact pipeline.

This is a public-safe summary of a local transcription workflow. It does not
include private videos, audio files, transcripts, credentials, course IDs, or
personal paths.

## When To Use

- The source packet includes videos, lecture recordings, interviews, podcasts,
  or audio clips.
- The instructor wants `.txt` and `.json` transcripts as input to another
  pipeline.
- The instructor has approved the transcription backend and data-sharing path.
- A cleaned transcript will be reviewed and classified before artifact
  generation.

Do not use this skill as part of artifact generation. Treat it as preprocessing:
transcribe first, review and clean the transcript, classify the source, then run
the selected artifact pipeline.

## Safety Rules

- Keep recordings, extracted audio, transcripts, subtitle files, model caches,
  and proof-of-concept runs out of the public repository.
- Prefer local transcription for private classroom recordings.
- Do not upload recordings, extracted audio, or transcripts to hosted services
  without explicit instructor approval.
- Store manifests with source basenames only; avoid absolute local paths in
  publishable outputs.
- Do not treat transcripts as canonical unless the instructor says so.
- Mark uncertain terms, names, equations, citations, and timestamps for review.

## Supported Inputs

Accept common media files such as:

```text
.aac .aif .aiff .flac .m4a .m4v .mkv .mov .mp3 .mp4 .mpeg .mpg .ogg .opus .wav .webm
```

Reject unrelated files instead of guessing.

## Recommended Pipeline

1. Create private `input/`, `output/`, and `models/` directories.
2. Discover supported media files, optionally recursively.
3. Run a health check for `ffmpeg` and the selected transcription backend.
4. Extract or normalize WAV audio with `ffmpeg`.
5. Transcribe the WAV with the approved backend.
6. Write timestamped plain text and structured JSON.
7. Write a manifest with source basename, output filenames, backend, model,
   language hint, clip settings, and creation timestamp.
8. Review the transcript against the recording.
9. Clean obvious transcription errors in a separate pass.
10. Classify the cleaned transcript as canonical, supporting, private,
    assessment, or quarantine before using it downstream.

## Audio Extraction Or Normalization

For video inputs, extract the audio track and normalize it for transcription:

```bash
ffmpeg -hide_banner -loglevel error -y \
  -i input.mp4 \
  -vn -ac 1 -ar 16000 -c:a pcm_s16le output/audio/input.wav
```

For audio-only inputs, use the same normalization target:

```bash
ffmpeg -hide_banner -loglevel error -y \
  -i input.m4a \
  -ac 1 -ar 16000 -c:a pcm_s16le output/audio/input.wav
```

For a smoke test or partial extraction, use start and duration controls:

```bash
ffmpeg -hide_banner -loglevel error -y \
  -ss 0 -i input.mp4 -t 300 \
  -vn -ac 1 -ar 16000 -c:a pcm_s16le output/audio/input.wav
```

## Transcription Backend

Recommended local backend:

- `faster-whisper` for local Whisper transcription.
- `tiny` for a fast smoke test.
- `small` as a practical default.
- `medium` or larger when quality matters and hardware allows it.
- Add a language hint, such as `--language en` or `--language fr`, when known.

Use a mock backend only for tests and pipeline validation. It is not a real
transcript.

## Output Layout

Write outputs under a private output directory:

```text
output/
  audio/
    input-name.wav
  transcripts/
    input-name.txt
    input-name.json
  manifests/
    input-name.manifest.json
```

Text transcript format:

```text
[00:00:00] First segment.
[00:00:07] Second segment.
```

JSON transcript format should include segment start, end, text, language,
duration when available, backend, and model.

## Manifest Fields

Use a manifest such as:

```json
{
  "created_at": "YYYY-MM-DDTHH:MM:SSZ",
  "source_file": "input-name.mp4",
  "audio_file": "output/audio/input-name.wav",
  "transcript_text_file": "output/transcripts/input-name.txt",
  "transcript_json_file": "output/transcripts/input-name.json",
  "backend": "faster-whisper",
  "model": "small",
  "language": "en",
  "clip_start": null,
  "clip_duration": null
}
```

Avoid absolute host paths in manifests intended for publication or sharing.

## Verification

- Confirm the transcript exists in both `.txt` and `.json` formats.
- Spot-check the first minute, a middle section, and the final minute.
- Check timestamps remain monotonic.
- Check proper nouns, acronyms, formulas, citations, and technical terms.
- Check language detection or language hints.
- Check that silence, music, or low-quality audio did not create hallucinated
  transcript text.
- Check that generated transcripts are not committed unless explicitly intended
  and rights-cleared.
- Record limitations in `SOURCE_NOTES.md`, such as noisy audio, missing slides,
  multiple speakers, or unverified names.

## Downstream Use

After review, use transcripts as source material for lecture notes, wizards,
games, or exams only according to their classification:

- Canonical only if the instructor reviewed and approved the transcript.
- Supporting if it captures classroom phrasing but may contain errors.
- Private by default when it includes classroom discussion, student voices, or
  unreleased course material.
- Quarantine if transcription quality is too poor for reliable use.
