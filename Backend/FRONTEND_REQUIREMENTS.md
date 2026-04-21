# 📋 Backend Requirements Analysis - Based on Frontend

## 🔍 Frontend Overview

Your frontend is a volunteer management platform with **3 user roles**:
1. **Volunteer** - Browse and apply for tasks
2. **NGO** - Create tasks and manage volunteers
3. **Admin** - Manage NGOs and oversee platform

---

## 🚀 What Backend Needs to Build

### **1. AUTHENTICATION & USER MANAGEMENT** ⚠️ PRIORITY: CRITICAL

```
Routes needed:
✗ POST   /api/auth/ngo/login              - NGO login
✗ POST   /api/auth/ngo/register           - NGO registration  
✗ POST   /api/auth/volunteer/login        - Volunteer login
✗ POST   /api/auth/volunteer/register     - Volunteer registration
✗ POST   /api/auth/logout                 - Logout (clear token)
```

**Features Required:**
- JWT token generation
- Password hashing
- Email validation
- Role-based access control (RBAC)
- Token refresh mechanism

**Data Needed from Users:**
- Volunteer: name, email, password, phone, skills, availability
- NGO: organization name, email, password, phone, sector, description

---

### **2. TASK MANAGEMENT** ⚠️ PRIORITY: CRITICAL

```
Routes needed:
✗ GET    /api/tasks                       - Get all tasks (with filters)
✗ GET    /api/tasks/:id                   - Get single task
✗ POST   /api/tasks                       - Create task (NGO only)
✗ PUT    /api/tasks/:id                   - Update task (NGO only)
✗ DELETE /api/tasks/:id                   - Delete task (NGO only)
✗ POST   /api/tasks/:id/apply             - Apply to task (Volunteer)
✗ DELETE /api/tasks/:id/apply             - Withdraw application
✗ GET    /api/tasks/:id/applicants        - Get task applicants (NGO)
```

**Task Data Structure:**
```javascript
{
  id, title, description, location, date, time,
  ngoId, ngoName, sector,
  requiredVolunteers, appliedVolunteers,
  urgency (high/medium/low),
  tags, daysLeft, status
}
```

**Filters Frontend Expects:**
- By urgency
- By category/sector
- By location
- By date range
- Search by title

---

### **3. NGO MANAGEMENT** ⚠️ PRIORITY: HIGH

```
Routes needed:
✗ GET    /api/admin/ngos                  - Get all NGOs (Admin only)
✗ GET    /api/ngos/:id                    - Get NGO profile
✗ PUT    /api/ngos/:id                    - Update NGO profile
✗ PATCH  /api/admin/ngos/:id/approve      - Approve NGO (Admin)
✗ PATCH  /api/admin/ngos/:id/reject       - Reject NGO (Admin)
```

**NGO Data Structure:**
```javascript
{
  id, name, code, email, phone,
  sector, description, location,
  status (pending/approved/rejected),
  volunteers (count), tasksPosted (count),
  createdAt, approvedAt
}
```

---

### **4. VOLUNTEER MANAGEMENT** ⚠️ PRIORITY: HIGH

```
Routes needed:
✗ GET    /api/volunteer/profile           - Get volunteer profile
✗ PUT    /api/volunteer/profile           - Update volunteer profile
✗ GET    /api/volunteer/applied-tasks     - Get tasks volunteer applied to
```

**Volunteer Data Structure:**
```javascript
{
  id, name, email, phone, 
  skills (array), availability (array),
  tasksApplied (count), tasksCompleted (count),
  bio, profilePicture, rating,
  createdAt
}
```

---

## 📊 Frontend API Calls Expected

From `src/services/api.js`, these are the exact endpoints the frontend expects:

```javascript
// AUTH
authService.loginNGO(data)              // POST /auth/ngo/login
authService.loginVolunteer(data)        // POST /auth/volunteer/login
authService.registerNGO(data)           // POST /auth/ngo/register
authService.registerVolunteer(data)     // POST /auth/volunteer/register
authService.logout()                    // Clear token

// TASKS
taskService.getAllTasks(filters)        // GET /tasks?filters
taskService.getTaskById(id)             // GET /tasks/:id
taskService.createTask(data)            // POST /tasks
taskService.updateTask(id, data)        // PUT /tasks/:id
taskService.deleteTask(id)              // DELETE /tasks/:id
taskService.getTaskApplicants(taskId)   // GET /tasks/:id/applicants
taskService.applyToTask(taskId)         // POST /tasks/:id/apply
taskService.withdrawApplication(taskId) // DELETE /tasks/:id/apply

// NGO
ngoService.getAllNGOs()                 // GET /admin/ngos
ngoService.approveNGO(ngoId)            // PATCH /admin/ngos/:id/approve
ngoService.rejectNGO(ngoId)             // PATCH /admin/ngos/:id/reject
ngoService.getNGOProfile(ngoId)         // GET /ngos/:id
ngoService.updateNGOProfile(ngoId, data) // PUT /ngos/:id

// VOLUNTEER
volunteerService.getProfile()           // GET /volunteer/profile
volunteerService.updateProfile(data)    // PUT /volunteer/profile
volunteerService.getAppliedTasks()      // GET /volunteer/applied-tasks
```

---

## 🛠️ Implementation Order

### **Phase 1: Core Auth (Week 1)**
1. User model with JWT authentication
2. NGO registration & login
3. Volunteer registration & login
4. Password hashing (bcrypt)
5. Protected routes middleware

### **Phase 2: Task Management (Week 2)**
1. Task model & CRUD operations
2. Create task (NGO)
3. Browse all tasks (Volunteer)
4. Apply/withdraw from task
5. Get applicants for task (NGO)

### **Phase 3: Admin Panel (Week 3)**
1. Admin login
2. Approve/reject NGOs
3. View all NGOs
4. View all tasks
5. View all volunteers

### **Phase 4: Profiles & Optimization (Week 4)**
1. Volunteer profile management
2. NGO profile management
3. Search & filtering
4. Pagination
5. Error handling & validation

---

## 🔑 Key Features Needed

### **1. Database Schema** (Using MongoDB/PostgreSQL)

**Users Collection:**
```
- email (unique)
- password (hashed)
- name
- phone
- role (volunteer/ngo/admin)
- status (for NGO: pending/approved/rejected)
- profile data
- createdAt
```

**Tasks Collection:**
```
- title, description, location
- ngoId (foreign key)
- requiredVolunteers, appliedVolunteers
- date, time, urgency, daysLeft
- applicants (array of volunteer IDs)
- status (open/in-progress/completed)
- createdAt, updatedAt
```

### **2. Middleware Needed**

- JWT authentication middleware
- Role-based authorization (volunteer/ngo/admin)
- Error handling
- Request validation
- CORS (already done ✓)

### **3. Security Features**

- Password hashing (bcrypt)
- JWT tokens with expiry
- Input validation
- Rate limiting
- SQL injection prevention

---

## 📝 Frontend State Management Shows It Expects:

From `AppContext.jsx`, the frontend expects to manage:
- `user` - Current logged-in user
- `tasks` - All available tasks
- `ngos` - All NGOs
- `loading` - Loading states
- `notification` - Toast notifications
- `theme` - Dark/light mode

**Backend should provide:**
- Real data instead of mock data
- Proper error responses
- Loading indicators
- Success/failure notifications

---

## 🎯 Current Status

✓ Already Done:
- Volunteer & NGO models created
- Routes structure ready
- Controllers structure ready
- Basic API endpoints working

✗ Still Need to Build:
- User authentication system
- Password hashing
- JWT token generation
- Database integration
- Email validation
- Admin functionality
- Search & filtering
- Pagination
- Proper error handling

---

## 📦 Recommended Tech Stack

```
Database:     MongoDB (with mongoose) OR PostgreSQL (with sequelize)
Auth:         JWT + bcrypt
Validation:   joi OR express-validator
Environment:  dotenv (already setup ✓)
```

---

## 🚦 Next Steps

1. **Install required packages:**
   ```bash
   npm install bcryptjs jsonwebtoken mongoose dotenv
   ```

2. **Create User model with authentication**

3. **Add JWT middleware for protected routes**

4. **Update Task and NGO models with proper schema**

5. **Integrate with database**

6. **Test all endpoints against frontend**

---

**Total Endpoints to Build: 24**  
**Current Status: 3/24 (12.5%)**  
**Estimated Time: 2-3 weeks with proper implementation**
