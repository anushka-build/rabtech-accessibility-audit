# rabtech-accessibility-audit

Accessibility audit and full-stack project architecture for the RabTech Academy task.

## 1. Project Overview

This repository contains the accessibility audit and initial full-stack project foundation created for the RabTech Academy assignment.

The public website audited for this task is:

https://www.india.gov.in/

The audit was performed using Google Chrome Lighthouse and a keyboard-navigation review.

## 2. Accessibility Audit

### Lighthouse Results

| Category | Score |
|---|---:|
| Performance | 32 |
| Accessibility | 81 |
| Best Practices | 92 |
| SEO | 100 |

### Identified Issues

| Issue ID | Issue | Severity | Recommended Action |
|---|---|---|---|
| WEB-001 | ARIA roles are not contained by their required parent element | High | Fix the ARIA hierarchy and ensure roles are used with their required parent elements. |
| WEB-002 | Background and foreground colors do not have sufficient contrast | Medium | Update text/background color combinations to meet WCAG contrast requirements. |
| WEB-003 | List items are not contained within ul, ol, or menu elements | Medium | Place list items inside the appropriate semantic list container. |
| WEB-004 | Touch targets do not have sufficient size or spacing | Medium | Increase interactive target size and provide adequate spacing between targets. |
| WEB-005 | Document does not have a main landmark | Medium | Add an appropriate main landmark to identify the primary page content. |

The detailed audit report is available in:

`accessibility-audit-report.xlsx`

## 3. Architecture

The project follows a monorepo-style structure:

```text
rabtech-accessibility-audit/
│
├── client/
│   └── README.md
│
├── server/
│   └── README.md
│
├── docs/
│   └── README.md
│
├── test/
│   └── README.md
│
├── accessibility-audit-report.xlsx
├── README.md
└── .gitignore
