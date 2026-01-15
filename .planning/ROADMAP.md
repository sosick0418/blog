# Roadmap: Coupang Affiliate Auto-Blog

## Overview

Build an automated affiliate marketing blog that transforms Coupang product data into SEO-optimized content through an LLM-powered pipeline, orchestrated by n8n and deployed automatically to GitHub Pages. The journey progresses from static site foundation through content automation to fully hands-off publishing.

## Domain Expertise

None

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - 11ty project setup with Korean language support ✓
- [x] **Phase 2: SEO Infrastructure** - Meta tags, sitemap, robots.txt, structured data ✓
- [x] **Phase 3: Blog Template System** - Product review templates and responsive layouts ✓
- [x] **Phase 4: Coupang Integration** - Coupang Partners API/data integration ✓
- [x] **Phase 5: LLM Content Pipeline** - AI-powered product review generation ✓
- [x] **Phase 6: n8n Workflow Setup** - Automation workflow orchestration ✓
- [x] **Phase 7: GitHub Pages Deployment** - CI/CD and automated deployment ✓
- [x] **Phase 8: End-to-End Integration** - Full pipeline testing and validation ✓

## Phase Details

### Phase 1: Foundation
**Goal**: Working 11ty blog with basic structure, Korean language support, and development environment
**Depends on**: Nothing (first phase)
**Research**: Unlikely (11ty setup, established patterns)
**Plans**: TBD

Plans:
- [x] 01-01: 11ty project initialization and configuration ✓
- [x] 01-02: Base layout and Korean language setup ✓
- [x] 01-03: Development workflow and local testing ✓

### Phase 2: SEO Infrastructure
**Goal**: Search engine optimization foundation for Korean market visibility
**Depends on**: Phase 1
**Research**: Unlikely (standard SEO practices)
**Plans**: TBD

Plans:
- [x] 02-01: Meta tags and Open Graph setup ✓
- [x] 02-02: Sitemap and robots.txt generation ✓
- [x] 02-03: Structured data for product reviews ✓

### Phase 3: Blog Template System
**Goal**: Reusable templates optimized for product review content
**Depends on**: Phase 2
**Research**: Unlikely (internal templating patterns)
**Plans**: TBD

Plans:
- [x] 03-01: Product review page template ✓
- [x] 03-02: Index and category pages ✓
- [x] 03-03: Responsive styling and mobile optimization ✓

### Phase 4: Coupang Integration
**Goal**: Pull product data from Coupang Partners for content generation
**Depends on**: Phase 3
**Research**: Likely (external API integration)
**Research topics**: Coupang Partners API documentation, affiliate link structure, product data format, rate limits
**Plans**: TBD

Plans:
- [x] 04-01: Coupang Partners API research and authentication ✓
- [x] 04-02: Product data fetching and transformation ✓
- [x] 04-03: Affiliate link generation with tracking ✓

### Phase 5: LLM Content Pipeline
**Goal**: AI-generated product reviews that convert readers to affiliate clicks
**Depends on**: Phase 4
**Research**: Likely (LLM API, prompt engineering)
**Research topics**: Free-tier LLM options (Claude, GPT, open source), prompt engineering for product reviews, Korean language generation quality
**Plans**: TBD

Plans:
- [x] 05-01: Gemini API client module setup ✓
- [x] 05-02: Korean prompt templates ✓
- [x] 05-03: LLM integration with post generation ✓

### Phase 6: n8n Workflow Setup
**Goal**: Automated workflow orchestrating the full content pipeline
**Depends on**: Phase 5
**Research**: Likely (n8n integration patterns)
**Research topics**: n8n self-hosted setup, workflow triggers, GitHub integration, error handling patterns
**Plans**: TBD

Plans:
- [x] 06-01: n8n Environment Setup ✓
- [x] 06-02: Content Pipeline Workflow ✓
- [x] 06-03: Error Handling and Monitoring ✓

### Phase 7: GitHub Pages Deployment
**Goal**: Automated deployment pipeline from content generation to live site
**Depends on**: Phase 6
**Research**: Unlikely (standard GitHub Actions patterns)
**Plans**: TBD

Plans:
- [x] 07-01: GitHub Actions workflow for 11ty build ✓
- [x] 07-02: GitHub Pages configuration and deployment verification ✓

### Phase 8: End-to-End Integration
**Goal**: Validated, fully automated pipeline from Coupang data to published content
**Depends on**: Phase 7
**Research**: Unlikely (internal testing and validation)
**Plans**: TBD

Plans:
- [x] 08-01: Pipeline integration testing ✓
- [x] 08-02: Live deployment and n8n production configuration ✓
- [x] 08-03: Documentation and operational runbook ✓

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Complete | 2026-01-15 |
| 2. SEO Infrastructure | 3/3 | Complete | 2026-01-15 |
| 3. Blog Template System | 3/3 | Complete | 2026-01-15 |
| 4. Coupang Integration | 3/3 | Complete | 2026-01-15 |
| 5. LLM Content Pipeline | 3/3 | Complete | 2026-01-15 |
| 6. n8n Workflow Setup | 3/3 | Complete | 2026-01-15 |
| 7. GitHub Pages Deployment | 2/2 | Complete | 2026-01-15 |
| 8. End-to-End Integration | 3/3 | Complete | 2026-01-15 |

**🎉 PROJECT COMPLETE - 24/24 plans executed**
    