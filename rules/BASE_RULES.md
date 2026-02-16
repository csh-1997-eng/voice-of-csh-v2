# Base Rules - Always Loaded

## A) Identity & Voice

**Name:** Cole
**Role:** Applied AI engineer, sales engineer, founder
**Context:** I code in front of clients, demo frequently, iterate fast, prioritize business value over academic perfection
**Philosophy:** Build for financial outcomes. "Best practices" only matter if they move us toward goals. Hybrid product owner + engineer.
**Working Style:** Prefer tangible over abstract—love diagrams, demos, examples, analogies

**Interests:** Basketball, football, psychology, philosophy, fashion, design

---

## B) Aesthetic Samples (Voice Reference)

### Philosophical Example
Creation is one of the most important parts of being a human. We wonder why we exist, what our purpose is, and it seems obvious that it is to learn, grow and create. Eventually, we will probably create things which will learn grow and create on their own, which is probably similar to what our 'God' did with us, which is similar to what our descendants do for us and what we will do for our descendants. But this leaves us with a question, why? What motivates us to continue doing this? Other people do. This is why (not because) we are such social creatures. It is the motivation and fuel that propels us to continue to learn, grow and create which is our principle function during existence. Okay enough of the deep stuff; This is why I love being a founder, a builder, and a salesman. I love to create, to share, and when others have a higher opinion of me because of the things i've learned and built. I want others to respect me for my ability to learn and build, and I want to be able to share the experience with other people. Ultimately the way people communicate their value for things we build is in the marketplace by exchanging currency, which is why being financial successful for the things I've built is also so important. I just hope all of the hours I spend working on learning and building rewards me with the respect and money I desire, so that maybe I can use that respect and money to influence more of our society to be a better place for everyone.

### Humor Example
me: Imagine if I got a drone, we launch the drone from my roof and film ourselves trying fly through the city. These are the things I think about on my commute. Try to take water balloon bombing runs on cars on the bridge
friend: Load the drone with water balloons and ruin some ppls days haha
other friend: just a glimpse into coles gifted mind
me: "Splash one bandit". Society needs neurodivergents like me, what can I say

### Technical Example
friend: "Hey Cole, I'm refactoring some of our user management code and I'm not sure about the best approach. Right now I have a `create_user()` function that spins up its own database connection inside the function body. It works fine, but I'm wondering if there's a better pattern here. Should I be doing something different with how I handle the database connection? What's your take on this?"

me: "I like passed in, which I believe is dependency injection, as opposed to defined locally. This is because I believe nothing should be 'created' within the function (i.e. a function which generates a new user in the database shouldnt create the database connection within the function itself, but it also shouldnt reference some random global variable. functions are the core unit of code, inputs goes in, outputs come out. anything that "hides" inputs from the function caller is usually bad. Does that make sense?"

---

## C) Core Code Style

**Verbosity:** Avoid verbose code, comments, docs, tests. Keep it concise.

**Comments:** Inline comments for important steps. Functions/classes get docstrings with example usage (one-stop reference, not distributed docs).

**Structure:** No excessive modules or deep nesting. Avoid 80-level inheritance. Also avoid 800 files with zero folder structure—find balance.

**Typing:** Always use strong typing (Python type hints, Pydantic, TypeScript). Use dataclasses/Pydantic models liberally—prevents sloppy data, makes code self-documenting. Centralize type definitions in descriptive folders (`custom_data_types`, `models`) with clear names (e.g., `UserActionOnFlopJsonObject`). Don't over-type trivial utilities.

**Portability:** Code must work across environments (containers, notebooks). Example: Python code runs in container via runtime script but can be copied to .ipynb and run identically.

**Testing (when required):** Concise sanity checks covering key failure modes, not exhaustive edge cases. If changing a function without tests, PAUSE and ask for test cases.

---

## D) Security & Privacy (NON-NEGOTIABLE)

**Core Principle:** I'm extremely nervous about security. Never expose me or users to hackers.

**Git Commits:** BEFORE committing, review for sensitive data (API keys, credentials, PII, internal endpoints). If uncertain, ASK.

**Deployment:** Security audit required before deploy. No exceptions.

**User Data:** Encrypt at rest, encrypt in transit, validate inputs, sanitize outputs. Never log passwords, tokens, PII.

**Tradeoffs:** If speed vs. safety conflict, default to safety. Let me decide if I want risk.

---

## E) Error Handling

**Try/Except Usage:** Use liberally. For ML pipelines, log what failed, then raise error (don't let bad data reach models). For demos, try/except + log is acceptable—I debug fast.

**API Calls & DB Writes:** Always wrap in try/except. Only write to DB when input is validated—garbage in, garbage out. We store data to use it later.

**Complexity:** Avoid overly complex exception logic. Simple is better.

**Event Systems:** Use dead letter queue (DLQ) for retries. When DLQ reaches capacity, fail gracefully.

---

## F) Dependency Injection & State Management

**Core Principle:** Functions receive everything they need as parameters. If it needs a DB, API client, or data, put it in the signature.

**Do NOT:** Create connections/clients/resources inside functions. Do NOT reference global variables for business logic.

**Why:** Makes demos clearer, easier to test (mock objects), prevents hidden dependencies that cause bugs during iteration.

**Exceptions:** Pure utility functions (math, strings) can stand alone. Config, DB pools, logging, framework instances (Flask, FastAPI) can be global/module-level.

**Pattern:** Create resources once at top level (main/composition root), pass down through calls.

---

## G) Handling Uncertainty

**Small vs. Large Changes:** When uncertain, err on doing it but be explicit about what changed and why.

**Stop & Plan:** If change touches >5 files, changes core architecture, or might break demos, propose plan first.

**Don't Ask For:** Obvious things (adding function, fixing bug, styling).

**DO Ask Before:** Refactoring core logic, changing DB schemas, switching frameworks/patterns.

---

## H) Optimization

**Default:** Do NOT preemptively optimize unless requested. Most annoying: AI generates 800 lines handling every error during prototyping.

**Data Processing:** Do NOT optimize unless I specify. I include data size and compute params in prompts.

---

## I) UI/UX

**Style:** Apple aesthetic—sleek, minimalist, refined, elegant. Colors: grey, silver, black, white with tiny pops of color. Avoid "trying too much" but also avoid 90s MS Paint plainness.

---

## J) Workflow: Experiment → Demo → Deploy

**"Done" Means:** Works in demo, has basic error handling (try/except where needed), won't blow up if used as intended.

**Iteration Cycle:** experiment → demo → experiment → demo → experiment → demo → tighten/cohesive → hardcore demo → security audit → deploy

**Demo-Ready:** Works reliably, looks clean, I can explain to client without embarrassment.

**During Iteration:** Messy test code, debug prints, prototyping artifacts are fine—clean up when tightening before deploy.

**Throwaway Code:** Say so explicitly—I'll decide if it needs hardening.

**Security:** BEFORE deployment, security audit (NON-NEGOTIABLE). BEFORE git commit, review for sensitive data. If uncertain, ASK.

---

## Skills Reference

For specialized workflows, see `rules/skills/`:
- `security_audit.md` - Deep security review
- `prototyping.md` - Fast iteration mode
- `ui_design.md` - Interface implementation
- `database_design.md` - Schema & query optimization
- `testing.md` - Test strategy details
- `production.md` - Monitoring & alerts

Load skills as needed based on task context.