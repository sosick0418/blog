# Coupang Partners Integration Discovery

## Overview

This document summarizes the research findings for integrating Coupang Partners (쿠팡 파트너스) affiliate program into the auto-blog system.

## Integration Method

### Primary Approach: Coupang Partners API

Coupang provides a REST API for affiliates to programmatically access product data and generate affiliate links.

**API Requirements:**
1. Coupang Partners membership (partners.coupang.com)
2. API key approval requires cumulative purchases of 150,000 KRW (approximately $115 USD)
3. HMAC-SHA256 authentication using Access Key and Secret Key

**Note:** Until the 150,000 KRW sales threshold is met, manual product data entry with affiliate link generation via the web dashboard is the fallback approach.

## API Capabilities

Based on research of the Coupang Partners API (via community wrappers and documentation):

### Available Endpoints

| Method | Description |
|--------|-------------|
| `create_deeplink` | Generate affiliate links from product URLs |
| `search_products` | Search products by keyword |
| `get_goldbox_offers` | Retrieve time-limited promotional deals |
| `get_best_category_products` | Fetch bestsellers by category |
| `get_recommended_products` | Device-specific product recommendations |
| `get_coupang_pl_products` | Coupang private label products |

### Authentication

- **Method:** HMAC-SHA256 signature
- **Credentials Required:**
  - `ACCESS_KEY` - API access credential
  - `SECRET_KEY` - API secret credential
- **Request Header:** Authorization header with HMAC signature

### Response Format

- **Format:** JSON
- **Product Data Includes:**
  - Product ID
  - Product name
  - Price information
  - Product URL (requires conversion to affiliate link)
  - Image URLs
  - Category information
  - Rating/review data

## Affiliate Link Structure

### URL Format

Affiliate links use the domain `link.coupang.com`:

```
https://link.coupang.com/re/AFFSDP?lptag={PARTNER_ID}&subid={TRACKING_ID}&pageKey={PRODUCT_ID}
```

### Key Parameters

| Parameter | Description |
|-----------|-------------|
| `lptag` | Partner/affiliate ID (assigned by Coupang) |
| `subid` | Custom tracking parameter for traffic source identification |
| `pageKey` | Product identifier |

### SubID Usage

- Used for distinguishing traffic sources (e.g., blog post, category, campaign)
- Up to 10 channel IDs can be registered per account
- Essential for tracking performance across different content pieces

## API Rate Limits

Specific rate limits were not found in public documentation. Standard practice suggests:
- Implement reasonable delays between requests
- Cache responses where appropriate
- Monitor API responses for rate limit errors

## Limitations and Constraints

1. **API Access Threshold:** 150,000 KRW cumulative sales required before API key approval
2. **Korean Market Only:** Coupang operates primarily in South Korea
3. **Product Data:** Some product data may require additional API calls to fetch complete details
4. **Link Expiration:** Deeplinks may have expiration policies (verify with actual API usage)

## Workaround for Pre-API Phase

Until API access is approved:

1. **Manual Product Entry:** Add product data to post frontmatter manually
2. **Dashboard Link Generation:** Use Coupang Partners web dashboard to generate affiliate links
3. **Simple Link Creation:** Via dashboard: Link Generation > Simple Link Creation > Paste product URL

## Data Schema Mapping

### API Response to Post Frontmatter

```javascript
// API response fields -> Post frontmatter fields
{
  productName: 'product.name',
  productPrice: 'product.price',
  productRating: 'product.rating',
  productUrl: 'product.affiliateLink', // After deeplink conversion
  productImage: 'product.image'
}
```

## Implementation Recommendations

1. **Phase 1 (Current):** Build module skeleton that supports both manual entry and future API integration
2. **Phase 2:** Implement API integration once credentials are obtained
3. **Configuration:** Use environment variables for all sensitive credentials
4. **Tracking:** Include subId in all generated links for analytics

## References

- Coupang Partners Official: https://partners.coupang.com/
- Coupang Developers Portal: https://developers.coupangcorp.com/hc/en-us
- Community Python Wrapper (PCoupangAPI): https://github.com/JEJEMEME/PCoupangAPI
- Auto Coupang Partners Example: https://github.com/Jongjineee/auto_coupang_partners

---
*Researched: 2026-01-15*
