
# 🧠 Mental Health Companion – Local Language AI Support

An AI-first platform designed to **empower students and young professionals with accessible wellness tools**.  
This project integrates **multilingual AI chat, mood tracking, local resources, and automation workflows** to democratize mental health support.

---

## 📘 Case Study & Resources

- **Case Study Deck (Google Stitch):** [View Deck](https://stitch.withgoogle.com/projects/5248202183170876138)  
- **Miro Board (Research & Flows):** [View Miro](https://miro.com/app/board/uXjVG3FqPLs=/?share_link_id=759555472619)  
- **Visily.ai Designs (UI Mockups):** [View Designs](https://app.visily.ai/projects/4c37c480-dc38-4bdc-a1f2-5aa965698596/boards/2510822)  
- **Jira Roadmap:** [View Jira](https://sfcollab.atlassian.net/jira/software/projects/KA/summary?atlOrigin=eyJpIjoiNWU2YmJkNDRiNWY4NDc5Mzk1NDNhOTQzYTNhODFjMWEiLCJwIjoiaiJ9)  
- **Google AI Studio App:** [View App](https://ai.studio/apps/6d540726-b0d3-4e15-b4a7-f350c3ce4c18)  
- **Bolt.new Deployment:** [Live Demo](https://mental-health-compan-vubp.bolt.host)  

---

## 🛠️ Tech Stack

- **Frontend:** Lovable, Bolt.new, Google AI Studio  
- **Backend:** Node.js + Express (via Trae.ai orchestration)  
- **Database & Auth:** Supabase (Postgres + Auth)  
- **AI Layer:**  
  - OpenAI → Multilingual chatbot  
  - Claude → Journaling feedback  
  - HuggingFace → Mood classification  
- **Workflows:** n8n, Make.com  
- **Analytics:** Posthog  
- **Design:** Visily.ai, Miro  
- **Testing:** Postman  

---

## 🚀 Run Locally

**Prerequisites:** Node.js, Supabase project, API keys

1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/mental-health-companion.git
   cd mental-health-companion
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set environment variables in `.env.local`:
   ```bash
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   GEMINI_API_KEY=your_google_ai_studio_key
   ```

4. Run the app:
   ```bash
   npm run dev
   ```

---

## 📂 Database Schema (Supabase/Postgres)

- **users** → student profiles  
- **mood_logs** → daily mood entries (emoji scale + notes)  
- **chat_sessions** → AI conversations (message history, language)  
- **resources** → localized articles, exercises, helplines  
- **analytics_events** → logs for Mixpanel sync  

---

## 🔗 API Endpoints (Express + Trae.ai)

- `POST /chat` → Send message → AI response  
- `POST /mood` → Log daily mood entry  
- `GET /resources` → Fetch localized resources  

---

## 📊 Analytics (Posthog)

Tracked events:
- `chat_started`
- `chat_completed`
- `mood_logged`
- `resource_viewed`

Dashboards:
- Funnel: chat_started → chat_completed  
- Retention: daily mood logs  
- Engagement: resource usage  

---

## 🎨 Design & Collaboration

- **Visily.ai:** UI mockups (chat dashboard, mood tracker, resource library)  
- **Miro:** Personas, journey maps, prioritization matrix  
- **Jira:** Roadmap with sprints (Chatbot → Mood Tracker → Resources → Community)  

---

## ✅ Testing

- Postman collections for `/chat`, `/mood`, `/resources` endpoints  
- Automated tests for API response validation  

---

## 🏁 Roadmap

- **Phase 1:** Chatbot + Mood Tracker  
- **Phase 2:** Localized Resource Library  
- **Phase 3:** Peer Community Features  
- **Phase 4:** Stress Prediction Engine  

---

## 📜 License
MIT License © 2026 Mohammad Razeen Iqbal
```

