# Devpost form — copy-paste pack

**Track:** Slack Agent for Good
**Project name:** Crisis Companion
**Elevator pitch (tagline):** An ambient co-pilot for crisis-helpline volunteers: vetted de-escalation phrasing, your team's own hard-won experience via Slack's Real-time Search API, and curated referral resources via MCP — in seconds, with privacy enforced in code.

---

## About the project (main description)

### Inspiration
Text-based crisis lines run on volunteers, and volunteers freeze. The knowledge that would unfreeze them — how a teammate handled a nearly identical session — exists, but it's buried in months-old debrief threads. Meanwhile, generic AI chatbots are exactly the wrong answer in a life-critical setting: a hallucinated hotline number is not a bug, it's a harm. We built the opposite: an agent whose intelligence is retrieval and whose content is vetted.

### What it does
Crisis Companion lives in a helpline team's Slack. When a volunteer @mentions it with a debrief in an approved channel, or messages it in its private assistant thread mid-session, it:
1. **Scrubs PII** (names, phones, emails, ages, IDs) before anything leaves the thread.
2. **Classifies** the crisis type (suicidal ideation, self-harm, domestic violence, substance use, panic, grief) and intensity with a deterministic lexicon — no generative model in the loop, zero hallucination by construction.
3. **Searches the team's own anonymised debrief history** with Slack's Real-time Search API (`assistant.search.context`), surfacing similar past cases with permalinks — including "what worked" language from teammates.
4. **Calls an MCP server** for curated, country-aware helplines and a step-by-step response protocol.
5. Replies with one calm Block Kit message: suggested phrasing, past cases, resources, protocol — plus a footer showing exactly what was redacted and where search was allowed to look.

A Home-tab "Shift Dashboard" shows sessions supported this shift (in memory only). Time-critical classifications pin a safety-first escalation note to the top of the reply.

### How we built it
- **Node.js + Bolt for JavaScript**, Socket Mode; the `Assistant` class powers the private thread experience (suggested prompts, status, titles).
- **Slack Real-time Search API**: `assistant.search.context` with the event's short-lived `action_token`; results are re-filtered against a channel allow-list in code, so even an over-broad search result can never reach the volunteer.
- **MCP server** (`@modelcontextprotocol/sdk`, stdio transport): a separate `crisis-resources` process exposing `find_helplines(country, crisis_type)` and `get_protocol(crisis_type)` over a curated directory covering 9 countries plus international fallbacks. The agent can only reach resource data through the MCP protocol.
- **Deterministic core**: lexicon classifier + clinically-grounded phrase library, chosen deliberately over an LLM for the response path.

### Required technology
- ✅ **Real-time search API** — semantic search over the organisation's own Slack history (the heart of the product).
- ✅ **MCP server integration** — curated crisis-resource tools.
- ✅ **Slack AI capabilities** — built on the AI-apps agent surface (assistant threads, suggested prompts, status).

### Challenges
- Designing a privacy pipeline strong enough for a crisis context: scrub-before-search, allow-list enforcement on both input (where the agent responds) and output (which search results survive), zero persistence.
- Making a bot-token Real-time Search call work correctly with short-lived `action_token`s from `app_mention` and assistant-thread events.
- Writing de-escalation content responsibly: everything in the phrase library follows widely taught crisis-intervention practice (ask directly, validate, ground, never push).

### Accomplishments
A working agent where the *safety story is the architecture*: a judge can read the reply footer and see the redactions that happened, click a past-case permalink and land in the team's real (synthetic, anonymised) institutional memory, and restart the process to watch every trace of session data vanish.

### What we learned
Slack's history is an untapped clinical-adjacent knowledge base. Retrieval over a team's own experience beats generation for high-stakes support — and Slack is the only platform where that memory already lives.

### What's next
Volunteer feedback loops ("did this phrasing help?") to rank past cases; supervisor escalation flows; partnerships with real helpline networks (iCall, Crisis Text Line) to replace the curated dataset with their vetted resource databases via the same MCP interface.

---

## Impact statement (Agent for Good field)

Crisis-line capacity is bottlenecked by volunteer confidence and burnout, not demand. Every "freeze" moment risks a disconnection at the worst possible time, and every unsupported shift pushes a volunteer closer to quitting. Crisis Companion attacks both: in-the-moment phrasing support grounded in the team's own successful sessions, and calmer debriefs that turn every hard call into searchable institutional memory for the next volunteer. A pilot could measure freeze-moment reduction and de-escalation success from call-outcome logs; even a 20–30% improvement, across a single national helpline's volunteer base, translates to thousands of better-held conversations a year. The privacy-first, zero-hallucination design makes it deployable in a sector where trust is a hard requirement, and the MCP resource layer means any helpline can plug in its own vetted referral database without touching the agent.

---

## Testing instructions (for judges)

1. Sandbox: [PASTE SANDBOX URL]. Test access has been granted to slackhack@salesforce.com and testing@devpost.com.
2. In `#debriefs-anon`, mention the bot with a debrief, e.g.:
   `@Crisis Companion Debrief: caller expressing hopelessness, talked about ending things tonight, has pills at home.`
   → Expect: time-critical suicidal-ideation reply with safety note, 3 vetted phrases, similar past cases (permalinks into this channel's anonymised history via assistant.search.context), helplines + protocol via MCP, and a 🔒 privacy footer.
3. Include a fake name/phone in a mention (e.g. "caller named Priya, phone +91 98765 43210") → the footer reports PII redactions applied before search.
4. Mention the bot in any other channel → it declines (channel allow-list).
5. Open the Crisis Companion assistant panel (✨) → suggested prompts; try "Live panic support".
6. Click the bot's name → Home tab shows the in-memory Shift Dashboard.

**Built with:** node.js, bolt, slack-api, assistant-search-context, mcp, model-context-protocol, block-kit, socket-mode

**Links to add:** YouTube demo video · GitHub repo (optional but recommended — make it public) · architecture diagram image (docs/architecture.svg → screenshot/PNG in the image gallery)
