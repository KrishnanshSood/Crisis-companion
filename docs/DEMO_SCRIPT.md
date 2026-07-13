# Demo Video Script (target 2:50, hard cap 3:00)

**Recording:** Win+Alt+R (Xbox Game Bar) or OBS, 1080p, Slack in light mode, close other windows/notifications. Speak slowly; silence beats filler. **No background music** (rules prohibit third-party audio).

**Prep before recording:**
- `npm start` running, seed already posted and indexed (run seed ≥15 min earlier).
- Slack open in `#debriefs-anon`; `#crisis-resources` open in a second window/tab so the escalation alert is visible without switching; App Home visited once already.
- Second monitor/phone with this script.

---

### Shot 1 — Hook (0:00–0:15) · face or title slide optional, else just Slack
> "Volunteer crisis counselors have the hardest conversations on the internet, and in the moment many of them freeze. Crisis Companion is a Slack agent that gets them the right words back in seconds — and can put a human supervisor in the loop instantly if it's beyond words."

### Shot 2 — Channel debrief (0:15–1:00) · screen: #debriefs-anon
Type and send:
```
@Crisis Companion Debrief: caller was expressing hopelessness and talked about ending things tonight. She mentioned having pills at home. I froze near the end and I'm not sure my closing helped her.
```
While the reply appears, narrate:
> "It classifies this as time-critical suicidal ideation — deterministically, with a vetted lexicon. No generative AI touches a life-critical response, so it cannot hallucinate. It suggests phrasing from a clinically-grounded library, then does what no generic chatbot can: using Slack's Real-time Search API, it finds this team's own past debriefs of similar sessions, and through an MCP server, pulls curated helplines and a response protocol."

### Shot 3 — Live escalation (1:00–1:30) · same reply, then switch to #crisis-resources
Click **🚨 Escalate to supervisor** on the reply from Shot 2:
> "And if a volunteer needs an actual human right now, one click escalates — live — to the shift lead's channel, with a direct link back into this thread."

Cut to `#crisis-resources`, show the alert land in real time:
> "This is the loop closing: ambient AI guidance handing off to a real person, instantly."

### Shot 4 — Privacy (1:30–1:55) · back to #debriefs-anon
Send:
```
@Crisis Companion Caller named Priya, phone +91 98765 43210, is afraid to go home, partner is violent.
```
Point at the reply's 🔒 footer:
> "Privacy is architectural. The name and phone number were scrubbed before any search query left this thread — the footer proves it. Search only runs across an allow-list of anonymised channels, and nothing is ever stored."

### Shot 5 — DM / live assistant thread (1:55–2:20) · DM the bot
Send a message directly to Crisis Companion:
```
Texter is having a panic attack right now, hyperventilating and terrified. What can I say?
```
> "Mid-session, volunteers just message the agent directly — grounding phrasing, the panic protocol, and country-aware helplines from the MCP server, all inside Slack, all in seconds."

### Shot 6 — Home tab + close (2:20–2:50) · App Home
Click **📋 View all protocols** to show the modal, close it, then narrate over the dashboard:
> "The Home tab is a live shift dashboard: every 'Helped' or 'Didn't land' click calibrates an effectiveness score, escalations are tracked, and every protocol is one click away. Crisis Companion turns a helpline's Slack from a chat tool into institutional memory that can act — Slack AI's agent surface, the Real-time Search API, and MCP, working as one calm co-pilot for the people who keep others alive. Crisis Companion — built for the Slack Agent for Good track."

---

**Upload:** YouTube, visibility **Public**, title "Crisis Companion — Slack Agent Builder Challenge (Agent for Good)". Copy the link into the Devpost form.
