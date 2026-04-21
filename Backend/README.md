# SevaConnect Backend - Documentation Index

## 📚 Documentation Files

### 1. **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** ⚡ START HERE
**Best for:** Quick overview of what needs to be built
- 4 main pillars to build
- List of all 24 endpoints
- Implementation priority
- Key data structures
- File organization guide

### 2. **[FRONTEND_REQUIREMENTS.md](./FRONTEND_REQUIREMENTS.md)** 📋 DETAILED GUIDE
**Best for:** Understanding complete requirements
- Frontend architecture overview
- Detailed endpoint breakdown
- Query parameters & filters
- Frontend state expectations
- Implementation phases
- Database schema requirements

### 3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** 🏗️ STRUCTURE GUIDE
**Best for:** Understanding code organization
- Folder structure explanation
- MVC pattern details
- How to debug issues
- How to add new features
- Best practices followed

---

## 🎯 What to Build (Priority Order)

### Phase 1: Authentication (CRITICAL) 🔐
```
These MUST be done first - everything depends on them:
✗ User registration & login
✗ Password hashing
✗ JWT token generation
✗ Protected routes middleware
```

**Estimated Time:** 3-4 days
**Files to create:**
- `controllers/authController.js`
- `routes/authRoutes.js`
- `models/User.js`
- `middleware/auth.js`

---

### Phase 2: Task Management (CRITICAL) 📝
```
Main feature of the platform:
✗ Create tasks (NGO)
✗ Browse all tasks
✗ Apply to tasks (Volunteer)
✗ Withdraw applications
✗ Get applicants (NGO)
✗ Filter & search
```

**Estimated Time:** 4-5 days
**Files to update:**
- `controllers/taskController.js`
- `routes/taskRoutes.js`
- `models/Task.js`

---

### Phase 3: Admin Features (HIGH) 👑
```
Platform management:
✗ Approve/reject NGOs
✗ View all NGOs
✗ View all volunteers
✗ Platform statistics
```

**Estimated Time:** 2-3 days
**Files to create:**
- `controllers/adminController.js`
- `routes/adminRoutes.js`

---

### Phase 4: Polish & Optimization (MEDIUM) ✨
```
Quality improvements:
✗ Input validation
✗ Error handling
✗ Pagination
✗ Rate limiting
✗ Email verification
✗ Testing
```

**Estimated Time:** 3-4 days

---

## 📊 Current Status

```
✓ DONE (12.5%):
  ✓ Project structure organized
  ✓ Basic routes, controllers, models
  ✓ Utility endpoints (3/24)
  ✓ Error handling middleware
  ✓ CORS setup

✗ TODO (87.5%):
  ✗ Authentication system (5 endpoints)
  ✗ Task management (8 endpoints)
  ✗ NGO management (5 endpoints)
  ✗ Volunteer management (3 endpoints)
  ✗ Database integration
  ✗ Validation & sanitization
  ✗ Advanced features
```

---

## 🚀 Quick Start Guide

### 1. Install Required Packages
```bash
npm install bcryptjs jsonwebtoken mongoose
npm install joi express-validator
npm install nodemailer  # for email verification (optional)
```

### 2. Set up Environment Variables
```env
# .env file
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sevaconnect
JWT_SECRET=your_secret_key_here
JWT_EXPIRY=7d
```

### 3. Follow This Structure for New Features

```javascript
// 1. Create model (models/User.js)
class User {
  constructor(email, password, role) { ... }
}

// 2. Create controller (controllers/authController.js)
exports.register = async (req, res) => { ... }
exports.login = async (req, res) => { ... }

// 3. Create routes (routes/authRoutes.js)
router.post('/login', authController.login)
router.post('/register', authController.register)

// 4. Use in server.js
app.use('/api/auth', authRoutes)
```

### 4. Test Each Endpoint with Postman
- Create requests for each endpoint
- Test with different roles
- Check error handling
- Verify response format

---

## 📋 The 24 Endpoints You Need

### Authentication (5)
- [x] POST `/api/auth/ngo/login`
- [x] POST `/api/auth/ngo/register`
- [x] POST `/api/auth/volunteer/login`
- [x] POST `/api/auth/volunteer/register`
- [x] POST `/api/auth/logout`

### Tasks (8)
- [x] GET `/api/tasks`
- [x] GET `/api/tasks/:id`
- [x] POST `/api/tasks`
- [x] PUT `/api/tasks/:id`
- [x] DELETE `/api/tasks/:id`
- [x] POST `/api/tasks/:id/apply`
- [x] DELETE `/api/tasks/:id/apply`
- [x] GET `/api/tasks/:id/applicants`

### NGO (5)
- [x] GET `/api/admin/ngos`
- [x] GET `/api/ngos/:id`
- [x] PUT `/api/ngos/:id`
- [x] PATCH `/api/admin/ngos/:id/approve`
- [x] PATCH `/api/admin/ngos/:id/reject`

### Volunteer (3)
- [x] GET `/api/volunteer/profile`
- [x] PUT `/api/volunteer/profile`
- [x] GET `/api/volunteer/applied-tasks`

### Utility (3) ✓ Already Done
- [x] GET `/`
- [x] GET `/health`
- [x] GET `/api/test`

---

## 🔑 Important Concepts

### JWT Token Flow
```
User Login → Generate JWT → Send to Frontend
↓
Frontend stores JWT in localStorage
↓
Every API request includes: Authorization: Bearer <token>
↓
Backend verifies JWT → Allow request
```

### Role-Based Access
```
Middleware checks: Is user authorized for this route?
- Volunteer can only access: /api/volunteer/*, /api/tasks/apply
- NGO can only access: /api/tasks (create), /api/ngos/profile
- Admin can only access: /api/admin/*
```

### Error Handling
```
Always return consistent format:
{
  success: false,
  message: "Error description",
  error: "Specific error details"
}
```

---

## 🐛 Debugging Tips

1. **Check the controller** - Logic issue usually here
2. **Check the model** - Data structure problem
3. **Check the route** - Wrong HTTP method or path
4. **Check middleware** - Auth or validation failing
5. **Check error logs** - Server output

Use `console.log()` strategically:
```javascript
console.log('Request received:', req.body)
console.log('User:', req.user)
console.log('Response:', response)
```

---

## 📞 Frontend Integration Checklist

- [ ] Frontend can login with valid credentials
- [ ] Frontend receives JWT token
- [ ] JWT token is stored and used in requests
- [ ] Protected routes reject requests without token
- [ ] Tasks can be created, read, updated, deleted
- [ ] Volunteers can apply to tasks
- [ ] NGOs can see applicants
- [ ] Admin can approve/reject NGOs
- [ ] Profile endpoints work
- [ ] All errors are caught and displayed
- [ ] Search and filtering work
- [ ] Pagination works

---

## 🎓 Learning Resources

- **Express.js:** https://expressjs.com/
- **JWT:** https://jwt.io/
- **MongoDB with Mongoose:** https://mongoosejs.com/
- **Bcrypt:** https://github.com/kelektiv/node.bcrypt.js
- **REST API Best Practices:** https://restfulapi.net/

---

## 💬 Common Questions

**Q: Which database should I use?**
A: MongoDB with Mongoose is easier for beginners. PostgreSQL is more powerful.

**Q: How do I test APIs?**
A: Use Postman (free tool) to test each endpoint before frontend connects.

**Q: What if frontend breaks?**
A: Check FRONTEND_REQUIREMENTS.md to see exactly what it expects.

**Q: How do I handle errors?**
A: Always send proper HTTP status codes (200, 400, 401, 404, 500).

**Q: What about security?**
A: Hash passwords, use JWT, validate input, use HTTPS in production.

---

## 📞 Need Help?

1. Check `ARCHITECTURE.md` for code organization
2. Check `FRONTEND_REQUIREMENTS.md` for exact requirements
3. Check `QUICK_REFERENCE.md` for quick overview
4. Use Postman to test endpoints
5. Check server logs for errors

---

**You've got a solid foundation. Now build it out! 🚀**

Last Updated: April 21, 2026
