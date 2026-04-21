# SevaConnect Backend - Project Structure

## 📁 Folder Organization

```
Backend/
├── server.js                 # Main server entry point
├── package.json              # Dependencies
├── .env                      # Environment variables
│
├── routes/                   # API Route definitions
│   ├── volunteerRoutes.js   # Volunteer API routes
│   └── ngoRoutes.js         # NGO API routes
│
├── controllers/              # Business logic
│   ├── volunteerController.js # Volunteer operations
│   └── ngoController.js       # NGO operations
│
├── models/                   # Data models/schemas
│   ├── Volunteer.js         # Volunteer model
│   ├── NGO.js               # NGO model
│   └── Task.js              # Task model
│
├── middleware/               # Custom middleware (future)
│
├── utils/                    # Utility functions (future)
│
└── node_modules/             # Dependencies
```

## 🏗️ Architecture Overview

### **MVC Pattern (Model-View-Controller)**

1. **Models** (`models/`) - Data structure definitions
   - Define schema and structure of data entities
   - Keep pure data models without business logic

2. **Controllers** (`controllers/`) - Business Logic
   - Handle request processing
   - Interact with models
   - Prepare responses
   - Contains all the API logic

3. **Routes** (`routes/`) - API Endpoints
   - Define URL paths
   - Link routes to controllers
   - Handle HTTP methods (GET, POST, DELETE, etc.)

## 📋 API Endpoints

### **Volunteer Endpoints**
```
GET    /api/volunteers              # Get all volunteers
GET    /api/volunteers/:id          # Get volunteer by ID
POST   /api/volunteers              # Create new volunteer
DELETE /api/volunteers/:id          # Delete volunteer
```

### **NGO Endpoints**
```
GET    /api/ngos                    # Get all NGOs
GET    /api/ngos/:id                # Get NGO by ID
GET    /api/ngos/category/:category # Get NGOs by category
POST   /api/ngos                    # Create new NGO
DELETE /api/ngos/:id                # Delete NGO
```

### **Utility Endpoints**
```
GET    /                            # Welcome/Home
GET    /health                      # Health check
GET    /api/test                    # API test
```

## 🔍 How to Debug

### Example: Fixing a Volunteer API Issue

1. **Error in Response?** → Check `controllers/volunteerController.js`
2. **Wrong Data?** → Check `models/Volunteer.js`
3. **Route Not Found?** → Check `routes/volunteerRoutes.js`
4. **Server Issues?** → Check `server.js`

### Debug Workflow

```
User Request
    ↓
routes/volunteerRoutes.js (URL routing)
    ↓
controllers/volunteerController.js (Business logic)
    ↓
models/Volunteer.js (Data validation)
    ↓
Response to User
```

## 🚀 How to Add New Features

### Example: Add User Authentication

1. Create `models/User.js`
2. Create `controllers/authController.js`
3. Create `routes/authRoutes.js`
4. Import and use in `server.js`

```javascript
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
```

## 📦 Current Features

✅ Get all volunteers  
✅ Get volunteer by ID  
✅ Create new volunteer  
✅ Delete volunteer  
✅ Get all NGOs  
✅ Get NGO by ID  
✅ Get NGOs by category  
✅ Create new NGO  
✅ Delete NGO  

## 🛠️ Making Changes

### To add a new endpoint:

1. Add method in `controllers/[resource]Controller.js`
2. Add route in `routes/[resource]Routes.js`
3. Test the endpoint

### Example: Add update volunteer endpoint

**Step 1:** Update `controllers/volunteerController.js`
```javascript
exports.updateVolunteer = (req, res) => {
  // Implementation
};
```

**Step 2:** Update `routes/volunteerRoutes.js`
```javascript
router.put('/:id', volunteerController.updateVolunteer);
```

**Step 3:** Test
```bash
curl -X PUT http://localhost:3001/api/volunteers/1
```

## 📝 Testing Commands

```bash
# Get all volunteers
curl http://localhost:3001/api/volunteers

# Get volunteer by ID
curl http://localhost:3001/api/volunteers/1

# Create volunteer
curl -X POST http://localhost:3001/api/volunteers \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com"}'

# Get all NGOs
curl http://localhost:3001/api/ngos

# Get NGOs by category
curl http://localhost:3001/api/ngos/category/Education

# Delete volunteer
curl -X DELETE http://localhost:3001/api/volunteers/1
```

## ✨ Best Practices Followed

✅ Separation of Concerns (Routes, Controllers, Models)  
✅ Clean code structure  
✅ Error handling  
✅ Consistent response format  
✅ RESTful API design  
✅ Easy to debug and maintain  

---

**Status**: ✅ All tests passing  
**Last Updated**: April 21, 2026
