# Dockpath

Dockpath generates a personalized, ordered learning path from documentation
pages and a learner's goal. The project has a React frontend in `frontend/`
and an Express API in `backend/`.

## Backend setup

Run these commands from the `backend` directory:

```sh
npm install
```

Create `backend/.env` and add a Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Start the API:

```sh
npm start
```

For development, run `npm run dev`. The server uses port `3000` by default;
set `PORT` in `backend/.env` to choose another port.

## Frontend setup

In a second terminal, run:

```sh
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite. Its development server proxies `/api`
requests to `http://localhost:3000`, so start the backend first. To create a
production bundle, run `npm run build` in `frontend/`.

## Deployment

Deploy the backend and frontend as separate services:

1. Deploy `backend/` as a Node.js service. Use `npm start` as the start command
   and configure `GEMINI_API_KEY` in the hosting provider's environment settings.
   The platform should provide `PORT`.
2. Deploy `frontend/` to Vercel. Set its Root Directory to `frontend`; Vercel
   will build with `npm run build` and serve `dist/`. The
   [Vercel configuration](frontend/vercel.json) rewrites app routes to
   `index.html`.
3. In the backend's environment settings, set `FRONTEND_URLS` to the exact
   browser origins allowed to call the API, comma-separated if there is more
   than one. For example:

   ```env
   FRONTEND_URLS=https://your-app.vercel.app,https://www.your-domain.com
   ```

   Include the scheme and host, but no path or trailing slash. The local Vite
   origins `http://localhost:5173` and `http://127.0.0.1:5173` are allowed for
   development, including when testing against the deployed backend.
4. In Vercel, set `VITE_API_URL` to the deployed backend's origin, for
   example `https://your-backend.example.com`. Do not append `/api` or a trailing
   slash. This is a build-time variable, so redeploy the frontend after changing
   it. Keep `GEMINI_API_KEY` only on the backend; never add it to a `VITE_`
   variable.
5. Check `https://your-backend.example.com/api/health` returns
   `{"status":"ok"}`, then open the Vercel site and submit a learning goal.

The frontend calls `VITE_API_URL + /api/learning-path`. It also accepts
`VITE_API_BASE_URL` as an alternative name. If neither variable is set in local
development, Vite proxies `/api` to `http://localhost:3000`.

The interface uses a responsive two-column workspace: learners provide a
documentation URL and goal in the form, while the results panel displays the
three ordered sections with their explanations. Form state, loading, and API
errors are visible in the UI. On narrow screens the form and results stack
vertically. React renders the interface, Tailwind CSS provides utility-based
styling, and Vite serves the app and forwards API requests to the backend.

## Create a learning path

Send a `POST` request to `http://localhost:3000/api/learning-path`:

```json
{
  "documentationUrl": "https://react.dev/learn",
  "learningGoal": "Learn enough React to build a small project"
}
```

The API gathers relevant documentation pages, extracts their headings and
content, and asks Gemini to select exactly three distinct sections in a
useful learning order. Each result references the original heading and page:

```json
{
  "learningPath": [
    {
      "step": 1,
      "heading": "Exact documentation heading",
      "url": "https://react.dev/learn",
      "whyRead": "Why this section helps with the learning goal",
      "focus": "What to look for while reading"
    },
    {
      "step": 2,
      "heading": "Another exact documentation heading",
      "url": "https://react.dev/learn",
      "whyRead": "Why this section helps with the learning goal",
      "focus": "What to look for while reading"
    },
    {
      "step": 3,
      "heading": "A third exact documentation heading",
      "url": "https://react.dev/learn",
      "whyRead": "Why this section helps with the learning goal",
      "focus": "What to look for while reading"
    }
  ]
}
```

The request requires a non-empty `documentationUrl` and `learningGoal`; goals
are limited to 1,000 characters. The API validates that returned headings and
URLs match the supplied documentation.

## Other endpoints

- `GET /` returns a welcome message.
- `GET /api/health` confirms that the API is running.
- `POST /api/guides` is not implemented yet.

## Project layout

- `backend/server.js` starts the Express API.
- `backend/routes/` defines the API routes.
- `backend/controllers/learningPathController.js` validates requests and
  coordinates learning-path creation.
- `backend/services/documentationService.js` fetches documentation pages and
  extracts relevant headings and content.
- `backend/services/learningPathService.js` requests and validates the
  structured response from Gemini.
- `backend/index.js` is a standalone prototype and is not used to start the
  API server.
- `frontend/src/App.jsx` contains the learning-path form and results view.
- `frontend/src/services/learningPathApi.js` calls the backend API.
- `frontend/vite.config.js` proxies frontend API requests to the local backend.

## Troubleshooting

If learning-path requests fail, verify that `backend/.env` contains a valid
`GEMINI_API_KEY` and restart the server after changing environment variables.
