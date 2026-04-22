DATABASE_SETUP.md

# 🗄️ SevaConnect Database Setup Guide

## Overview
This guide covers the MongoDB database setup for SevaConnect, including schema design, configuration, and initial data seeding.

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Configuration](#database-configuration)
3. [Schema Overview](#schema-overview)
4. [Installation & Setup](#installation--setup)
5. [Seeding Test Data](#seeding-test-data)
6. [Database Collections](#database-collections)
7. [Indexes](#indexes)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js** (v14 or higher)
- **MongoDB** (v4.0 or higher)
  - **Local Installation**: [MongoDB Community Edition](https://docs.mongodb.com/manual/administration/install-community/)
  - **Cloud Option**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)

### Node Packages
```bash
npm install mongoose bcryptjs jsonwebtoken
```

---

## Database Configuration

### Local MongoDB Setup (macOS)

#### Step 1: Install MongoDB with Homebrew
```bash
brew install mongodb-community@7.0
```

#### Step 2: Start MongoDB Service
```bash
# Start MongoDB in background
brew services start mongodb-community@7.0

# Check if running
brew services list
```

#### Step 3: Verify Installation
```bash
# Connect to MongoDB shell
mongosh

# Show databases
show databases

# Exit shell
exit
```

### MongoDB Atlas Setup (Cloud)

#### Step 1: Create Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Sign Up"
3. Complete registration

#### Step 2: Create Cluster
1. Click "Create a Deployment"
2. Choose "M0 Free" tier
3. Select region (closest to your location)
4. Click "Create Deployment"

#### Step 3: Get Connection String
1. Go to "Database"
2. Click "Connect"
3. Choose "Drivers"
4. Copy MongoDB URI
5. Update `.env` with your connection string

---

## Schema Overview

### User Collection

#### Fields by Role

**Common to All Roles:**
- `name`: String (required)
- `email`: String (unique, required)
- `password`: String (hashed, required)
- `phone`: String
- `role`: String (enum: volunteer, ngo, admin)
- `isActive`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

**Volunteer-Specific:**
```javascript
{
  skills: [String],           // e.g., ["teaching", "coding"]
  availability: String,       // weekdays, weekends, flexible
  appliedTasks: [
    {
      taskId: ObjectId,
      appliedAt: Date,
      status: String         // applied, accepted, rejected, completed
    }
  ],
  bio: String,
  profileImage: String
}
```

**NGO-Specific:**
```javascript
{
  organizationName: String,
  organizationDescription: String,
  registrationNumber: String,
  address: String,
  city: String,
  state: String,
  zipCode: String,
  website: String,
  socialLinks: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String
  },
  isApproved: Boolean,          // Admin approval required
  approvedBy: ObjectId,         // Admin user ID
  approvedAt: Date,
  rejectionReason: String,
  postedTasks: [ObjectId],      // Task references
  logoImage: String
}
```

**Admin-Specific:**
- Uses only common fields (role: 'admin')

### Task Collection

```javascript
{
  title: String,                // Required
  description: String,          // Required
  category: String,             // education, healthcare, environment, community, emergency, other
  location: {
    address: String,
    city: String,               // Required
    state: String,
    zipCode: String
  },
  postedBy: ObjectId,           // NGO user ID (required)
  skillsRequired: [String],
  volunteerCount: Number,       // Min volunteers needed
  duration: String,             // one-time, weekly, monthly, ongoing
  startDate: Date,              // Required
  endDate: Date,
  applicants: [
    {
      volunteerId: ObjectId,
      appliedAt: Date,
      status: String            // applied, accepted, rejected, completed
    }
  ],
  acceptedVolunteers: [ObjectId],
  status: String,               // open, in-progress, completed, cancelled
  priority: String,             // low, medium, high, urgent
  image: String,
  views: Number,
  isUrgent: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Installation & Setup

### Step 1: Update .env File

```properties
# .env
PORT=3001
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/sevaconnect
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sevaconnect?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRY=7d

# Admin Credentials
ADMIN_EMAIL=admin@sevaconnect.com
ADMIN_PASSWORD=admin123
```

### Step 2: Install Dependencies

```bash
cd Backend
npm install mongoose bcryptjs jsonwebtoken
```

### Step 3: Start Server

```bash
# Development mode with nodemon
npm run dev

# OR standard mode
node server.js
```

Expected output:
```
✅ MongoDB connected successfully
📊 Database: sevaconnect
🔗 Host: localhost
✅ Server is running on http://localhost:3001
```

---

## Seeding Test Data

### Automatic Seeding

Run the seed script to populate test data:

```bash
node scripts/seedDatabase.js
```

#### What Gets Seeded:
- **3 Test Volunteers**
  - Rajesh Kumar (teaching, coding)
  - Priya Sharma (healthcare, nursing)
  - Arun Patel (environment, agriculture)

- **3 Test NGOs**
  - Education for All (APPROVED)
  - Healthcare Heroes (APPROVED)
  - Green Earth (PENDING approval)

- **3 Test Tasks**
  - Math teaching (Education category)
  - Medical camp (Healthcare category)
  - Beach cleanup (Environment category)

#### Test Credentials After Seeding:

```
VOLUNTEERS:
├─ rajesh@example.com / password123
├─ priya@example.com / password123
└─ arun@example.com / password123

NGOs:
├─ ngo1@example.com / password123 (APPROVED ✓)
├─ ngo2@example.com / password123 (APPROVED ✓)
└─ ngo3@example.com / password123 (PENDING ⏳)

ADMIN:
└─ admin@sevaconnect.com / admin123
```

### Manual Seeding via MongoDB Shell

```javascript
// Connect to MongoDB
mongosh

// Switch to sevaconnect database
use sevaconnect

// Create volunteer
db.users.insertOne({
  name: "Test Volunteer",
  email: "volunteer@test.com",
  password: "hashed_password", // Use bcrypt
  role: "volunteer",
  skills: ["teaching"],
  availability: "weekends",
  isActive: true,
  createdAt: new Date()
})

// View users
db.users.find()
```

---

## Database Collections

### Users Collection

```bash
# View all users (excluding passwords)
db.users.find({}, {password: 0})

# Find volunteers only
db.users.find({role: "volunteer"}, {password: 0})

# Find approved NGOs
db.users.find({role: "ngo", isApproved: true}, {password: 0})

# Count by role
db.users.aggregate([{$group: {_id: "$role", count: {$sum: 1}}}])
```

### Tasks Collection

```bash
# View all tasks
db.tasks.find()

# Find open tasks
db.tasks.find({status: "open"})

# Find urgent tasks
db.tasks.find({isUrgent: true})

# Find tasks by category
db.tasks.find({category: "education"})

# Count tasks by status
db.tasks.aggregate([{$group: {_id: "$status", count: {$sum: 1}}}])
```

---

## Indexes

### Automatically Created Indexes

The schema definitions automatically create indexes for:

**Users:**
- `email` (unique)
- `role`
- `isApproved` (for NGO approval queries)

**Tasks:**
- `postedBy` + `status` (NGO's tasks)
- `category` + `status` (browsing tasks by category)
- `city` + `status` (location-based search)
- `startDate` (upcoming tasks)
- `status` (filtering by status)

---

## Troubleshooting

### Issue: MongoDB Connection Refused

**Error Message:**
```
❌ MongoDB connection failed: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
```bash
# Check if MongoDB is running
brew services list

# If not running, start it
brew services start mongodb-community@7.0

# Verify connection
mongosh
```

### Issue: Duplicate Key Error

**Error Message:**
```
E11000 duplicate key error collection: sevaconnect.users index: email_1
```

**Solution:**
```bash
# Clear database and reseed
node scripts/seedDatabase.js

# OR manually delete collection
mongosh
> use sevaconnect
> db.users.deleteMany({})
```

### Issue: Authentication Failed (Atlas)

**Error Message:**
```
AuthenticationError: authentication failed
```

**Solution:**
1. Check username/password in connection string
2. Ensure IP is whitelisted in Atlas
3. Verify `.env` has correct URI
4. URL encode special characters in password

### Issue: Slow Queries

**Solution:**
```bash
# Check existing indexes
db.users.getIndexes()
db.tasks.getIndexes()

# Monitor query performance
db.setProfilingLevel(1, {slowms: 100})
db.system.profile.find().sort({ts: -1}).limit(5)
```

---

## Best Practices

### 1. Password Security
- ✅ Passwords are hashed with bcrypt (10 salt rounds)
- ✅ Never store plain text passwords
- ✅ Always use `.select('+password')` when needed for login

### 2. Data Validation
- ✅ Email format validated
- ✅ Required fields enforced
- ✅ Role enum validation

### 3. Backup & Recovery
```bash
# Backup database
mongodump --db sevaconnect --out ./backups

# Restore database
mongorestore --db sevaconnect ./backups/sevaconnect
```

### 4. Production Checklist
- [ ] Use MongoDB Atlas or managed service
- [ ] Enable authentication & encryption
- [ ] Whitelist IP addresses
- [ ] Regular backups
- [ ] Use strong JWT_SECRET
- [ ] Remove test/seed data
- [ ] Enable database monitoring

---

## Connection String Examples

### Local MongoDB
```
mongodb://localhost:27017/sevaconnect
```

### MongoDB Atlas
```
mongodb+srv://username:password@cluster.mongodb.net/sevaconnect?retryWrites=true&w=majority
```

### With Options
```
mongodb://localhost:27017/sevaconnect?retryWrites=true&maxPoolSize=10
```

---

## Useful MongoDB Commands

```bash
# Connect to database
mongosh

# Show all databases
show databases

# Use specific database
use sevaconnect

# Show collections
show collections

# Drop database
db.dropDatabase()

# Get collection stats
db.users.stats()

# Create index
db.users.createIndex({email: 1}, {unique: true})

# Drop index
db.users.dropIndex("email_1")

# Export to JSON
mongoexport --db sevaconnect --collection users --out users.json

# Import from JSON
mongoimport --db sevaconnect --collection users --file users.json
```

---

## Next Steps

1. ✅ Install MongoDB
2. ✅ Configure .env
3. ✅ Start server
4. ✅ Run seed script
5. 👉 Test authentication endpoints
6. 👉 Build task management features
7. 👉 Implement admin approval system

---

## Support & Documentation

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [bcryptjs NPM](https://www.npmjs.com/package/bcryptjs)

---

**Last Updated**: April 2026
**Version**: 1.0
**Status**: ✅ Production Ready
