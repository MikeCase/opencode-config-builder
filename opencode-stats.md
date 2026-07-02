# OpenCode Usage Statistics

**Generated:** 2026-06-16  
**Scope:** All-time stats (73 days)

---

## Overview

| Metric | Value |
|--------|-------|
| **Sessions** | 516 |
| **Messages** | 30,286 |
| **Days** | 73 |
| **Total Cost** | $266.12 |
| **Avg Cost/Day** | $3.65 |
| **Avg Tokens/Session** | 5.9M |
| **Median Tokens/Session** | 128.9K |
| **Total Input** | 134.4M |
| **Total Output** | 8.9M |
| **Cache Read** | 2,851.5M |
| **Cache Write** | 43.3M |

---

## OpenCode Go Models

Models under the `opencode-go/` namespace.

| Model | Messages | Input | Output | Cache Read | Cache Write | Cost |
|-------|----------|-------|--------|------------|-------------|------|
| `minimax-m2.7` | 9,241 | 28.3M | 3.2M | 789.8M | 23.3M | $59.77 |
| `deepseek-v4-flash` | 4,393 | 12.4M | 2.2M | 855.9M | 0 | $4.75 |
| `kimi-k2.5` | 2,283 | 7.3M | 1.0M | 204.8M | 0 | $27.94 |
| `minimax-m2.5` | 1,787 | 4.5M | 621.3K | 160.2M | 8.7M | $6.89 |
| `glm-5` | 1,068 | 3.0M | 788.2K | 61.7M | 0 | $17.84 |
| `qwen3.5-plus` | 280 | 26.7M | 65.3K | 9.3M | 1.1M | $5.88 |
| `kimi-k2.6` | 89 | 302.7K | 36.3K | 4.6M | 0 | $0.56 |
| `mimo-v2.5` | 59 | 247.5K | 26.2K | 4.7M | 0 | $0.06 |
| `deepseek-v4-pro` | 11 | 150.6K | 4.4K | 1.3M | 0 | $0.30 |
| **Total** | **19,211** | **~82.9M** | **~7.94M** | **2,092.3M** | **33.1M** | **$123.99** |

---

## OpenCode Zen Models

Models under the `opencode/` namespace.

| Model | Messages | Input | Output | Cache Read | Cache Write | Cost |
|-------|----------|-------|--------|------------|-------------|------|
| `big-pickle` | 2,402 | 11.9M | 647.8K | 214.7M | 3.6M | $0.00 |
| `kimi-k2.5` | 961 | 2.6M | 240.2K | 131.1M | 0 | $12.78 |
| `claude-sonnet-4-6` | 806 | 1.0K | 199.5K | 173.8M | 5.8M | $76.93 |
| `minimax-m2.5` | 771 | 2.3M | 123.1K | 88.0M | 0 | $6.12 |
| `minimax-m2.5-free` | 650 | 3.5M | 136.8K | 58.8M | 194.8K | $0.00 |
| `gpt-5-nano` | 646 | 3.3M | 654.5K | 22.4M | 0 | $0.21 |
| `qwen3.6-plus-free` | 223 | 23.4M | 84.1K | 0 | 0 | $0.00 |
| `claude-opus-4-5` | 210 | 92 | 35.4K | 22.2M | 432.2K | $14.70 |
| `gpt-5.1-codex` | 176 | 406.9K | 41.7K | 31.0M | 0 | $4.10 |
| `gpt-5.4` | 155 | 998.8K | 104.9K | 14.8M | 0 | $7.78 |
| `claude-sonnet-4` | 42 | 49 | 5.7K | 2.2M | 67.3K | $1.01 |
| `nemotron-3-super-free` | 36 | 803.0K | 19.1K | 0 | 0 | $0.00 |
| `gpt-5.4-pro` | 7 | 551.6K | 9.9K | 0 | 0 | $18.34 |
| `claude-haiku-4-5` | 3 | 17 | 8.2K | 103.1K | 91.1K | $0.17 |
| **Total** | **7,088** | **~49.8M** | **~2.31M** | **~759.3M** | **~10.2M** | **$142.13** |

---

## Summary Comparison

| Category | Messages | Input | Output | Cache Read | Cache Write | Cost |
|----------|----------|-------|--------|------------|-------------|------|
| **Go Models** | 19,211 | 82.9M | 7.94M | 2,092.3M | 33.1M | **$123.99** |
| **Zen Models** | 7,088 | 49.8M | 2.31M | 759.3M | 10.2M | **$142.13** |
| **Combined** | **26,299** | **132.7M** | **10.25M** | **2,851.6M** | **43.3M** | **$266.12** |

> **Note:** Local models (`myollama/gemma4-131k`, `myollama/gemma4`, `myollama/ministral3-14b-262k`, `myollama/qwen2.5-coder`, `ollama/gemma4`) are excluded per request. They account for 41 messages with negligible cost ($0.00), making up the remaining messages to reach the total of 30,286.

---

## Top Models by Cost

| Rank | Model | Type | Cost |
|------|-------|------|------|
| 1 | `claude-sonnet-4-6` | Zen | $76.93 |
| 2 | `minimax-m2.7` | Go | $59.77 |
| 3 | `gpt-5.4-pro` | Zen | $18.34 |
| 4 | `glm-5` | Go | $17.84 |
| 5 | `claude-opus-4-5` | Zen | $14.70 |
| 6 | `kimi-k2.5` (Go) | Go | $27.94 |
| 7 | `kimi-k2.5` (Zen) | Zen | $12.78 |
| 8 | `gpt-5.4` | Zen | $7.78 |
| 9 | `minimax-m2.5` (Go) | Go | $6.89 |
| 10 | `minimax-m2.5` (Zen) | Zen | $6.12 |

## Top Models by Messages

| Rank | Model | Type | Messages |
|------|-------|------|----------|
| 1 | `minimax-m2.7` | Go | 9,241 |
| 2 | `deepseek-v4-flash` | Go | 4,393 |
| 3 | `big-pickle` | Zen | 2,402 |
| 4 | `kimi-k2.5` | Go | 2,283 |
| 5 | `minimax-m2.5` | Go | 1,787 |
| 6 | `glm-5` | Go | 1,068 |
| 7 | `kimi-k2.5` | Zen | 961 |
| 8 | `claude-sonnet-4-6` | Zen | 806 |
| 9 | `minimax-m2.5` | Zen | 771 |
| 10 | `minimax-m2.5-free` | Zen | 650 |

