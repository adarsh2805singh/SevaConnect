# ⚡ Quick Reference: Backend Tasks for Frontend

## 📋 The 4 Main Things Backend Needs

### 1. **Authentication (Login/Register)** 🔐
```
Your Frontend has:
- 3 login pages (Volunteer, NGO, Admin)
- 2 register pages (Volunteer, NGO)
- JWT token storage in localStorage

Backend MUST provide:
✓ /api/auth/volunteer/login
✓ /api/auth/volunteer/register
✓ /api/auth/ngo/login
✓ /api/auth/ngo/register
✓ JWT token in response
✓ Password security
```

---

### 2. **Task Management** 📝
```
Your Frontend has:
- Create task form (NGO)
- Browse all tasks (Volunteer)
- Apply to tasks
- See task applicants (NGO)

Backend MUST provide:
✓ /api/tasks (GET all, POST create)
✓ /api/tasks/:id (GET one, PUT update, DELETE)
✓ /api/tasks/:id/apply (POST apply, DELETE withdraw)
✓ /api/tasks/:id/applicants (GET list)
✓ Filtering by urgency, category, location
✓ Search functionality
```

---

### 3. **NGO Management** 🏛️
```
Your Frontend has:
- Admin dashboard for NGO approval
- NGO profile page
- NGO edit profile

Backend MUST provide:
✓ /api/admin/ngos (GET all NGOs)
✓ /api/admin/ngos/:id/approve (PATCH)
✓ /api/admin/ngos/:id/reject (PATCH)
✓ /api/ngos/:id (GET profile, PUT update)
✓ Track volunteers per NGO
```

---

### 4. **Volunteer Management** 👥
```
Your Frontend has:
- Volunteer profile page
- View applied tasks
- Edit skills & availability

Backend MUST provide:
✓ /api/volunteer/profile (GET, PUT)
✓ /api/volunteer/applied-tasks (GET)
✓ Track tasks completed
```

---

## 🎯 Frontend Expects These 24 Endpoints

### Auth (5)
```
POST /api/auth/ngo/login              ✗
POST /api/auth/ngo/register           ✗
POST /api/auth/volunteer/login        ✗
POST /api/auth/volunteer/register     ✗
POST /api/auth/logout                 ✗
```

### Tasks (8)
```
GET  /api/tasks                       ✗
GET  /api/tasks/:id                   ✗
POST /api/tasks                       ✗
PUT  /api/tasks/:id                   ✗
DELETE /api/tasks/:id                 ✗
POST /api/tasks/:id/apply             ✗
DELETE /api/tasks/:id/apply           ✗
GET  /api/tasks/:id/applicants        ✗
```

### NGO (5)
```
GET  /api/admin/ngos                  ✗
GET  /api/ngos/:id                    ✗
PUT  /api/ngos/:id                    ✗
PATCH /api/admin/ngos/:id/approve     ✗
PATCH /api/admin/ngos/:id/reject      ✗
```

### Volunteer (3)
```
GET  /api/volunteer/profile           ✗
PUT  /api/volunteer/profile           ✗
GET  /api/volunteer/applied-tasks     ✗
```

### Utility (3) - Already Done ✓
```
GET  /                                ✓
GET  /health                          ✓
GET  /api/test                        ✓
```

---

## 🔑 Key Data Structures Needed

### User (Base)
```javascript
{
  id, email, password (hashed), name, phone,
  role (volunteer/ngo/admin),
  createdAt, updatedAt
}
```

### Volunteer (Extends User)
```javascript
{
  ...User,
  skills: ["Teaching", "Coding"],
  availability: ["Monday", "Wednesday"],
  tasksApplied: 5,
  tasksCompleted: 2,
  rating: 4.5
}
```

### NGO (Extends User)
```javascript
{
  ...User,
  organizationName: "Green Earth",
  sector: "Environment",
  status: "approved" | "pending" | "rejected",
  volunteers: 42,
  tasksPosted: 8,
  description: "..."
}
```

### Task
```javascript
{
  id, title, description, location,
  ngoId, ngoName,
  requiredVolunteers, appliedVolunteers,
  date, time, urgency, daysLeft,
  tags: ["Environment", "Outdoor"],
  applicants: [volunteerId, ...],
  status: "open" | "filled" | "completed",
  createdAt, updatedAt
}
```

---

## 🚦 Implementation Priority

### MUST DO FIRST (Critical Path)
1. **User Authentication** ← Without this, nothing works
   - Login/Register
   - Password hashing
   - JWT tokens
   - Protected routes

2. **Task CRUD** ← Main feature
   - Create, Read, Update, Delete
   - Apply to task
   - View applicants

### DO AFTER (Important)
3. **NGO Approval System** ← Admin feature
4. **Filtering** ← Better UX
5. **Pagination** ← Performance

---

## 📦 Packages You'll Need

```bash
npm install bcryptjs jsonwebtoken mongoose
npm install joi express-validator
npm install dotenv
```

---

## 🔧 File Organization for New Features

```
Backend/
├── controllers/
│   ├── authController.js       ← LOGIN/REGISTER LOGIC
│   ├── taskController.js       ← TASK OPERATIONS
│   ├── adminController.js      ← ADMIN OPERATIONS
│   └── [existing files]
├── routes/
│   ├── authRoutes.js           ← NEW
│   ├── adminRoutes.js          ← NEW
│   └── [existing files]
├── models/
│   ├── User.js                 ← NEW
│   ├── Task.js                 ← UPDATE
│   └── [existing files]
├── middleware/
│   ├── auth.js                 ← NEW (JWT verify)
│   └── authorize.js            ← NEW (Role check)
└── server.js                   ← UPDATE
```

---

## ✅ Checklist for Backend

- [ ] User authentication system
- [ ] Password hashing with bcrypt
- [ ] JWT token generation
- [ ] Protected routes middleware
- [ ] NGO registration & approval
- [ ] Volunteer registration
- [ ] Task creation by NGO
- [ ] Task browsing by Volunteer
- [ ] Apply/withdraw from task
- [ ] View applicants (NGO)
- [ ] Admin approval/rejection
- [ ] Profile management
- [ ] Filtering & search
- [ ] Error handling
- [ ] Validation
- [ ] Database integration

---

## 🎓 Learning Resources You'll Need

1. **JWT Authentication**: https://jwt.io/
2. **Bcrypt Hashing**: npm bcryptjs
3. **Express Middleware**: Express docs
4. **REST API Design**: RESTful conventions
5. **Error Handling**: Proper HTTP status codes

---

## 💡 Tips

1. **Start with Auth** - Everything depends on it
2. **Use Postman** - Test each endpoint before frontend uses it
3. **Keep responses consistent** - Always send same format
4. **Add proper error messages** - Frontend needs to know what went wrong
5. **Validate input** - Don't trust frontend data
6. **Use middleware** - Keeps code clean

---

**Good luck! You've got a solid structure. Now fill in the logic! 🚀**
