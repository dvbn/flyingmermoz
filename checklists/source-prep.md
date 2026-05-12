# Source Preparation Checklist

Use this checklist before running any artifact pipeline. The goal is to start
from clean, machine-readable course material instead of asking the artifact
agent to parse raw documents during generation.

## Required Source Shape

- Convert PDFs, slides, documents, scans, web exports, video, and audio to
  `.md`, `.tex`, `.txt`, `.json`, CSV, timestamped transcripts, or another
  structured format unless the source is already cleanly machine-readable.
- Keep one source packet per run, with clear filenames and no unrelated files.
- Preserve page, slide, section, or timestamp references when they help the
  instructor verify claims later.
- Separate canonical teaching material from supporting material, assessments,
  private notes, answer keys, transcripts, RAG corpora, and quarantine files.
- Keep private and copyrighted originals outside the public repo.

## Preferred Path

- Use local or institution-approved extraction tools when available.
- OCR scans before asking an LLM to interpret them.
- Clean the extracted files before generation: remove duplicate headers,
  footers, page numbers, OCR noise, broken tables, repeated slide titles, and
  irrelevant boilerplate.
- Spot-check formulas, tables, accents, citations, and figure captions.
- Record source boundaries in `SOURCE_NOTES.md` or an internal source manifest.
- For video or audio, preserve timestamps and review transcripts before treating
  them as canonical source material.

## Parser-Agent Fallback

If local extraction is unavailable, the instructor may use a separate,
source-approved document-parser skill or PDF-to-Markdown agent pass. Hosted or
external parser use requires approval for the specific source material being
sent.

For Claude Code users, this can be a dedicated parser-skill or parsing-agent
pass that converts PDFs or slides to Markdown, followed by a separate cleaning
pass. This is acceptable when approved by the instructor, but it is still
preprocessing and it usually costs more tokens than starting from local
extraction. Use `skills/pdf-to-markdown/SKILL.md` as the public-safe parser
workflow when a chunk-first LLM parser is needed.

For recordings, use `skills/media-to-transcript/SKILL.md` as the public-safe
workflow. Prefer local transcription for private classroom recordings, keep
media and transcripts out of the public repository, and classify reviewed
transcripts before artifact generation.

Treat this as preprocessing, not artifact generation:

1. Parse the raw document to Markdown, LaTeX, text, JSON, or structured tables.
2. Clean the parsed output in a separate pass.
3. Review the cleaned source against the original document.
4. Classify each cleaned file as canonical, supporting, assessment, private, or
   quarantine.
5. Run the selected artifact pipeline only after the cleaned source packet is
   ready.

This option works, but it is usually token-expensive. Do not spend the main
artifact-generation context parsing a large PDF if a cleaned source packet can
be prepared first.

## Verification

- Confirm the cleaned source packet contains no secrets, credentials, student
  data, answer keys intended for students, private URLs, or personal metadata.
- Confirm copied source text is not published directly unless the instructor has
  the rights and explicitly approves it.
- Confirm generated public artifacts use summaries, exercises, diagrams, and
  newly authored explanatory text rather than dumping private source extracts.
- If parser-agent extraction was used, keep raw parser logs and intermediate
  files out of public-facing outputs.
- If video/audio transcription was used, confirm recordings, extracted audio,
  raw transcripts, model caches, and proof-of-concept outputs are not tracked.
