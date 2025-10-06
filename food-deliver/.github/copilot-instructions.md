# Copilot Instructions for AI Agents

## Project Overview
- **Monorepo** with `front-end` (React + Vite) and `back-end` (Node.js/Express, MongoDB)
- **Front-end**: SPA in `front-end/src/` using React components, context for state, and Vite for dev/build
- **Back-end**: REST API in `back-end/` with routes, controllers, models, and middleware

## Key Directories & Files
- `front-end/src/component/` — UI components, grouped by feature
- `front-end/src/context/StoreContext.jsx` — Global state management (cart, user, etc.)
- `front-end/src/pages/` — Page-level React components (e.g., Home, Cart, PlaceOrder)
- `back-end/server.js` — Express app entry point
- `back-end/config/db.js` — MongoDB connection logic
- `back-end/models/` — Mongoose schemas for data entities
- `back-end/routes/` — API route definitions

## Developer Workflows
- **Front-end**
  - Start dev server: `cd front-end && npm run dev`
  - Build: `npm run build`
  - Lint: `npm run lint`
- **Back-end**
  - Start server: `cd back-end && npm start` (ensure MongoDB is running)
  - API endpoints: `/api/...` (see `routes/`)

## Patterns & Conventions
- **Component Structure**: Each UI component has its own folder with `.jsx` and `.css` files
- **State**: Use React context (`StoreContext.jsx`) for global state (cart, user)
- **API Calls**: Front-end fetches from back-end REST endpoints (no GraphQL)
- **Assets**: Images and icons in `front-end/src/assets/`
- **No TypeScript**: All code is JavaScript (JSX for React)
- **No Redux**: State is managed via context/hooks

## Integration Points
- **Front-end ↔ Back-end**: Communicate via REST API (fetch/AJAX)
- **Back-end ↔ MongoDB**: Mongoose ODM, connection in `config/db.js`
- **Uploads**: File uploads handled in `back-end/uploads/`

## Examples
- Add a new page: Create folder in `src/pages/`, add `Page.jsx` and `Page.css`, register in router
- Add a new API route: Define in `routes/`, implement logic in `controllers/`, update `server.js`

## Special Notes
- **Vite** is used for fast front-end dev/build
- **ESLint** config in `front-end/eslint.config.js`
- **No custom test setup** detected — add tests if needed

---

For more, see `front-end/README.md` and inspect `server.js`/`db.js` for back-end setup.
