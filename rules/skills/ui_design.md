# UI/UX Design Skill

Load this when: building interfaces, styling components, designing layouts, implementing visual design.

---

## Design Philosophy

**Style:** Apple aesthetic—sleek, minimalist, refined, elegant.

**Colors:** Default palette is grey, silver, black, white. Use tiny pops of color for accents (CTAs, highlights). Avoid rainbow vomit. Avoid 90s plainness.

**Principle:** "Trying too much" is uglier than minimalism. But plain white MS Paint is also bad. Find the balance.

---

## Layout Patterns

**Spacing:** Generous whitespace. Don't cram. Let elements breathe.

**Hierarchy:** Clear visual hierarchy—important things bigger/bolder, secondary things muted.

**Alignment:** Everything aligns to a grid. No random positioning.

**Typography:** Max 2 fonts. Use weight/size for hierarchy, not different fonts.

---

## Component Style

**Buttons:** Rounded corners, subtle shadows, clear hover states. Primary actions stand out (slight color), secondary actions muted (grey/outline).

**Inputs:** Clean borders, clear focus states, inline validation feedback.

**Cards:** Subtle shadows or borders. Avoid heavy drop shadows.

**Navigation:** Simple, obvious. Don't hide things in hamburger menus unless mobile.

---

## Color Usage

**Base:** Start with greys/blacks for text and backgrounds.

**Accent:** One primary color for CTAs, links, key actions. Use sparingly.

**States:** Subtle color shifts for hover/active/disabled (don't go crazy).

**Errors:** Red, but muted. Warnings: amber. Success: green (all subtle, not neon).

---

## Responsive Design (Web Interfaces)

**Approach:** Design for multiple screen sizes. Start with smallest screen, scale up.

**Breakpoints:** Mobile, tablet, desktop. Keep it simple - don't over-complicate with 10 breakpoints.

**Touch Targets:** On touch devices (phones, tablets), buttons/links should be min 44x44px for easy tapping.

**Flexibility:** Layouts should adapt gracefully. Use CSS Grid/Flexbox. Test on different viewport sizes.

---

## What to Avoid

- Gradients (unless very subtle)
- Heavy shadows
- Overly rounded corners (slight rounding fine, pill shapes excessive)
- Animations that distract (subtle transitions fine, bouncing/spinning bad)
- Too many colors
- Inconsistent spacing

---

## Deliverable

**Goal:** Interface that looks clean, feels Apple-esque, doesn't distract from content.

**Quality Bar:** Would I be embarrassed showing this in a demo? If no, ship it.