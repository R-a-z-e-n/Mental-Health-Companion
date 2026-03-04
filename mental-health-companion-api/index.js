
require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3001;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());

app.post('/chat', (req, res) => {
  posthog.capture({
    distinctId: 'anonymous',
    event: 'chat-request',
  });
  const { message } = req.body;
  // In a real application, you would use a natural language processing
  // model to generate a response. For this example, we'll just return a
  // static response.
  res.json({ 
   "response": "I'm really glad you're here, and I want you to know — whatever you're carrying right now, you don't have to carry it alone. This is a safe, judgment-free space where your feelings are valid exactly as they are. Whether you want to talk, reflect, or simply be heard, I'm here with you. Whenever you feel ready, you can share what's on your mind — even a few words is a good start.", 
   "tone": "empathetic", 
   "language": "English (default — no language preference provided)", 
   "mood_classification": { 
     "mood": "anxious", 
     "confidence": 0.38, 
     "note": "No user message or journal entry was provided. Mood defaulted to 'anxious' as the statistically most common reason users seek mental health support tools. Confidence is low due to absence of actual input. Score will recalibrate with real user content." 
   }, 
   "journal_analysis": { 
     "themes": [ 
       "Seeking support — the act of reaching out itself reflects self-awareness and courage", 
       "Emotional readiness — user appears to be at the threshold of self-reflection", 
       "Identity and inner narrative — journaling often begins when a person is questioning patterns in their life" 
     ], 
     "positive_patterns": [ 
       "Initiating a mental health conversation is a meaningful step toward emotional wellbeing", 
       "Willingness to engage with a reflective tool suggests openness to growth", 
       "No crisis indicators present — baseline emotional state appears stable" 
     ], 
     "suggestions": [ 
       { 
         "strategy": "Start a 5-minute free-write journal", 
         "instruction": "Set a timer for 5 minutes. Write without stopping. Don't edit — just let your thoughts flow onto the page. Begin with: 'Right now, I feel...'", 
         "why_it_helps": "Unstructured journaling bypasses your inner critic and helps surface emotions you may not have consciously acknowledged." 
       }, 
       { 
         "strategy": "Box Breathing for grounding", 
         "instruction": "Inhale for 4 counts → Hold for 4 counts → Exhale for 4 counts → Hold for 4 counts. Repeat 4 times.", 
         "why_it_helps": "Activates the parasympathetic nervous system, reducing cortisol and creating a sense of calm within 2–3 minutes." 
       }, 
       { 
         "strategy": "Name your emotion precisely", 
         "instruction": "Instead of 'I feel bad', try: 'I feel overwhelmed because...' or 'I feel lonely when...' Specificity builds emotional intelligence.", 
         "why_it_helps": "Research in affect labeling (UCLA, 2007) shows that naming emotions reduces their intensity in the brain's amygdala." 
       }, 
       { 
         "strategy": "Gratitude anchor", 
         "instruction": "Write down 3 things — no matter how small — that you are glad exist today. A warm cup of tea counts.", 
         "why_it_helps": "Redirects attentional bias away from negative rumination and activates reward circuits associated with positive affect." 
       } 
     ] 
   }, 
   "multilingual_readiness": { 
     "supported_languages": [ 
       "English", "Hindi", "Spanish", "French", "German", 
       "Portuguese", "Arabic", "Bengali", "Marathi", "Tamil", 
       "Telugu", "Kannada", "Mandarin", "Japanese", "Korean" 
     ], 
     "instruction": "To receive a response in your preferred language, simply write your message in that language or mention it explicitly. Example: 'Reply in Hindi' or send your journal entry in French.", 
     "example_multilingual_response": { 
       "hindi": "मैं यहाँ हूँ और आपकी बात सुनने के लिए तैयार हूँ। आप जो भी महसूस कर रहे हैं, वो महत्वपूर्ण है।", 
       "spanish": "Estoy aquí para escucharte. Lo que sientes es completamente válido.", 
       "french": "Je suis là pour vous écouter. Vos émotions sont importantes et valides." 
     } 
   }, 
   "system_status": { 
     "input_received": false, 
     "user_message": null, 
     "journal_entry_detected": false, 
     "language_preference_detected": false, 
     "action_required": "Please provide your message, journal entry, or describe how you are feeling today. The more you share, the more personalized and meaningful the support I can offer.", 
     "crisis_flag": false, 
     "disclaimer": "This AI companion offers emotional support and psychoeducational insights only. It does not diagnose, treat, or replace professional mental health care. If you are experiencing a mental health crisis, please contact a licensed professional or a crisis helpline in your country." 
   } 
 });
});

app.post('/mood', async (req, res) => {
  const { mood, notes } = req.body;
  const { data, error } = await supabase
    .from('mood_entries')
    .insert([{ mood, notes }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ message: 'Mood entry logged successfully.' });
});

app.get('/resources', async (req, res) => {
  const { data, error } = await supabase
    .from('resources')
    .select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
