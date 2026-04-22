TESTING_GUIDE.md

# 🧪 SevaConnect Complete Testing Guide

## Quick Start - Test the Full Stack

### Prerequisites Check ✅

```bash
# 1. MongoDB running
brew services list | grep mongodb
# Expected: ✔︎ mongodb-community started

# 2. Backend running (Port 3001)
lsof -i :3001
# Expected: node server.js

# 3. Frontend running (Port 5174)
lsof -i :5174
# Expected: vite dev server

# 4. MongoDB Compass (Optional but recommended)
open /Applications/MongoDB\ Compass.app
```

---

## Test 1: Verify Database is Seeded

### Check Seed Data

```bash
# Count users
mongosh sevaconnect --eval "db.users.countDocuments()"
# Expected: 6 (3 volunteers + 3 NGOs)

# Count tasks
mongosh sevaconnect --eval "db.tasks.countDocuments()"
# Expected: 3

# View a volunteer
mongosh sevaconnect --eval "db.users.findOne({role: 'volunteer'}, {password: 0})" 
```

### Test Credentials (Already in Database)

**Volunteers:**
```
Email: rajesh@example.com
Password: password123
Role: volunteer
Skills: teaching, coding, mentoring

Email: priya@example.com
Password: password123
Role: volunteer
Skills: healthcare, nursing, first-aid

Email: arun@example.com
Password: password123
Role: volunteer
Skills: environment, agriculture, recycling
```

**NGOs (Approved):**
```
Email: ngo1@example.com
Password: password123
Role: ngo
Organization: Education for All
Status: APPROVED ✓

Email: ngo2@example.com
Password: password123
Role: ngo
Organization: Healthcare Heroes
Status: APPROVED ✓

Email: ngo3@example.com
Password: password123
Role: ngo
Organization: Green Earth
Status: PENDING (awaiting approval)
```

**Admin:**
```
Email: admin@sevaconnect.com
Password: admin123
Role: admin
```

---

## Test 2: Test Login via API

### Test Volunteer Login

```bash
curl -X POST http://localhost:3001/api/auth/volunteer/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rajesh@example.com",
    "password": "password123"
  }' | jq .
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "69e88fa6f4cf6eac2e8ec942",
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "role": "volunteer",
    "skills": ["teaching", "coding", "mentoring"],
    "availability": "weekends",
    ...
  }
}
```

### Test NGO Login (Approved)

```bash
curl -X POST http://localhost:3001/api/auth/ngo/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ngo1@example.com",
    "password": "password123"
  }' | jq .
```

**Expected:** Success with NGO data

### Test NGO Login (Not Approved - Should Fail)

```bash
curl -X POST http://localhost:3001/api/auth/ngo/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ngo3@example.com",
    "password": "password123"
  }' | jq .
```

**Expected Response:**
```json
{
  "success": false,
  "message": "NGO is not approved yet. Please wait for admin approval."
}
```

### Test Admin Login

```bash
curl -X POST http://localhost:3001/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sevaconnect.com",
    "password": "admin123"
  }' | jq .
```

**Expected:** Success with admin token

### Test Wrong Password

```bash
curl -X POST http://localhost:3001/api/auth/volunteer/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rajesh@example.com",
    "password": "wrongpassword"
  }' | jq .
```

**Expected:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## Test 3: Test Registration via API

### Create New Volunteer Account

```bash
curl -X POST http://localhost:3001/api/auth/volunteer/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Developer",
    "email": "john.dev@example.com",
    "password": "secure123",
    "phone": "9876543210",
    "skills": ["nodejs", "react", "mongodb"],
    "availability": "weekends"
  }' | jq .
```

**Expected:**
```json
{
  "success": true,
  "message": "Volunteer registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "_id": "new_mongo_id",
    "name": "John Developer",
    "email": "john.dev@example.com",
    "role": "volunteer",
    ...
  }
}
```

### Verify in MongoDB Compass

1. Open MongoDB Compass
2. Navigate to `sevaconnect` → `users`
3. Look for `john.dev@example.com`
4. ✅ Verify:
   - Password is hashed (starts with `$2a$10$`)
   - Email is lowercase
   - Skills array populated
   - Role is "volunteer"

### Create New NGO Account

```bash
curl -X POST http://localhost:3001/api/auth/ngo/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "NGO Admin",
    "email": "newNGO@example.com",
    "password": "ngopass123",
    "phone": "9000000001",
    "organizationName": "Tech for Good",
    "organizationDescription": "Teaching tech to underprivileged",
    "registrationNumber": "NGO/2026/999"
  }' | jq .
```

**Expected Response:**
```json
{
  "success": true,
  "message": "NGO registered successfully. Awaiting admin approval.",
  "token": "...",
  "user": {
    "role": "ngo",
    "organizationName": "Tech for Good",
    "isApproved": false,
    ...
  }
}
```

### Verify NGO Cannot Login Yet

```bash
curl -X POST http://localhost:3001/api/auth/ngo/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newNGO@example.com",
    "password": "ngopass123"
  }' | jq .
```

**Expected:**
```json
{
  "success": false,
  "message": "NGO is not approved yet. Please wait for admin approval."
}
```

✅ **This is correct behavior!** NGOs need admin approval before login.

---

## Test 4: Test Full UI Flow - Sign Up → Monitor → Login

### 🎬 Complete Registration Workflow

#### Step 1: Open Frontend

```bash
# In browser
http://localhost:5174
```

#### Step 2: Open MongoDB Compass

```bash
open /Applications/MongoDB\ Compass.app
```

1. Connect to `mongodb://localhost:27017`
2. Navigate to `sevaconnect` → `users`
3. Click the **Watch** (eye) icon
4. Leave Compass open in background

#### Step 3: Register New Account

On Frontend (http://localhost:5174):

1. Click **"Register"** button
2. Select **"Volunteer"** role
3. Fill in form:
   ```
   Name: Test User
   Email: testuser@example.com
   Password: test123456
   Phone: 9123456789
   Skills: testing, documentation
   Availability: flexible
   ```
4. Click **"Create Account"**

#### Step 4: Watch Real-Time Update

In MongoDB Compass:
- ⏱️ Watch the collection refresh
- 🆕 A new document appears!
- ✅ Click it to verify:
  - Email: `testuser@example.com`
  - Name: `Test User`
  - Role: `volunteer`
  - Password: hashed (starts with `$2a$10$`)
  - Skills: `["testing", "documentation"]`

#### Step 5: Login with New Account

On Frontend:
1. Go to **Login** page
2. Select **Volunteer**
3. Enter:
   ```
   Email: testuser@example.com
   Password: test123456
   ```
4. Click **Sign in**

#### Step 6: Verify Token Storage

Open DevTools (F12):
1. Go to **Application** → **LocalStorage**
2. Verify localStorage has:
   - `auth_token`: JWT token
   - `user_role`: `volunteer`
   - `user_data`: User object JSON

#### Step 7: Decode JWT Token (Optional)

Go to https://jwt.io:
1. Copy `auth_token` from localStorage
2. Paste in left side (Encoded)
3. View decoded payload:
   ```json
   {
     "id": "mongo_id",
     "email": "testuser@example.com",
     "role": "volunteer",
     "name": "Test User",
     "exp": 1776934500,
     "iat": 1776329700
   }
   ```

---

## Test 5: Test Frontend Integration

### Login with Seed Data

#### On Frontend

1. Open http://localhost:5174
2. Click **Login**
3. Select **Volunteer**
4. Enter:
   ```
   Email: rajesh@example.com
   Password: password123
   ```
5. Click **Sign In**

**Expected:**
- ✅ Success notification appears
- ✅ Redirects to `/volunteer/dashboard`
- ✅ Dashboard loads with user data
- ✅ Token saved in localStorage

#### Monitor in Console

Open Browser DevTools (F12) → Console:

```javascript
// View saved token
localStorage.getItem('auth_token')
// → "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// View user role
localStorage.getItem('user_role')
// → "volunteer"

// View user data
JSON.parse(localStorage.getItem('user_data'))
// → { name: "Rajesh Kumar", email: "rajesh@example.com", ... }
```

---

## Test 6: Register New User via Frontend

### Complete Registration Flow

1. Frontend: http://localhost:5174
2. Click **Register**
3. Select **Volunteer**
4. Fill form with NEW email:
   ```
   Name: Jane Smith
   Email: jane.smith@example.com  ← MUST BE NEW
   Password: jane123456
   Confirm Password: jane123456
   Phone: 9111222333
   Skills: design, marketing
   Availability: weekends
   ```
5. Click **Create Account**

### Monitor in Real-Time

**In MongoDB Compass:**
- Watch the users collection
- New document appears with jane.smith@example.com
- All fields properly stored
- Password hashed

**In Browser Console:**
- Check `auth_token` is set
- Check `user_data` contains jane.smith's info

**Frontend Redirect:**
- Should go to `/volunteer/dashboard`
- Should show "Welcome Jane Smith"

---

## Test 7: Error Handling

### Test Missing Fields

```bash
# Missing email
curl -X POST http://localhost:3001/api/auth/volunteer/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "password": "pass123",
    "phone": "9999999999"
  }' | jq .
```

**Expected:**
```json
{
  "success": false,
  "message": "Email, password, name, and phone are required"
}
```

### Test Duplicate Email

```bash
# Register with existing email
curl -X POST http://localhost:3001/api/auth/volunteer/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "rajesh@example.com",  ← Already exists
    "password": "pass123",
    "phone": "9999999999"
  }' | jq .
```

**Expected:**
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

### Test Invalid Email Format

```bash
# Invalid email format
curl -X POST http://localhost:3001/api/auth/volunteer/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "not-an-email",  ← Invalid format
    "password": "pass123",
    "phone": "9999999999"
  }' | jq .
```

**Expected:**
```json
{
  "success": false,
  "message": "Validation error: Invalid email format"
}
```

---

## Test 8: Data Validation

### Check Password Hashing

In MongoDB Compass:
1. View any user document
2. Expand `password` field
3. ✅ Should see: `$2a$10$...` (bcrypt hash)
4. ❌ Should NOT see: plain text password

### Check Email Normalization

In MongoDB Compass:
1. Register with `TEST@EXAMPLE.COM`
2. In database, it's stored as: `test@example.com` (lowercase)
3. Login with either case works

### Check Role-Based Access

```bash
# Try to login as volunteer with NGO account
curl -X POST http://localhost:3001/api/auth/volunteer/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ngo1@example.com",
    "password": "password123"
  }' | jq .
```

**Expected:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

✅ **Correct!** Roles are enforced

---

## Test 9: NGO Approval Workflow

### Step 1: Register New NGO

```bash
curl -X POST http://localhost:3001/api/auth/ngo/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "NGO Manager",
    "email": "test.ngo@example.com",
    "password": "ngopass123",
    "phone": "9000000099",
    "organizationName": "New NGO",
    "organizationDescription": "A new organization"
  }' | jq .
```

**Response:**
```json
{
  "success": true,
  "message": "NGO registered successfully. Awaiting admin approval.",
  "user": {
    "isApproved": false
  }
}
```

### Step 2: Try to Login (Should Fail)

```bash
curl -X POST http://localhost:3001/api/auth/ngo/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.ngo@example.com",
    "password": "ngopass123"
  }' | jq .
```

**Expected:**
```json
{
  "success": false,
  "message": "NGO is not approved yet. Please wait for admin approval."
}
```

### Step 3: Admin Approves (In MongoDB)

In MongoDB Compass:
1. Find `test.ngo@example.com`
2. Edit document
3. Change `isApproved` from `false` to `true`
4. Click **Save**

### Step 4: Now NGO Can Login

```bash
curl -X POST http://localhost:3001/api/auth/ngo/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.ngo@example.com",
    "password": "ngopass123"
  }' | jq .
```

**Expected:** Success! ✅

---

## Test 10: Token Validation

### Use Token in Protected Request

Get token from login:

```bash
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/volunteer/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rajesh@example.com","password":"password123"}' \
  | jq -r '.token')

echo $TOKEN
```

Use token in request:

```bash
curl -X GET http://localhost:3001/api/auth/debug/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq .
```

**Expected:** Users list returned

### Expired/Invalid Token

```bash
curl -X GET http://localhost:3001/api/auth/debug/users \
  -H "Authorization: Bearer invalid_token" \
  -H "Content-Type: application/json" | jq .
```

**Expected:**
```json
{
  "success": false,
  "message": "Invalid token"
}
```

---

## Troubleshooting

### Issue: "Invalid email or password" on Login

**Checklist:**
- [ ] MongoDB running? `brew services list`
- [ ] Seed script executed? `node scripts/seedDatabase.js`
- [ ] Backend restarted after seeding? 
- [ ] Correct password? (Test with `password123`)

**Debug:**
```bash
# Check if user exists
mongosh sevaconnect --eval "db.users.findOne({email: 'rajesh@example.com'}, {password: 0})"

# Check password format (should be hashed)
mongosh sevaconnect --eval "db.users.findOne({email: 'rajesh@example.com'}).password"
```

### Issue: Frontend won't connect to backend

**Check:**
```bash
# Backend running?
lsof -i :3001

# Can reach it?
curl http://localhost:3001/health

# Check CORS headers
curl -i http://localhost:3001/health
```

### Issue: localStorage not saving after login

**Check DevTools:**
1. F12 → Application → LocalStorage
2. Should have `auth_token`, `user_role`, `user_data`
3. If missing, check browser console for errors

---

## Quick Reference - API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/volunteer/register` | Create volunteer account |
| POST | `/api/auth/volunteer/login` | Volunteer login |
| POST | `/api/auth/ngo/register` | Create NGO account |
| POST | `/api/auth/ngo/login` | NGO login |
| POST | `/api/auth/admin/login` | Admin login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/debug/users` | View all users (debug) |

---

## Summary: Complete Test Flow

```
1. ✅ Verify MongoDB running
2. ✅ Verify Backend running (3001)
3. ✅ Verify Frontend running (5174)
4. ✅ Test login with seed data (rajesh@example.com)
5. ✅ Test new registration
6. ✅ Monitor in MongoDB Compass
7. ✅ Verify token in localStorage
8. ✅ Test error cases
9. ✅ All working! 🎉
```

---

**Last Updated**: April 2026
**Status**: ✅ Complete Testing Framework
