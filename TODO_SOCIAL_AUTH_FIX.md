# Authentication Fix - Social Login Cookie Issue

## Problem

- **Email/password login**: Works correctly - token is stored in localStorage AND cookie via `tokenManager.setToken()`
- **Social login**: Token is set as HttpOnly cookie only - JavaScript cannot access it

## Solution

Created server-side API route `/api/auth/sign-in-social` that:

1. Calls the backend's `/auth/sign-in-social` endpoint from the server
2. Returns both OAuth URL and token in the response body
3. Client can now store the token in localStorage (like email/password auth)

## Files Created/Modified

### Created

- `/api/auth/sign-in-social/route.ts` - New API route for social sign-in

### Modified

- `/app/sign-in/page.tsx` - Updated to use the new API route (`/api/auth/sign-in-social` instead of calling backend directly)
- `/app/auth-callback/page.tsx` - Fixed missing closing `</div>` tags

## How it works

### Before (broken):

```
Client → Backend OAuth → OAuth Provider → Backend (sets HttpOnly cookie) → Client
                                                           ↑
                                                    No token access!
```

### After (fixed):

```
Client → /api/auth/sign-in-social → Backend OAuth → returns { url, token }
                                        ↓
                              Client stores token in localStorage
                                        ↓
                              Client redirects to OAuth Provider
                                        ↓
                              OAuth Provider → Backend → Client
                                        ↓
                              Cookie is set + localStorage has token!
```

## API Route Details

The new `/api/auth/sign-in-social` route:

1. Accepts POST requests with `{ provider: "google" | "github", callbackURL? }`
2. Calls the backend from the server (not client)
3. Forwards Set-Cookie headers to the client
4. Returns `{ url: "...", token?: "..." }` to the client
5. Client stores token in localStorage and redirects to OAuth URL

## Testing

1. Sign in with Google/GitHub
2. Verify token is in localStorage: `localStorage.getItem('better-auth.session_token')`
3. Verify token is in cookies: `document.cookie`
4. User should be authenticated on page refresh

## Changes Summary

**`app/api/auth/sign-in-social/route.ts`** (NEW):

```typescript
// Server-side route that handles social sign-in
// Calls backend, forwards cookies, returns OAuth URL + token
```

**`app/sign-in/page.tsx`** (MODIFIED):

```typescript
// Changed from calling backend directly:
// const res = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/auth/sign-in-social`, ...

// To calling our API route:
// const res = await fetch("/api/auth/sign-in-social", ...
```

This ensures the token is properly stored in localStorage for social login, matching the behavior of email/password authentication.
