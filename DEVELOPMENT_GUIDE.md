# MedTracker Development Guide

This guide provides detailed instructions for implementing the MedTracker project following the 15-day development plan.

## 📅 Day-by-Day Implementation

### Day 1: Project Setup ✅

**Status**: Completed
**Tasks Done**:

- ✅ Created environment configuration files (.env.example)
- ✅ Updated package.json with required dependencies
- ✅ Created uploads directory with .gitignore
- ✅ Updated README.md with comprehensive documentation
- ✅ Created root package.json with development scripts

**Next Steps**: Run `npm run install-all` to install all dependencies

### Day 2: UI Design (Member 1 - Frontend)

**Tasks**:

- Create wireframes in Figma for:
  - Login/Signup pages
  - Dashboard with medical records overview
  - Add Record page with file upload
  - Reports listing page
  - Profile and Settings pages
- Design responsive layouts for mobile and desktop
- Define color scheme and typography
- Create component library documentation

**Deliverables**:

- Figma wireframes link
- Design system documentation

### Day 3: Backend Setup (Member 2 - Backend)

**Tasks**:

- Refactor Express server structure with proper middleware
- Set up MongoDB Atlas connection with proper configuration
- Implement proper error handling and logging
- Create environment variable validation
- Set up development and production configurations

**Files to Modify**:

- `server/index.js`
- `server/config/db.js`
- Create `server/middleware/` directory
- Create `server/utils/` directory

### Day 4: Auth System (Member 2 - Backend)

**Tasks**:

- Install and configure JWT and bcrypt
- Create User model with proper schema validation
- Implement authentication middleware
- Create auth controllers (register, login, logout)
- Set up password reset functionality
- Create auth routes with proper validation

**Files to Create**:

- `server/models/User.js`
- `server/controllers/authController.js`
- `server/routes/authRoutes.js`
- `server/middleware/auth.js`

### Day 5: API Development (Member 2 - Backend)

**Tasks**:

- Create Medical Record model with proper schema
- Implement CRUD controllers for medical records
- Create API routes with proper validation
- Set up proper error responses
- Test all endpoints with Postman
- Create API documentation

**Files to Create**:

- `server/models/MedicalRecord.js`
- `server/controllers/recordController.js`
- `server/routes/recordRoutes.js`

### Day 6: Frontend Skeleton (Member 1 - Frontend)

**Tasks**:

- Install and configure React Router
- Create proper routing structure for all pages
- Refactor existing components to work with routing
- Create layout components (Header, Sidebar, Footer)
- Implement protected routes for authenticated users
- Set up 404 and error pages

**Files to Modify**:

- `client/src/app/layout.jsx`
- `client/src/components/Navbar.jsx`
- Create `client/src/pages/` directory
- Create `client/src/context/` directory

### Day 7: Auth Pages (Member 1 - Frontend)

**Tasks**:

- Refactor existing Login form with proper validation
- Create Signup form with validation
- Install and configure Axios for API calls
- Implement authentication context/state management
- Connect forms to backend auth APIs
- Add form error handling and loading states

**Files to Create**:

- `client/src/context/AuthContext.js`
- `client/src/services/api.js`
- `client/src/pages/Signup.jsx`

### Day 8: Dashboard UI (Member 1 - Frontend)

**Tasks**:

- Refactor Dashboard component to display real data
- Create components for medical record cards
- Implement user information display
- Add "Add Record" functionality
- Create responsive grid layout for dashboard
- Add loading and error states

**Files to Modify**:

- `client/src/app/page.jsx`
- Create `client/src/components/DashboardCard.jsx`
- Create `client/src/components/RecentActivity.jsx`

### Day 9: File Upload (Member 2 - Backend & Member 1 - Frontend)

**Backend Tasks**:

- Install and configure Multer for file uploads
- Create file upload endpoints with validation
- Implement file storage (local or cloud)

**Frontend Tasks**:

- Create file upload form with drag-and-drop
- Implement file preview functionality
- Add upload progress indicators

**Files to Create**:

- `server/middleware/upload.js`
- `client/src/components/FileUpload.jsx`

### Day 10: API Integration (Both)

**Tasks**:

- Connect all frontend pages with backend APIs
- Implement proper error handling for API calls
- Add loading states for all data fetching
- Create reusable API service functions
- Implement data caching strategies
- Test all CRUD operations end-to-end

### Day 11: Testing & Debugging (Both)

**Tasks**:

- Test complete authentication flow
- Test medical record CRUD operations
- Fix CORS issues between frontend and backend
- Implement input validation on both frontend and backend
- Add proper error messages for user feedback
- Test file upload functionality

### Day 12: UI Improvements (Member 1 - Frontend)

**Tasks**:

- Add responsive design for mobile devices
- Implement loading spinners and skeleton screens
- Add proper error messages and notifications
- Improve accessibility (ARIA labels, keyboard navigation)
- Add animations and transitions
- Optimize performance for large data sets

### Day 13: Deployment (Backend) (Member 2 - Backend)

**Tasks**:

- Prepare backend for production deployment
- Set up environment variables for production
- Deploy backend on Render or Railway
- Test all deployed endpoints
- Set up monitoring and logging
- Create deployment documentation

### Day 14: Deployment (Frontend) (Member 1 - Frontend)

**Tasks**:

- Prepare frontend for production deployment
- Configure environment variables for production
- Deploy frontend on Vercel or Netlify
- Connect frontend to deployed backend URL
- Test complete application in production
- Set up custom domain if needed

### Day 15: Documentation (Both)

**Tasks**:

- Update README with installation and usage instructions
- Add screenshots of the application
- Create API documentation
- Write deployment guide
- Add contribution guidelines
- Perform final testing and bug fixes

## 🛠️ Development Commands

### Installation

```bash
npm run install-all  # Install all dependencies for root, server, and client
```

### Development

```bash
npm run dev          # Run both server and client in development mode
npm run server       # Run only the server
npm run client       # Run only the client
```

### Production

```bash
npm run build        # Build the client for production
npm start            # Start the server in production mode
```

## 📁 Project Structure After Setup

```
MedTracker/
├── client/                     # React frontend
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── app/               # Page components (Next.js structure)
│   │   │   ├── layout.jsx     # Root layout
│   │   │   ├── page.jsx       # Dashboard page
│   │   │   ├── login/         # Login page
│   │   │   ├── profile/       # Profile page
│   │   │   └── report/        # Reports page
│   │   ├── components/        # Reusable components
│   │   │   ├── ui/           # UI components
│   │   │   ├── Navbar.jsx    # Navigation component
│   │   │   └── Settings.jsx  # Settings component
│   │   ├── context/           # React context
│   │   ├── lib/              # Utility functions
│   │   └── services/         # API services
│   ├── package.json
│   └── .env.example
├── server/                    # Node.js backend
│   ├── config/               # Database configuration
│   │   └── db.js            # MongoDB connection
│   ├── controllers/          # Route controllers
│   │   ├── authController.js # Authentication logic
│   │   ├── userController.js # User management
│   │   └── recordController.js # Medical records
│   ├── middleware/           # Express middleware
│   │   ├── auth.js          # Authentication middleware
│   │   └── upload.js        # File upload middleware
│   ├── models/              # Mongoose models
│   │   ├── User.js          # User model
│   │   ├── Test.js          # Test model (existing)
│   │   └── MedicalRecord.js # Medical record model
│   ├── routes/              # API routes
│   │   ├── authRoutes.js    # Authentication routes
│   │   ├── testRoutes.js    # Test routes (existing)
│   │   └── recordRoutes.js  # Medical record routes
│   ├── uploads/             # File upload directory
│   ├── index.js             # Server entry point
│   ├── package.json
│   └── .env.example
├── package.json             # Root package.json with scripts
├── README.md               # Project documentation
└── DEVELOPMENT_GUIDE.md    # This guide
```

## 🔄 Git Workflow

1. Create feature branches for each day's tasks
2. Commit changes with descriptive messages
3. Push branches and create pull requests
4. Review and merge to main branch

## 📝 Notes

- Member 1 focuses on frontend development
- Member 2 focuses on backend development
- Both members collaborate on integration days (Day 10, 11, 15)
- Daily standups to track progress and resolve blockers
- Code reviews before merging to ensure quality

## 🚀 Quick Start for Development

1. Clone the repository
2. Run `npm run install-all`
3. Copy `.env.example` to `.env` in both client and server directories
4. Update environment variables with your configurations
5. Run `npm run dev` to start both frontend and backend

Good luck with your development! 🎉
