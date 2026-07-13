# Demo Video Script (target 2:55, hard cap 3:00)

**Recording:** Win+Alt+R (Xbox Game Bar) or OBS, 1080p, Slack in light mode, close other windows/notifications. Speak slowly; silence beats filler. **No background music** (rules prohibit third-party audio).

**Prep before recording:**
- Bot is deployed on Railway (always-on) — no need to run `npm start` locally; just confirm the Railway deployment logs show it's up.
- Seed corpus already posted and indexed (run seed ≥15 min earlier if not already done).
- Slack open in `#debriefs-anon`; `#crisis-resources` open in a second window/tab so the escalation alert is visible without switching; App Home visited once already.
- Second monitor/phone with this script.

---

### Shot 1 — Hook (0:00–0:15) · face or title slide optional, else just Slack
> "Volunteer crisis counselors have the hardest conversations on the internet, and in the moment many of them freeze. Crisis Companion is a Slack agent that gets them the right words back in seconds — and can put a human supervisor in the loop instantly, sometimes before they even ask."

### Shot 2 — Channel debrief, auto-escalation (0:15–1:05) · screen: #debriefs-anon
Type and send:
```
@Crisis Companion Debrief: caller was expressing hopelessness and talked about ending things tonight. She mentioned having pills at home. I froze near the end and I'm not sure my closing helped her.
```
While the reply appears, narrate:
> "It classifies this as time-critical suicidal ideation — deterministically, with a vetted lexicon, so it cannot hallucinate a hotline number or bad advice. It suggests phrasing from a clinically-grounded library, searches this team's own past debriefs for similar sessions using Slack's Real-time Search API — across messages *and* shared training files — and pulls curated helplines and a protocol through an MCP server."

Point at the "Supervisor notified automatically" note in the reply, then cut to `#crisis-resources` to show the alert already sitting there:
> "Notice it didn't wait to be told. It recognised this was time-critical and looped in a supervisor itself, with a direct link back to the original message."

### Shot 3 — Manual escalation, volunteer's own call (1:05–1:35) · #debriefs-anon
Send a different, non-time-critical debrief:
```
@Crisis Companion Debrief: teenager cutting themselves after school bullying, said they don't want their parents to know.
```
Click **🚨 Escalate to supervisor** on that reply:
> "For anything the agent doesn't flag automatically, the volunteer stays in control — one click escalates on their own judgment, any time."

### Shot 4 — Privacy (1:35–2:00) · back to #debriefs-anon
Send:
```
@Crisis Companion Caller named Priya, phone +91 98765 43210, is afraid to go home, partner is violent.
```
Point at the reply's 🔒 footer:
> "Privacy is architectural. The name and phone number were scrubbed before any search query left this thread — the footer proves it. Search only runs across an allow-list of anonymised channels, and nothing is ever stored."

### Shot 5 — DM / live assistant thread (2:00–2:25) · DM the bot
Send a message directly to Crisis Companion:
```
Texter is having a panic attack right now, hyperventilating and terrified. What can I say?
```
> "Mid-session, volunteers just message the agent directly — grounding phrasing, the panic protocol, and country-aware helplines from the MCP server, all inside Slack, all in seconds."

### Shot 6 — Home tab + close (2:25–2:55) · App Home
Click **📋 View all protocols** to show the modal, close it, then narrate over the dashboard:
> "The Home tab is a live shift dashboard: every 'Helped' or 'Didn't land' click calibrates an effectiveness score, escalations are tracked, and every protocol is one click away. Crisis Companion turns a helpline's Slack from a chat tool into institutional memory that can act — Slack AI's agent surface, the Real-time Search API, and MCP, working as one calm co-pilot for the people who keep others alive. Crisis Companion — built for the Slack Agent for Good track."

---

**Upload:** YouTube, visibility **Public**, title "Crisis Companion — Slack Agent Builder Challenge (Agent for Good)". Copy the link into the Devpost form.
