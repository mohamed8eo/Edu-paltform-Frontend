# Backend API Endpoints Documentation

> All endpoints are served at: `http://localhost:8080`

## Table of Contents

1. [Auth Endpoints](#auth-endpoints)
2. [Admin Endpoints](#admin-endpoints)
3. [Category Endpoints](#category-endpoints)
4. [Course Endpoints](#course-endpoints)
5. [User Endpoints](#user-endpoints)
6. [Me Endpoints](#me-endpoints)

---

## Auth Endpoints

| Method | Endpoint         | Description                                 |
| ------ | ---------------- | ------------------------------------------- |
| GET    | `/auth/session`  | Check authentication session                |
| GET    | `/auth/callback` | Handle OAuth callback from social providers |

---

## Admin Endpoints

### User Management

| Method | Endpoint                   | Description         |
| ------ | -------------------------- | ------------------- |
| GET    | `/admin/all-users`         | Fetch all users     |
| POST   | `/admin/ban-user/{userId}` | Ban a specific user |

### Course Management

| Method | Endpoint                 | Description              |
| ------ | ------------------------ | ------------------------ |
| GET    | `/course`                | Fetch courses            |
| POST   | `/course`                | Create new course        |
| GET    | `/course/all`            | Fetch all courses        |
| GET    | `/course/{slug}`         | Fetch specific course    |
| GET    | `/course/{slug}/lessons` | Fetch lessons for course |
| PUT    | `/course/update/{slug}`  | Update course            |
| DELETE | `/course/delete/{slug}`  | Delete course            |

### Traffic & Analytics

| Method | Endpoint                         | Description              |
| ------ | -------------------------------- | ------------------------ |
| GET    | `/admin/traffic/daily`           | Daily traffic statistics |
| GET    | `/admin/traffic/dashboard-stats` | Dashboard statistics     |
| GET    | `/admin/traffic/error-stats`     | Error statistics         |
| GET    | `/admin/traffic/slow-endpoints`  | Slow endpoints data      |
| GET    | `/admin/traffic/top-endpoints`   | Top endpoints data       |

---

## Category Endpoints

| Method | Endpoint                   | Description                   |
| ------ | -------------------------- | ----------------------------- |
| GET    | `/categorie`               | Fetch categories              |
| POST   | `/categorie`               | Create new category           |
| GET    | `/categorie/tree`          | Fetch category tree structure |
| PUT    | `/categorie/update/{slug}` | Update category               |
| DELETE | `/categorie/delete/{slug}` | Delete category               |

---

## Course Endpoints

| Method | Endpoint                               | Description                        |
| ------ | -------------------------------------- | ---------------------------------- |
| GET    | `/course/{slug}`                       | Fetch specific course              |
| GET    | `/course/{slug}/lessons`               | Fetch all lessons for course       |
| GET    | `/course/{slug}/lessons/progress`      | Fetch lesson progress              |
| GET    | `/course/{slug}/lessons/{id}/progress` | Fetch progress for specific lesson |
| POST   | `/course/{slug}/lessons/{id}/progress` | Update lesson progress             |

---

## User Endpoints

### Subscriptions

| Method | Endpoint                              | Description                      |
| ------ | ------------------------------------- | -------------------------------- |
| GET    | `/me/subscibe/all`                    | Fetch all subscribed courses     |
| GET    | `/me/subscibe/{courseId}`             | Fetch specific subscribed course |
| GET    | `/user/my-courses`                    | Fetch user's enrolled courses    |
| GET    | `/user/subscribed-courses`            | Fetch subscribed courses         |
| GET    | `/user/subscribed-courses/{courseId}` | Fetch subscribed course details  |

---

## Me Endpoints

| Method | Endpoint         | Description                 |
| ------ | ---------------- | --------------------------- |
| GET    | `/me`            | Fetch current user profile  |
| POST   | `/me/add-course` | Add new course (instructor) |

---

## Complete Endpoint List (Alphabetical)

```
GET     /admin/all-users
POST    /admin/ban-user/{userId}
GET     /admin/traffic/daily
GET     /admin/traffic/dashboard-stats
GET     /admin/traffic/error-stats
GET     /admin/traffic/slow-endpoints
GET     /admin/traffic/top-endpoints
GET     /auth/session
GET     /auth/callback
GET     /categorie
POST    /categorie
GET     /categorie/tree
PUT     /categorie/update/{slug}
DELETE  /categorie/delete/{slug}
GET     /course
POST    /course
GET     /course/all
GET     /course/{slug}
GET     /course/{slug}/lessons
GET     /course/{slug}/lessons/progress
GET     /course/{slug}/lessons/{id}/progress
POST    /course/{slug}/lessons/{id}/progress
PUT     /course/update/{slug}
DELETE  /course/delete/{slug}
GET     /me
POST    /me/add-course
GET     /me/subscibe/all
GET     /me/subscibe/{courseId}
GET     /user/my-courses
GET     /user/subscribed-courses
GET     /user/subscribed-courses/{courseId}
```

---

## Summary

- **Total Endpoints:** 34
- **GET Requests:** 25
- **POST Requests:** 5
- **PUT Requests:** 2
- **DELETE Requests:** 2

## Base URL

All endpoints are relative to: `http://localhost:8080`

## Status

All endpoints are currently active and proxying through the Next.js API routes located in `/app/api/`

---

## Build Status

✅ **Build completed successfully!**

- All 37 routes generated
- `/sign-out` page fixed and working correctly
- No errors during production build
