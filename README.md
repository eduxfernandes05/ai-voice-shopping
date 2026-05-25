# AI Voice Shopping

> **Talk to the app. Watch it check itself out.**
>
> A live, agentic commerce experience where voice is the UI, tool calling is the control plane, and the React app is the execution surface. Built on the Azure OpenAI Realtime API.

---

## The Pitch

Most "AI in commerce" demos are a chat window glued to a checkout. This one is different.

The customer never touches the form. They just **speak**, naturally, about what their business needs. In the same breath, the model is reasoning over a structured service catalog, returning concrete, numbered recommendations, and the frontend is intercepting those tokens to **toggle the exact checkboxes, recompute the quote, and move the order forward** — in real time, while the user is still talking.

It is the difference between an assistant that *answers* and an agent that *acts*.

```text
👤  "We're scaling our platform, need a new mobile app, and the team
     could use training on the new stack."

🤖  (voice, streaming)  "Got it — I'm adding Technology Advisory,
     Mobile App Development, and Team Training to your package."

🖥️  ✅ Technology Advisory Services      $399/mo
    ✅ Mobile App Development            $599/mo
    ✅ Team Training & Workshops         $449/mo
    →  Subtotal updated · Quote PDF ready
```

Three sentences. Zero clicks. A signed quote.

---

## What Makes It Different

| Most AI commerce demos | AI Voice Shopping |
| --- | --- |
| Chat next to the UI | Voice **inside** the UI |
| User reads, then fills the form | User talks, the form **fills itself** |
| One-shot Q&A | Bi-directional realtime audio with barge-in |
| Model returns text | Model returns text **and triggers app actions** |
| Stops at the recommendation | Continues to quote, checkout, and order |

---

## Architecture at a Glance

```
 ┌──────────────┐   PCM16 / 24 kHz   ┌────────────────────────┐
 │  Microphone  │ ─────────────────► │   Azure OpenAI         │
 │  (Web Audio) │                    │   Realtime API         │
 └──────────────┘ ◄───────────────── │   (gpt-realtime)       │
        ▲          audio + transcript└──────────┬─────────────┘
        │                                       │
        │ barge-in                              │ server-side VAD
        │                                       │ Whisper transcription
        │                                       ▼
 ┌──────┴───────┐                    ┌────────────────────────┐
 │  Speaker /   │ ◄──── stream ───── │   Tool-Call Router     │
 │  AudioCtx    │                    │   (intent → service ID)│
 └──────────────┘                    └──────────┬─────────────┘
                                                │
                                                ▼
                                     ┌────────────────────────┐
                                     │   React State Engine   │
                                     │   selectService()      │
                                     │   removeService()      │
                                     │   generateQuote()      │
                                     └────────────────────────┘
```

Two AI surfaces share the same catalog grounding:

1. **Realtime Voice** — bi-directional audio over WebSocket, server-side VAD, Whisper transcription, streaming TTS, instant interruption when the user starts speaking again.
2. **Text Assistant** — Azure OpenAI chat completions through an Azure AI Foundry-compatible endpoint, grounded with the same service catalog used by the voice agent.

---

## The Tool-Calling Loop

The most important pattern in this repo lives in ~30 lines of glue code between the model and the DOM.

```
1. User speaks natural language.
2. Realtime model returns audio + transcript, referencing services by ID.
3. Frontend parses the assistant turn for structured intents.
4. Each intent is mapped to a typed application action:
       selectService(id) · removeService(id) · generateQuote()
5. React updates state → checkboxes toggle → quote recomputes → UI animates.
```

It is a deliberate, minimal implementation of the tool-calling pattern, designed to be replaced by the model's native `tools` API as the surface grows. The contract is already there: **the model proposes, the app disposes.**

Drop-in extension points:

- `selectService(id)` · `removeService(id)`
- `fillContactDetails({ email, phone, company })`
- `generateQuote()` · `downloadQuote()`
- `scheduleCall(slot)` · `submitOrder()`

---

## Tech Stack

| Layer | Choice |
| --- | --- |
| Reasoning + Voice | Azure OpenAI Realtime (`gpt-realtime`) + Azure AI Foundry chat |
| Transcription | Whisper, configured inside the realtime session |
| Transport | Native WebSocket, base64 PCM16 frames |
| Audio I/O | Web Audio API, 24 kHz mono, custom chunked playback + barge-in |
| Frontend | React 19, TypeScript, Vite 7 |
| UI System | Tailwind CSS 4, Radix UI, Framer Motion |
| Documents | jsPDF (auto-generated quote) |
| Routing | React Router 7 |

---

## Where the Magic Lives

| File | Responsibility |
| --- | --- |
| `src/components/VoiceAssistant.tsx` | WebSocket session, mic streaming, VAD turn-taking, audio playback, barge-in, intent extraction |
| `src/lib/azureOpenAI.ts` | Foundry-aware client, catalog grounding, chat completions |
| `src/components/ChatAssistant.tsx` | Embedded text assistant, deep-link from any service card |
| `src/components/ServiceSelectionForm.tsx` | The form the AI fills for you |
| `src/pages/CheckoutPage.tsx` | Live pricing, tax, quote download |
| `src/lib/pdfGenerator.ts` | Branded PDF quote generation |

---

## Run It Locally

```bash
npm install
npm run dev
# → http://127.0.0.1:5000/
```

Then create a `.env` from `.env.example`:

```env
# Azure AI Foundry / Azure OpenAI — chat
VITE_AZURE_OPENAI_ENDPOINT=https://<your-foundry-endpoint>
VITE_AZURE_OPENAI_API_KEY=<key>
VITE_AZURE_OPENAI_DEPLOYMENT=gpt-4.1

# Azure OpenAI — realtime voice
VITE_AZURE_REALTIME_ENDPOINT=https://<your-resource>.cognitiveservices.azure.com
VITE_AZURE_REALTIME_API_KEY=<key>
VITE_AZURE_REALTIME_DEPLOYMENT=gpt-realtime
```

The UI runs without credentials — the voice and chat layers light up when the keys are present.

Production build:

```bash
npm run build   # → dist/  (Azure Static Web Apps, Vercel, Netlify, any CDN)
```

---

## Why This Pattern Matters

This is a reference implementation for any application where users struggle to translate **intent → structured input**:

- Guided selling and CPQ
- Insurance and financial product configuration
- Internal IT / HR request portals
- B2B onboarding and procurement
- Any long form that no one wants to fill

Replace the catalog. Keep the loop. The form fills itself.

---

## License

MIT
