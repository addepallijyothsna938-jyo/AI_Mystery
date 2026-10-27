# AI Mystery

A cinematic, AI-powered mystery investigation experience built with React, Express, MongoDB, and Google Gemini.

## Start here

1. Install dependencies from the project root: `npm install`, then `npm install --prefix client` and `npm install --prefix server`.
2. Run `npm run dev` at the root to open the client at `http://localhost:5173` in local demo mode. This includes the Bellwether sample case and lets you explore the interface without backend credentials.
3. To create cases with Gemini and save them to MongoDB, copy `server/.env.example` to `server/.env` and set `MONGODB_URI`, `GEMINI_API_KEY`, and a long `SESSION_SECRET`. Copy `client/.env.example` to `client/.env`, then run `npm run dev:full`. The API opens at `http://localhost:5000`.

For deployment, follow [DEPLOY.md](./DEPLOY.md). The production setup serves the built frontend and API from one origin.

In local demo mode, new premises use the clearly identified Bellwether sample evidence template. A truly generated case requires a configured Gemini key and MongoDB. The server deliberately fails startup with a clear configuration message when required settings are missing.

## Project map

- `client/` — responsive React application and local sample experience.
- `server/` — Express API, MongoDB models, Gemini generation and authoritative verdict logic.
- `spec.md` — product requirements and acceptance criteria.

All people, cases, and evidence shown in the sample experience are fictional. Image-like evidence is presented as a designed illustration or clearly marked simulation; no real surveillance or authentic messages are implied.
