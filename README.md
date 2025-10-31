# MedTracker

**MedTracker** is a comprehensive medical record management system focused on empowering patients to securely store, organize, and access their health information in one place. The platform helps users track medication schedules, manage appointments, and monitor their overall health through an intuitive dashboard.

## 🌟 Features

- 🔐 **Secure Medical Record Management**: Upload, store, and organize medical documents with end-to-end encryption
- 👤 **User Authentication**: JWT-based secure login and registration with password strength validation
- 📊 **Dashboard Overview**: Track appointments, medications, and test results with visual analytics
- 📁 **File Upload**: Support for various medical document formats (PDF, images, Word docs)
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🏷️ **Profile Management**: Manage personal information and medical history
- 🔍 **Advanced Search**: Filter and search records by type, date, doctor, and more
- 📅 **Appointment Scheduling**: Schedule and manage medical appointments
- 🔔 **Customizable Tags**: Organize records with custom tags and categories
- 📈 **Data Visualization**: Visualize health trends and statistics
- 🔔 **Privacy Controls**: Fine-grained privacy settings for data sharing

## 🛠️ Tech Stack

### Frontend

- **Next.js 14+** - React framework with App Router for optimal performance
- **React 18+** - UI library with hooks for state management
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Axios** - HTTP client for API requests with interceptors
- **React Hook Form** - Form management with validation
- **React Query** - Server state management and caching
- **Lucide React** - Beautiful icon library for consistent UI
- **React Router** - Client-side routing with protected routes

### Backend

- **Node.js 18+** - JavaScript runtime with ES6 modules
- **Express.js** - Web framework with middleware support
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT Authentication** - Secure authentication with refresh tokens
- **Multer** - File upload handling with validation
- **Bcrypt** - Password hashing for security
- **Express Validator** - Input validation and sanitization
- **Winston** - Structured logging for debugging
- **Rate Limiting** - API protection against abuse

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- Git and GitHub account (for deployment)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/medtracker.git
   cd medtracker
   ```

2. **Install dependencies**

   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Server
   cp server/.env.example server/.env
   # Edit server/.env with your MongoDB Atlas connection string and JWT secret

   # Client
   cp client/.env.example client/.env
   # Edit client/.env with your API URL
   ```

4. **Start the development servers**

   ```bash
   # Start server (in one terminal)
   cd server
   npm run dev

   # Start client (in another terminal)
   cd ../client
   npm run dev
   ```

## 📁 Project Structure

```
medtracker/
├── client/                 # Next.js frontend
│   ├── pages/           # Next.js pages with App Router
│   │   ├── app/       # App Router pages
│   │   └── api/       # API routes
│   ├── components/       # Reusable components
│   │   ├── ui/        # UI components
│   │   └── forms/      # Form components
│   ├── context/          # React context
│   ├── services/         # API services
│   ├── styles/          # Global styles
│   └── utils/           # Utility functions
├── server/                # Express.js backend
│   ├── controllers/     # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── uploads/         # File upload directory
├── docs/                 # Documentation
│   ├── TESTING_GUIDE.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── DEVELOPMENT_GUIDE.md
└── README.md
```

## 🔌 API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout a user
- `PUT /api/auth/updatedetails` - Update user profile
- `PUT /api/auth/updatepassword` - Update user password
- `POST /api/auth/forgotpassword` - Request password reset
- `PUT /api/auth/resetpassword/:token` - Reset password

### Medical Records

- `GET /api/records` - Get all records for a user
- `GET /api/records/:id` - Get a specific record
- `POST /api/records` - Create a new record
- `PUT /api/records/:id` - Update a record
- `DELETE /api/records/:id` - Delete a record
- `DELETE /api/records/:id/files/:fileId` - Delete a file from a record
- `GET /api/records/stats` - Get record statistics
- `GET /api/records/reminders` - Get upcoming reminders
- `PUT /api/records/:id/reminders/:reminderId` - Update reminder status

## 🎨 UI Components

### Authentication

- Login form with validation
- Signup form with password strength indicator
- Password reset flow
- Profile management

### Medical Records

- Record creation form with file upload
- Record list with filtering and search
- Record detail view
- Edit and delete functionality

### Common

- Responsive navigation
- Loading states
- Error handling
- Toast notifications
- Modal dialogs

## 🧪 Testing

### Backend Testing

- Unit tests for controllers and models
- Integration tests for API endpoints
- Error handling tests
- Authentication middleware tests

### Frontend Testing

- Component unit tests with Jest and React Testing Library
- Integration tests for user flows
- End-to-end tests with Cypress

### Test Coverage

- Backend: Aim for >80% code coverage
- Frontend: Aim for >70% component coverage

## 🚀 Deployment

### Backend Options

- **Render** - Recommended for Node.js applications
- **Railway** - Good for containerized deployments
- **Vercel Serverless** - For serverless functions

### Frontend Options

- **Vercel** - Recommended for Next.js applications
- **Netlify** - Good for static sites
- **AWS Amplify** - For full-stack applications

### Environment Variables

```bash
# Backend (.env)
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
MAX_FILE_SIZE=10485760

# Frontend (.env)
NEXT_PUBLIC_API_URL=your_deployed_backend_url
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**

   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Commit your changes**

   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

4. **Push to the branch**

   ```bash
   git push origin feature/AmazingFeature
   ```

5. **Open a Pull Request**
   - Provide a clear description of your changes
   - Link to any relevant issues

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Express.js](https://expressjs.com/) - The web framework
- [MongoDB](https://www.mongodb.com/) - The database
- [Tailwind CSS](https://tailwindcss.com/) - The CSS framework
- [Lucide](https://lucide.dev/) - The icon library

## 📞 Support

If you have any questions or need help with the project, please:

1. Check the [documentation](docs/)
2. Search [existing issues](https://github.com/your-username/medtracker/issues)
3. Create a new issue if needed

## 🔮 Future Roadmap

- [ ] Hospital-side features for admin management
- [ ] AI-powered health insights and recommendations
- [ ] Medication reminders and tracking
- [ ] Appointment scheduling system
- [ ] Integration with healthcare providers
- [ ] Mobile application

---

**MedTracker** - Your health, organized and accessible.
