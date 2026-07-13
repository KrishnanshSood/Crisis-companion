# Crisis Companion — Setup (your click-steps)

Do these now, in order. Everything else is code and I'm writing it in parallel.

## 1. Create the app from the manifest (~5 min)
1. Go to https://api.slack.com/apps → **Create New App** → **From a manifest**.
2. Pick your **developer sandbox** workspace.
3. Paste the contents of `manifest.json` (JSON tab) → Next → Create.
   - If the manifest errors on `assistant_view`: delete that block from the JSON, create the app, then enable **Agents & AI Apps** manually under *Features* in the app settings and re-add the description there.
4. On the app page: **Install App** → Install to workspace → Allow.

## 2. Tokens (~3 min)
1. **OAuth & Permissions** → copy the **Bot User OAuth Token** (`xoxb-...`).
2. **Basic Information** → **App-Level Tokens** → Generate Token, name `socket`, scope `connections:write` → copy (`xapp-...`).
3. Copy `.env.example` to `.env` and paste both tokens in.

## 3. Channels (~3 min)
1. In the sandbox workspace create two public channels: `#debriefs-anon` and `#crisis-resources`.
2. In `#debriefs-anon`: right-click channel name → View channel details → copy the **Channel ID** (bottom of About tab).
3. Put that ID in `.env` as `ALLOWED_CHANNEL_IDS=C...` (comma-separate if you add more).
4. `/invite @Crisis Companion` in both channels.

## 4. Judge access (do NOT skip — required by the rules)
1. Invite **slackhack@salesforce.com** and **testing@devpost.com** to the sandbox workspace (Invite people → as members).
2. Note your sandbox URL (e.g. `https://yourname-sandbox.slack.com`) — it goes in the Devpost form.

## 5. When I say the code is ready
```powershell
npm install        # if not already run
npm run seed       # populates #debriefs-anon with anonymised sample debriefs
npm start          # starts the agent (Socket Mode, keep this terminal open)
```
Then @mention the bot in `#debriefs-anon` with a debrief, and open the Crisis Companion assistant panel (sparkle icon, top-right) to test the thread flow.
