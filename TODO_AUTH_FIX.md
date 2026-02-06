# TODO: Fix Authorization Header Issue

## Problem

Backend requires `Authorization: Bearer <token>` header, but API routes only forwarded cookies.

## Solution

1. ✅ Create server-only helper function `getBackendHeaders()` in `lib/api-server.ts`
2. ✅ Keep client-safe exports in `lib/api.ts` (BACKEND_URL, NEXT_PUBLIC_BACKEND_URL)
3. ✅ Update API routes to use the server-only helper

## File Structure

- `lib/api.ts` - Client-safe exports (URL constants only)
- `lib/api-server.ts` - Server-only exports (getBackendHeaders with `next/headers`)

## Completed Files (31 API routes updated)

### app/api/me/

- ✅ `route.ts`
- ✅ `add-course/route.ts`

### app/api/auth/

- ✅ `check/route.ts`

### app/api/admin/course/

- ✅ `all/route.ts`
- ✅ `route.ts`
- ✅ `update/[slug]/route.ts`
- ✅ `delete/[slug]/route.ts`
- ✅ `[slug]/lessons/route.ts`

### app/api/admin/

- ✅ `all-users/route.ts`
- ✅ `ban-user/[userId]/route.ts`
- ✅ `traffic/daily/route.ts`
- ✅ `traffic/dashboard-stats/route.ts`
- ✅ `traffic/error-stats/route.ts`
- ✅ `traffic/slow-endpoints/route.ts`
- ✅ `traffic/top-endpoints/route.ts`

### app/api/categorie/

- ✅ `route.ts`
- ✅ `tree/route.ts`
- ✅ `update/[slug]/route.ts`
- ✅ `delete/[slug]/route.ts`

### app/api/courses/

- ✅ `[slug]/route.ts`
- ✅ `[slug]/lessons/route.ts`
- ✅ `[slug]/lessons/progress/route.ts`
- ✅ `[slug]/lessons/[id]/progress/route.ts`
- ✅ `random/[limit]/route.ts`

### app/api/user/

- ✅ `my-courses/route.ts`
- ✅ `subscribed-courses/route.ts`
- ✅ `subscribed-courses/[courseId]/route.ts`

## Summary

All API routes now use the `getBackendHeaders()` helper from `lib/api-server.ts` which automatically:

1. Extracts the `better-auth.session_token` cookie
2. Adds the `Authorization: Bearer <token>` header
3. Forwards all cookies via the `Cookie` header

The code is now split to ensure `next/headers` is only used in server-only files.
