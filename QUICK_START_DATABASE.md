QUICK_START_DATABASE.md

# 🚀 Quick Start: Database + Frontend Integration

## 5-Minute Setup

### Step 1: Verify All Services (30 seconds)

```bash
# Check MongoDB
brew services list | grep mongodb
# Expected: ✔︎ mongodb-community started

# Check Backend
lsof -i :3001
# Expected: should show node process

# Check Frontend
lsof -i :5174
# Expected: should show vite process

# If anything is missing, see "Startup Commands" below
```

### Step 2: Open MongoDB Compass (15 seconds)

```bash
# On macOS
open /Applications/MongoDB\ Compass.app

# OR just press Cmd+Space and type "Compass"
```

### Step 3: Connect to Database (30 seconds)

In MongoDB Compass:

1. Leave Connection String as: `mongodb://localhost:27017`
2. Click **"Save & Connect"**
3. Wait for green "Connected" indicator
4. You should see `sevaconnect` database in left sidebar

### Step 4: Open Browser (30 seconds)

Open 3 windows:
1. **MongoDB Compass** (Database visualization)
2. **Browser Tab 1**: http://localhost:5174 (Frontend)
3. **Browser Tab 2**: F12 → DevTools (View Console & LocalStorage)

---

## Live Demo: Register → Monitor → Login

### 🎬 Part 1: Watch New Registration

**In MongoDB Compass:**
1. Click `sevaconnect` → `users`
2. Click the **Watch** button (eye icon on top right)
3. Leave it open

**In Frontend Browser:**
1. Click **Register** button
2. Select **Volunteer**
3. Fill form:
   ```
   Name: Demo User
   Email: demo@example.com
   Password: demo123456
   Phone: 9123456789
   Skills: demo
   Availability: flexible
   ```
4. Click **Create Account**

**Watch in Compass:**
- ⏱️ The collection refreshes
- 🆕 New document appears!
- 📊 Document count increases

### 🎬 Part 2: Verify Data Saved

**In MongoDB Compass:**
1. Click the new document with `demo@example.com`
2. Verify all fields:
   ```
   ✅ name: "Demo User"
   ✅ email: "demo@example.com"
   ✅ role: "volunteer"
   ✅ password: $2a$10$... (HASHED!)
   ✅ skills: ["demo"]
   ✅ createdAt: current timestamp
   ```

**In Browser DevTools:**
1. F12 → **Application** → **LocalStorage**
2. Verify stored:
   ```
   auth_token: "eyJhbGci..." (JWT)
   user_role: "volunteer"
   user_data: {"name":"Demo User",...}
   ```

### 🎬 Part 3: Test Login

**First, Logout:**
1. Frontend: Click profile menu
2. Click **Logout**
3. Verify tokens removed from localStorage

**Now Login with Test Data:**
1. Click **Login**
2. Select **Volunteer**
3. Use seed data:
   ```
   Email: rajesh@example.com
   Password: password123
   ```
4. Click **Sign In**

**Result:**
- ✅ Login successful
- ✅ Redirects to dashboard
- ✅ Token saved
- ✅ User info displayed

---

## Startup Commands

If services are not running, use these:

### Start MongoDB

```bash
brew services start mongodb-community@7.0
```

### Start Backend

```bash
cd /Users/adarshsingh/Desktop/SevaConnect/Backend
node server.js
```

### Start Frontend

```bash
cd /Users/adarshsingh/Desktop/SevaConnect/Frontend
npx vite
```

---

## Test Credentials (Already Seeded)

### Volunteers
```
rajesh@example.com / password123
priya@example.com / password123
arun@example.com / password123
```

### Approved NGOs
```
ngo1@example.com / password123
ngo2@example.com / password123
```

### Admin
```
admin@sevaconnect.com / admin123
```

---

## What Gets Saved to Database

### When User Registers

```
✅ Name (e.g., "Rajesh Kumar")
✅ Email (lowercase: "rajesh@example.com")
✅ Password (hashed with bcrypt: $2a$10$...)
✅ Phone number
✅ Role (volunteer/ngo/admin)
✅ Skills (for volunteers)
✅ Organization (for NGOs)
✅ Account creation timestamp
✅ Account update timestamp
✅ Approval status (for NGOs)
```

### When User Logs In

```
✅ JWT Token generated (7-day expiry)
✅ Token stored in browser localStorage
✅ User role stored
✅ User data stored (without password!)
✅ Token sent with each API request
```

### Data Integrity Checks

MongoDB Compass automatically shows:
- ✅ Email uniqueness (no duplicates)
- ✅ Password hashing (never plain text)
- ✅ Required fields populated
- ✅ Timestamps accurate
- ✅ Role constraints enforced

---

## MongoDB Compass Interface Guide

### Left Sidebar
```
sevaconnect (database)
├── users (collection)
│   └── Shows count: 6 documents
├── tasks (collection)
│   └── Shows count: 3 documents
└── _system (hidden)
```

### Top Toolbar
```
🔄 Refresh      - Reload collection
👁️  Watch       - Monitor real-time changes
⊕ Insert        - Add new document
🔍 Filter       - Search documents
📊 Aggregation  - Advanced queries
```

### Document Viewer
```
Each document shown with:
- _id (MongoDB ID)
- All fields with values
- Data types highlighted
- Edit button to modify
- Delete button to remove
```

---

## Real-Time Workflow Example

### Scenario: "Register new volunteer while monitoring"

**Timeline:**

| Time | Action | What Happens |
|------|--------|--------------|
| T=0s | Open Compass & click Watch | Dashboard ready, watching for changes |
| T=5s | Frontend: Click Register | Form appears |
| T=10s | Fill form & submit | Data sent to backend |
| T=11s | Backend: Validate & hash | Password hashed |
| T=12s | Backend: Save to MongoDB | Document inserted |
| T=13s | **Compass updates** | 🆕 New document visible! |
| T=14s | Frontend: Show success | User sees confirmation |
| T=15s | Browser: Token saved | localStorage updated |

---

## Verification Checklist

After each action, verify:

### Registration Complete ✅
- [ ] Success message shown
- [ ] Redirected to dashboard
- [ ] Token in localStorage
- [ ] New document in Compass
- [ ] Password is hashed

### Login Successful ✅
- [ ] Success notification
- [ ] Correct dashboard loaded
- [ ] JWT token in localStorage
- [ ] User data matches
- [ ] Can see user role

### Data in Database ✅
- [ ] All required fields present
- [ ] Email is lowercase
- [ ] Password hashed ($2a$10$)
- [ ] Timestamps are recent
- [ ] Role is correct

---

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Compass won't connect | `brew services start mongodb-community@7.0` |
| Backend returns 404 | Verify server running: `lsof -i :3001` |
| Frontend can't reach API | Check CORS, verify backend URL in `api.js` |
| Password not hashing | Reseed: `node scripts/seedDatabase.js` |
| Login fails | Check Compass for user (maybe typo in email) |
| No localStorage after signup | Check browser console for errors (F12) |

---

## Next Steps After Successful Testing

1. ✅ Register new users via frontend
2. ✅ Monitor registrations in Compass
3. ✅ Test login/logout flow
4. ✅ Verify token storage
5. 👉 **Build more features:**
   - Task creation
   - Task browsing
   - Volunteer applications
   - Admin approvals

---

## Key Points to Remember

```
🔑 Key Facts:

1. Frontend at: http://localhost:5174
2. Backend at: http://localhost:3001/api
3. Database at: mongodb://localhost:27017
4. Compass connects to: mongodb://localhost:27017

📊 Data Flow:

Form Input → Frontend → Backend API → MongoDB → Compass Display

🔐 Security:

- Passwords are hashed with bcrypt
- JWTs expire after 7 days
- Tokens stored in browser localStorage
- Role-based access control enforced
```

---

## Common Questions

### Q: Why is my password hashed?
A: Security! We use bcrypt (industry standard) so even if database is breached, passwords are protected.

### Q: What's in the JWT token?
A: User ID, email, role, name, and expiration date. Decode at jwt.io

### Q: Can I see passwords in Compass?
A: No! Passwords are hashed. You'll see `$2a$10$...` which is the hash. The actual password is unrecoverable.

### Q: Why do I need MongoDB Compass?
A: To visually explore your database, verify data was saved correctly, and debug issues.

### Q: What if registration fails?
A: Check:
1. All fields filled in form
2. Email not already used
3. Backend running (check console)
4. MongoDB running (check `brew services`)

---

## You're All Set! 🎉

Your complete stack is now:
- ✅ Frontend: React + Vite (5174)
- ✅ Backend: Express + Node (3001)
- ✅ Database: MongoDB local (27017)
- ✅ Monitoring: MongoDB Compass
- ✅ Authentication: JWT + Bcrypt

**Go build amazing things!** 🚀

---

**Last Updated**: April 2026
**Status**: Ready for Development
