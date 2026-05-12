# Cost Notes

The starter keeps costs bounded by default:

- 150-word and 1,200-character student input cap
- 450 output-token cap for reflection feedback
- 10 LLM calls per session
- 20 ask requests per minute per function instance
- daily budget gate from `WIZARD_DAILY_BUDGET_USD`

Set token prices with:

```text
LLM_INPUT_USD_PER_M_TOKENS=<input-price>
LLM_OUTPUT_USD_PER_M_TOKENS=<output-price>
```

Estimated cost is recorded from provider token usage when positive prices are
configured. If prices are missing or zero, live LLM calls fail closed so the
budget cap cannot be silently bypassed.
Before class, estimate:

```text
expected cost = students * interactions per student * average cost per call
```

Keep mocked responses enabled until the instructor approves live calls and the
budget cap is configured.
