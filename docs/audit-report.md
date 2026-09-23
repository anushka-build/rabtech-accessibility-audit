# Accessibility Audit Report

## Audited Website

https://www.india.gov.in/

## Audit Method

The website was audited using Google Chrome Lighthouse and keyboard-only navigation.

## Lighthouse Results

| Category | Score |
|---|---:|
| Performance | 32 |
| Accessibility | 81 |
| Best Practices | 92 |
| SEO | 100 |

## Identified Accessibility Issues

### WEB-001 — ARIA Parent Relationship

**Severity:** High

Lighthouse reported that ARIA roles were not contained by their required parent elements.

**Recommendation:** Ensure ARIA roles follow the required parent-child relationships.

### WEB-002 — Color Contrast

**Severity:** Medium

Lighthouse reported insufficient contrast between some foreground and background colors.

**Recommendation:** Improve color contrast to meet WCAG requirements.

### WEB-003 — List Structure

**Severity:** Medium

Some list items were not contained within appropriate `ul`, `ol`, or `menu` elements.

**Recommendation:** Use proper semantic list containers.

### WEB-004 — Touch Target Size

**Severity:** Medium

Some touch targets did not have sufficient size or spacing.

**Recommendation:** Increase target size and spacing for easier interaction.

### WEB-005 — Main Landmark

**Severity:** Medium

The document did not have a main landmark.

**Recommendation:** Add an appropriate `<main>` landmark around the primary content.
