MONGODB_COMPASS_GUIDE.md

# 📊 MongoDB Compass Setup & Monitoring Guide

## Overview
MongoDB Compass is a powerful GUI for MongoDB that allows you to visually explore your database, create collections, insert documents, and monitor real-time data changes. This guide will help you connect Compass to your local MongoDB and monitor your SevaConnect database.

---

## Installation

### Step 1: Download MongoDB Compass
1. Go to [MongoDB Compass Download](https://www.mongodb.com/products/compass)
2. Select your OS (macOS, Windows, Linux)
3. Download and install

### Step 2: Verify Installation (macOS)
```bash
# On macOS, Compass is usually installed in Applications
open /Applications/MongoDB\ Compass.app
```

---

## Connecting to Local MongoDB

### Method 1: Direct Connection (Recommended)

1. **Open MongoDB Compass**
2. **Connection String**: Leave default or enter:
   ```
   mongodb://localhost:27017
   ```
3. **Click Connect**

Expected Result: You should see a list of databases including `sevaconnect`

### Method 2: Manual Configuration

1. Open Compass
2. Click **New Connection**
3. Configure:
   - **Host**: `localhost`
   - **Port**: `27017`
   - **Authentication**: None (for local development)
4. Click **Save & Connect**

---

## Verifying Connection

✅ **You're connected when you see:**
- ✓ Green "Connected" status
- ✓ Database list on the left sidebar
- ✓ `sevaconnect` database in the list

---

## Exploring Your Data

### View Collections

Once connected to `sevaconnect`:

```
sevaconnect
├── users
│   ├── Volunteers
│   ├── NGOs
│   └── Admins
├── tasks
└── _system
```

### View Documents in Users Collection

1. Click **sevaconnect** → **users**
2. You'll see all registered users
3. Each document shows:
   - `_id`: Unique MongoDB ID
   - `name`: User name
   - `email`: Email address
   - `role`: 'volunteer', 'ngo', or 'admin'
   - `createdAt`: Registration timestamp

### Filter Users by Role

**Example: View only Volunteers**

1. Click the **Filter** button
2. Enter filter:
   ```json
   { "role": "volunteer" }
   ```
3. Press **Apply**

**Example: View only Approved NGOs**
```json
{ "role": "ngo", "isApproved": true }
```

---

## Monitoring Real-Time Data

### Watch Database Changes

1. In Users collection, click the **eye icon** (Watch)
2. Now every time a new user registers, you'll see it appear live!

### Example: Monitor Login Activity

As users log in from the frontend:
1. Compass automatically updates
2. You can see new documents appear
3. Timestamps show exactly when registration occurred

---

## Inserting Test Data Manually

### Example: Add a Test Volunteer

1. Click **sevaconnect** → **users**
2. Click **Insert Document**
3. Paste (Compass auto-formats):

```json
{
  "name": "Test Volunteer",
  "email": "testvolunteer@example.com",
  "password": "$2a$10$...", // Use hashed password
  "phone": "9999999999",
  "role": "volunteer",
  "skills": ["testing", "documentation"],
  "availability": "weekends",
  "isActive": true,
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

4. Click **Insert**

---

## Monitoring Task Data

### View All Tasks

1. Navigate to **sevaconnect** → **tasks**
2. See all posted tasks with:
   - Title
   - Description
   - Category
   - Status (open, in-progress, completed)
   - Posted by (NGO ID)
   - Applicants count

### Filter Tasks by Status

**Open Tasks Only:**
```json
{ "status": "open" }
```

**Urgent Tasks:**
```json
{ "isUrgent": true }
```

**Tasks by Category (Education):**
```json
{ "category": "education", "status": "open" }
```

---

## Real-Time Workflow: Sign Up → Monitor → Verify

### Step 1: Frontend Sign Up (Live Monitoring)

1. **Open in Browser**: http://localhost:5174
2. **Open MongoDB Compass**: Sidebar view on `users` collection
3. **Click Watch** in Compass (watch icon)
4. **On Frontend**: Click "Register" → Fill form → Submit

### Step 2: Instant Verification

1. **In Compass**: New user document appears instantly!
2. **Click document** to view full details
3. **Verify fields**:
   - ✓ Name matches
   - ✓ Email is lowercase
   - ✓ Password is hashed (not plain text)
   - ✓ Role is correct
   - ✓ Timestamp is current

### Step 3: Test Login

1. **On Frontend**: Go to Login page
2. **Enter credentials** from one of the seeded users:
   ```
   Email: rajesh@example.com
   Password: password123
   ```
3. **In Compass**: 
   - The user document doesn't change (login doesn't modify DB)
   - Check browser console for JWT token

---

## Checking JWT Token & User Session

### Verify Login Created Token

1. **On Frontend**: Open Developer Tools (F12)
2. **Go to**: Application → LocalStorage
3. **Look for**:
   - `auth_token`: JWT token (long string)
   - `user_role`: 'volunteer', 'ngo', or 'admin'
   - `user_data`: Stringified user object

### Decode JWT Token (Optional)

1. Go to [jwt.io](https://jwt.io)
2. Copy `auth_token` from localStorage
3. Paste in JWT.io left side (Encoded)
4. You'll see payload with:
   - `id`: User MongoDB ID
   - `email`: User email
   - `role`: User role
   - `name`: User name
   - `exp`: Expiration timestamp

---

## Useful Queries in Compass

### Count Users by Role
```json
// Filter
{ }

// Then look at bottom: "8 of 8 documents"
```

### Find Users Registered Today
```json
{ "createdAt": { "$gte": <DATE_TODAY> } }
```

### Find Failed Login Attempts (if tracked)
```json
{ "lastLoginAttempt": { "$exists": true } }
```

### Search by Email
```json
{ "email": /rajesh/ }  // Partial match
```

### Find Tasks with Most Applicants
```json
{ "applicants": { "$exists": true, "$ne": [] } }
```

---

## Collection Statistics

### Check Database Size

1. Click **sevaconnect** database name
2. **Statistics tab** shows:
   - Collections: 2 (users, tasks)
   - Documents: Total count
   - Size: Storage used
   - Indexes: Created for fast queries

### View Indexes

1. Click **users** collection
2. **Indexes** tab shows:
   - `_id_`: Always present
   - `email_1`: Unique email lookup
   - `role_1`: Fast role filtering

---

## Data Validation & Consistency

### Check Data Types

Click any document in Compass to see:
```
Field Type ────────────────────────
name      String
email     String
password  String (hashed)
role      String (enum)
skills    Array
phone     String
createdAt ISODate
```

### Verify Password Hashing

1. Click any user document
2. **Expand `password` field**
3. Should see: `$2a$10$...` (bcrypt hash)
4. ❌ **NOT plain text password** ← Security check ✓

---

## Troubleshooting

### Issue: Cannot Connect to MongoDB

**Error**: "Connection refused"

**Solution**:
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# If not running, start it
brew services start mongodb-community@7.0

# Verify with mongosh
mongosh
```

### Issue: Cannot See `sevaconnect` Database

**Reason**: Database hasn't been created yet

**Solution**:
1. Run seed script: `node scripts/seedDatabase.js`
2. Then refresh Compass (F5)

### Issue: Password Not Hashed (Shows Plain Text)

**Problem**: Security issue!

**Solution**:
1. Check User model has `pre('save')` middleware
2. Check `authController.js` calls `await newVolunteer.save()`
3. Re-seed database: `node scripts/seedDatabase.js`

---

## Best Practices

✅ **DO:**
- Use Compass for data exploration
- Monitor real-time registrations
- Verify data integrity
- Check indexes before querying
- Use filters for large collections

❌ **DON'T:**
- Edit production data directly
- Delete important collections
- Modify data types randomly
- Keep Compass connected 24/7 (local only)

---

## Useful Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Cmd+Enter** | Execute query |
| **Cmd+K** | Open command palette |
| **Cmd+F** | Search documents |
| **Cmd+Shift+E** | Expand all fields |
| **Cmd+Shift+C** | Collapse all fields |

---

## Step-by-Step: Monitor Registration Workflow

### 📋 Setup (Do Once)

```bash
# 1. Start MongoDB
brew services start mongodb-community@7.0

# 2. Start Backend
cd Backend
node server.js

# 3. Start Frontend
cd Frontend
npx vite

# 4. Open MongoDB Compass
open /Applications/MongoDB\ Compass.app
```

### 👀 Monitor Live Registration

```
1. In Compass:
   └─ Click sevaconnect → users
   └─ Click Watch (eye icon)
   
2. In Browser (localhost:5174):
   └─ Click "Register" or "Sign Up"
   └─ Fill form
   └─ Submit

3. Back in Compass:
   └─ ⏱️ NEW DOCUMENT APPEARS!
   └─ Click it to view details
   └─ Verify all fields
```

### 🔍 Verify Data Integrity

```
✓ Name matches form input
✓ Email is lowercase
✓ Password is hashed ($2a$10$...)
✓ Role is 'volunteer', 'ngo', or 'admin'
✓ Skills array populated (volunteers)
✓ OrganizationName present (NGOs)
✓ isApproved: false for new NGOs
✓ createdAt is current timestamp
```

---

## Summary

| Tool | Purpose |
|------|---------|
| **MongoDB** | Database server (localhost:27017) |
| **Compass** | Visual database explorer & monitor |
| **Backend API** | Express server (localhost:3001/api) |
| **Frontend** | React app (localhost:5174) |

**Workflow**:
```
Frontend Form → Backend API → MongoDB Database → Compass Display
```

---

## Next Steps

1. ✅ MongoDB installed & running
2. ✅ Compass connected to local MongoDB
3. ✅ Backend seeded with test data
4. ✅ Frontend connected to backend
5. 👉 **Test full flow**: Register → Monitor in Compass → Login → Verify

**You can now see user data flow in real-time!**

---

**Last Updated**: April 2026
**Status**: ✅ Production Ready for Local Development
