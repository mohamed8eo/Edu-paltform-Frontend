# TODO List

## Completed Tasks

### Admin Dashboard (app/admin/page.tsx)

- [x] Created proxy API route for dashboard stats
- [x] Updated types/admin.ts with DashboardStats interface
- [x] Replaced dummy data with API calls

### Admin Users (app/admin/users/page.tsx)

- [x] Created proxy API route for /admin/all-users
- [x] Created proxy API route for /admin/ban-user/:userId
- [x] Added status filter (All, Active, Banned)
- [x] Added pagination with 10 users per page
- [x] Updated ban/unban actions to use API

### Admin Categories (app/admin/categories/page.tsx)

- [x] Created proxy API route for GET /categorie
- [x] Created proxy API route for POST /categorie
- [x] Created proxy API route for PUT /categorie/:id
- [x] Created proxy API route for DELETE /categorie/:id
- [x] Updated types/course.ts with ApiCategory interface
- [x] Updated category form to use API category fields
- [x] Updated categories page to fetch from API

## Pending Tasks

### Admin Courses (app/admin/courses/page.tsx)

- [ ] To be implemented with course API endpoints
