---
name: pdf-to-markdown
description: Prepare PDF source material for Flying Mermoz pipelines by converting approved PDFs into reviewed, timestamp/source-aware Markdown using a chunk-first extraction workflow with explicit privacy and publication safeguards.
---

# PDF To Markdown Source Preparation

Use this skill when an instructor has approved PDF parsing and needs clean,
machine-readable Markdown before running a teaching-artifact pipeline.

This is a public-safe summary of a chunk-first PDF extraction workflow. It does
not include private papers, private paths, generated extracts, credentials, or
course-specific content.

## When To Use

- The source packet contains PDFs that are not already available as clean
  Markdown, LaTeX, text, JSON, or structured tables.
- The instructor approves the token cost and any provider/data-sharing path.
- Local extraction tools are unavailable or insufficient for math-heavy,
  table-heavy, or scanned/visually complex PDFs.

Do not use this skill as part of artifact generation. Treat it as preprocessing:
extract first, clean and review the Markdown, classify the sources, then run the
selected artifact pipeline.

## Safety Rules

- Read PDFs from an `inbox/` directory and never modify the source PDFs.
- Write outputs to a separate `outbox/` directory through a staging or
  processing directory.
- Keep extracted copyrighted or private text out of the public repository.
- Use extracted Markdown as a private source packet unless the instructor has
  rights and explicitly approves publication.
- Do not send private, assessment, student, credential, or embargoed material to
  an external provider without explicit approval.
- Quarantine corrupt or unreadable PDFs rather than guessing.

## Recommended Pipeline

1. Preflight each PDF with `qpdf --check`.
2. If preflight fails, attempt a repaired copy with `qpdf --linearize`.
3. Quarantine the PDF with an error note if repair fails.
4. Count pages with `qpdf --show-npages`, falling back to a PDF library only if
   needed.
5. Split the PDF into small consecutive chunks, usually five pages per chunk.
6. Extract each chunk in parallel with an approved provider.
7. Preserve source page numbers in every extraction prompt.
8. Merge chunks in order.
9. Clean only adjacent chunk seams using small boundary windows, not the whole
   document.
10. Insert an explicit extraction-gap marker if a chunk is missing.
11. Build a small manifest of figures, tables, equations, page count, chunk
   count, extraction provider, and known errors.
12. Review the Markdown against the PDF before classifying it as canonical,
   supporting, assessment, private, or quarantine.

## Chunk Extraction Prompt

Use provider-specific transport wrappers, but keep the core instructions
provider-neutral:

```text
You are an academic PDF extraction specialist. Extract all content from the PDF
chunk into structured Markdown with LaTeX math.

Rules:
- Convert mathematical notation to LaTeX. Use $...$ for inline math and $$...$$
  for display math. Preserve equation numbers when present.
- For each figure, write: ![Figure N: brief academic description]().
  Describe axes, trends, and displayed quantities concisely.
- Format tables in Markdown pipe syntax. Preserve numbers and labels exactly.
- Reproduce text as written. Do not paraphrase, summarize, or rewrite. Fix only
  obvious rendering artifacts.
- Preserve citation markers and section structure.

Output only the extracted Markdown. Do not add commentary, summaries, code
fences, or explanations. The chunk corresponds to source pages START through
END.
```

## Provider Wrappers

Claude-style wrapper:

- Give the model read-only access to the chunk PDF.
- Ask it to inspect only the requested page range.
- Allow only the file-read tool needed for extraction.
- Use a small max-turn cap so extraction does not become open-ended.

Codex/OpenAI-style wrapper:

- Render chunk pages locally to page images first, for example with `pdftoppm`.
- Attach the images to the model call in page order.
- Tell the model to use only those images as the source of truth.
- Tell the model not to run shell commands, inspect local files, or ask for more
  input during extraction.

## Seam Cleaning Prompt

Clean only the boundary between consecutive chunks:

```text
You are a document quality specialist. Below is text from the boundary between
two consecutive chunks of an academic PDF extraction.

Tasks:
- Merge a sentence or paragraph split across the boundary.
- Remove duplicated headings, paragraphs, or overlap text.
- Fix LaTeX equations that span the boundary.
- Preserve all other content exactly as-is.

Output only the cleaned boundary text. Do not paraphrase, summarize, or remove
non-duplicate content.
```

Use a small context window, such as 30 lines before and after the boundary.
If seam cleaning fails, fall back to a raw join rather than dropping content.

## Default Configuration

Good first-pass defaults:

```yaml
extraction:
  chunk_size: 5
  timeout_per_page: 60
  max_chunk_timeout: 900
  cleaning_timeout: 600
  max_retries: 1
workers:
  count: 3
  parallel_agents: 2
  max_global_agents: 6
  sort: size
queue:
  heartbeat_interval: 120
  lease_duration: 600
  resume_stale: true
cleanup:
  keep_intermediates: false
  min_free_space_mb: 500
```

Tune down worker counts when provider limits, local memory, or token budgets are
tight.

## Output Bundle

For each PDF, write a private extraction folder such as:

```text
outbox/<hash>_<stem>/
  paper.md
  metadata.json
  manifest.txt
  extraction-log.txt
```

The metadata should include source filename, content hash, page count, chunk
count, extraction status, provider family, model identifier if useful locally,
timestamps, and warnings. Public examples should replace these with placeholders
or omit provider/model details.

## Verification

- Check that page order is preserved.
- Spot-check the first page, a math-heavy page, a table-heavy page, and the last
  page against the PDF.
- Check that equations are valid enough for downstream LaTeX or Markdown use.
- Check that tables preserve numbers, signs, units, and headers.
- Check that figures have useful descriptions rather than empty placeholders.
- Check that no extraction gap marker is present unless it is intentionally
  documented.
- Check that the source classification is updated before any artifact pipeline
  uses the extracted Markdown.
