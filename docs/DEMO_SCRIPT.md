# Demo Video Script (target 2:45, hard cap 3:00)

**Recording:** Win+Alt+R (Xbox Game Bar) or OBS, 1080p, Slack in light mode, close other windows/notifications. Speak slowly; silence beats filler. **No background music** (rules prohibit third-party audio).

**Prep before recording:**
- `npm start` running, seed already posted and indexed (run seed ≥15 min earlier).
- Slack open in `#debriefs-anon`; assistant panel closed; App Home visited once already.
- Second monitor/phone with this script.

---

### Shot 1 — Hook (0:00–0:20) · face or title slide optional, else just Slack
> "Volunteer crisis counselors have the hardest conversations on the internet, and in the moment many of them freeze — the phrase they need is buried in a teammate's debrief from eight months ago. Crisis Companion is a Slack agent that gives them that phrase back in three seconds."

### Shot 2 — Channel debrief (0:20–1:10) · screen: #debriefs-anon
Type and send:
```
@Crisis Companion Debrief: caller was expressing hopelessness and talked about ending things tonight. She mentioned having pills at home. I froze near the end and I'm not sure my closing helped her.
```
While the reply appears, narrate:
> "The agent classifies this as time-critical suicidal ideation — deterministically, with a vetted lexicon. No generative AI touches a life-critical response, so it cannot hallucinate. It suggests phrasing from a clinically-grounded library, then does what no generic chatbot can: using Slack's Real-time Search API, it finds *this team's own past debriefs* of similar sessions —"

Click one **Past case** permalink, show the original seeded debrief:
> "— including exactly what worked last time. And through an MCP server, it pulls curated helplines and an escalation protocol."

### Shot 3 — Privacy (1:10–1:40) · same channel
Send:
```
@Crisis Companion Caller named Priya, phone +91 98765 43210, is afraid to go home, partner is violent.
```
Point at the reply's 🔒 footer:
> "Privacy is architectural. The name and phone number were scrubbed *before* any search query left this thread — the footer shows the redactions. Search only runs across an allow-list of anonymised channels, and nothing is ever stored."
(Optional 5s: @mention it in a non-approved channel, show the refusal.)

### Shot 4 — Live assistant thread (1:40–2:15) · open ✨ assistant panel
Click the suggested prompt **“Live panic support”** (or type it):
> "Mid-session, volunteers use the private assistant thread. A texter is panicking right now — the agent returns grounding phrasing, the panic protocol, and country-aware helplines from the MCP server, all inside Slack, all in seconds."

### Shot 5 — Home tab + close (2:15–2:45) · App Home
> "The Home tab is a shift dashboard — sessions supported, in memory only, gone on restart. Crisis Companion turns a helpline's Slack from a chat tool into institutional memory: Slack AI's agent surface, the Real-time Search API, and MCP, working as one calm co-pilot for the people who keep others alive. Crisis Companion — built for the Slack Agent for Good track."

---

**Upload:** YouTube, visibility **Public**, title "Crisis Companion — Slack Agent Builder Challenge (Agent for Good)". Copy the link into the Devpost form.
