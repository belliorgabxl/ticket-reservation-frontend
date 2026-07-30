@AGENTS.md

# ticket-reserve

Next.js 16 (App Router) frontend for a concert ticket booking system, talking
to the Go API in `../ticket-backend`. See `README.md` for the booking-flow
diagram and design-system summary — this file is the "why," not the "what."

## Env: the one footgun

`.env`'s `NEXT_PUBLIC_API_BASE_URL` must point at the real backend
(`http://localhost:8080` in dev). This has been wrong before (pointed at
`:3001`, an unrelated Next.js fallback port) and every symptom looked
unrelated — "can register but can't login," header never updating — because
every `fetch()` in `src/lib/api/*.ts` silently hit a dead port. If auth
looks broken in a way that doesn't make sense from reading the code, check
this env var and the browser console (`TypeError: Failed to fetch` = wrong
URL / nothing listening; a CORS error or a real 4xx = actually reach the
backend, different problem) before chasing frontend logic.

## Auth is cookie-based, not token-based

The backend sets httpOnly `access_token`/`refresh_token` cookies plus a
non-httpOnly `auth_status` marker. Every API call needs
`credentials: "include"`. `src/proxy.ts` (not `middleware.ts` — Next 16
renamed the convention) only reads `auth_status` for an optimistic
redirect; it cannot verify the real tokens and must never be treated as the
security boundary — the Go backend enforces auth independently on every
protected route. `src/lib/auth-context.tsx` holds the client-side "who's
logged in" state; see its doc comment and the README's Auth state section
for why `refreshUser()` must be called manually after login/register.

## Layering convention

Each API resource gets a thin `src/lib/api/<name>.ts` module: plain
`fetch()` wrappers, no client library, unwrap `{ success, data }` /
`{ success, message }` envelopes from the Go backend (matches
`pkg/response` on the backend side), throw `Error(message)` on failure.
Pages either `await` these directly (Server Components — `events`,
`show-times`) or call them from `useEffect`/handlers in a `"use client"`
page when the route needs cookies read in the browser (anything
auth-gated: reservations, payments, tickets, the seat picker).

## Design system

See README's "Design system" section for the token/component summary.
One rule worth restating here: don't hand-roll `rounded-lg bg-black
px-4 py-2 text-white`-style one-offs anymore — use
`Button`/`buttonClasses()`, `Card`, `Badge`, `Field` from
`src/components/ui/`. If a page needs a look those don't support, extend
the primitive rather than styling around it, so the app doesn't drift back
into inconsistent ad-hoc styling per page.
