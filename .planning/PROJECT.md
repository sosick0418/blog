# Coupang Affiliate Auto-Blog

## What This Is

An automated affiliate marketing blog hosted on GitHub Pages that generates and publishes product review content using AI. The system pulls product data from Coupang Partners, uses LLM to write compelling reviews, and n8n orchestrates the fully automated pipeline from data sourcing to publication.

## Core Value

Generated content must be compelling and convert readers to affiliate clicks — without quality content, automation and SEO are worthless.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] 11ty blog deployed on GitHub Pages with SEO-optimized structure
- [ ] Coupang Partners API/data integration for product information
- [ ] LLM-powered content generation producing quality product reviews
- [ ] n8n workflow orchestrating the full automation pipeline
- [ ] Automated publishing directly to GitHub Pages without manual review
- [ ] Affiliate link integration with proper Coupang Partners tracking

### Out of Scope

- Multiple affiliate networks — Coupang Partners only for v1, no Amazon or others
- User comments/community features — no comment system, newsletter, or reader engagement
- Custom analytics dashboard — rely on basic tracking only, no custom analytics UI

## Context

The blog targets Korean market through Coupang Partners, Korea's largest e-commerce affiliate program. Content will be auto-generated product reviews designed to rank in search and convert to affiliate purchases.

The automation stack:
- **n8n** (self-hosted) — workflow orchestration
- **11ty** — static site generator
- **GitHub Pages** — free hosting
- **LLM** — content generation (free tier options)

This is a solo project focused on passive income through automated affiliate content.

## Constraints

- **Hosting**: Self-hosted n8n — must run on own infrastructure
- **Budget**: Free tier only — GitHub Pages, free LLM APIs, no paid services
- **Stack**: 11ty for static site generation — JavaScript ecosystem

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 11ty over Jekyll/Hugo | JavaScript-based keeps entire stack in one language ecosystem, flexible for automation | — Pending |
| Self-hosted n8n | User requirement, maintains control over automation | — Pending |
| Fully automatic publishing | No review step, maximize automation, accept quality tradeoffs | — Pending |
| Coupang-only affiliate | Focus on single network for v1, simplifies integration | — Pending |

---
*Last updated: 2026-01-15 after initialization*
