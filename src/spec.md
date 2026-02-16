# Specification

## Summary
**Goal:** Add a configurable external website link to the Earn app so users can navigate to the user’s website from the app.

**Planned changes:**
- Add a configurable external link (URL + label, defaulting to “Website”) to the primary navigation (desktop) and mobile menu.
- Add the same configurable external link to the global footer alongside existing attribution link(s).
- Implement safe external-link behavior (open in new tab with `rel="noopener noreferrer"`) and hide the link everywhere when no valid URL is configured.

**User-visible outcome:** Users see a “Website” link in the app navigation and footer (when configured) that opens the configured external site in a new browser tab.
