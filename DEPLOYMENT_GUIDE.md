# MedTracker Deployment Guide

This guide provides step-by-step instructions for deploying the MedTracker application to production environments.

## 🚀 Backend Deployment

### Option 1: Deploy to Render

#### Prerequisites

- [ ] Node.js 18+ installed
- [ ] MongoDB Atlas account and cluster
- [ ] Render account (free tier is sufficient for testing)
- [ ] Git repository with backend code

#### Step 1: Prepare Backend for Deployment

1. **Update Environment Variables**

   ```bash
   # Create production environment file
   cp server/.env.example server/.env.production
   ```

2. **Configure Production Environment**

   ```bash
   # Edit server/.env.production with your production values
   NODE_ENV=production
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   JWT_COOKIE_EXPIRES_IN=7d
   MAX_FILE_SIZE=10485760
   ```

3. **Update Package.json**

   ```json
   // Add to server/package.json
   "scripts": {
     "start": "node index.js",
     "dev": "nodemon index.js"
   },
   "engines": {
     "node": ">=18.0.0"
   }
   ```

#### Step 2: Deploy to Render

1. **Connect Git Repository**
   - Push your backend code to GitHub/GitLab
   - Ensure the repository is public or has Render access

2. **Create New Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your Git repository
   - Select "Node" as the runtime
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Add environment variables from your `.env.production` file

3. **Configure Environment Variables**

   ```bash
   # Add these in Render dashboard
   NODE_ENV=production
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   MAX_FILE_SIZE=10485760
   ```

4. **Deploy and Test**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Test the deployed API endpoints

### Option 2: Deploy to Railway

#### Prerequisites

- [ ] Node.js 18+ installed
- [ ] MongoDB Atlas account and cluster
- [ ] Railway account
- [ ] Git repository with backend code

#### Step 1: Prepare Backend for Deployment

1. **Create Railway Project**

   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   ```

2. **Initialize Railway Project**

   ```bash
   # Navigate to server directory
   cd server
   
   # Initialize Railway project
   railway init
   ```

#### Step 2: Deploy to Railway

1. **Configure Environment Variables**

   ```bash
   # Set environment variables
   railway variables set NODE_ENV=production
   railway variables set MONGO_URI=your_mongodb_atlas_connection_string
   railway variables set JWT_SECRET=your_jwt_secret_key
   railway variables set JWT_EXPIRE=7d
   railway variables set MAX_FILE_SIZE=10485760
   ```

2. **Deploy Application**

   ```bash
   # Deploy to Railway
   railway up
   ```

3. **Verify Deployment**
   - Check Railway dashboard for deployment status
   - Test the deployed API endpoints

### Option 3: Deploy to Vercel (Serverless)

#### Prerequisites

- [ ] Node.js 18+ installed
- [ ] Vercel account
- [ ] Git repository with backend code

#### Step 1: Prepare Backend for Serverless Deployment

1. **Create API Routes File**

   ```javascript
   // Create server/api/index.js
   module.exports = require('./index.js');
   ```

2. **Update Package.json**

   ```json
   // Add to server/package.json
   "main": "api/index.js",
   "scripts": {
     "vercel-build": "npm install",
     "start": "node api/index.js"
   }
   ```

#### Step 2: Deploy to Vercel

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**

   ```bash
   # Navigate to server directory
   cd server
   
   # Deploy to Vercel
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Go to Vercel dashboard
   - Add environment variables for your project

## 🌐 Frontend Deployment

### Option 1: Deploy to Vercel

#### Prerequisites

- [ ] Node.js 18+ installed
- [ ] Vercel account
- [ ] Git repository with frontend code

#### Step 1: Prepare Frontend for Deployment

1. **Update Environment Variables**

   ```bash
   # Create production environment file
   cp client/.env.example client/.env.production
   ```

2. **Configure Production Environment**

   ```bash
   # Edit client/.env.production with your production values
   NEXT_PUBLIC_API_URL=your_deployed_backend_url
   ```

3. **Update Package.json**

   ```json
   // Add to client/package.json
   "scripts": {
     "build": "next build",
     "start": "next start"
   },
   "homepage": "https://your-app-name.vercel.app"
   ```

#### Step 2: Deploy to Vercel

1. **Connect Git Repository**
   - Push your frontend code to GitHub/GitLab
   - Ensure the repository is public or has Vercel access

2. **Create New Project on Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Connect your Git repository
   - Select "Next.js" as the framework
   - Configure build settings

3. **Configure Environment Variables**

   ```bash
   # Add these in Vercel dashboard
   NEXT_PUBLIC_API_URL=your_deployed_backend_url
   ```

4. **Deploy and Test**
   - Click "Deploy"
   - Wait for deployment to complete
   - Test the deployed application

### Option 2: Deploy to Netlify

#### Prerequisites

- [ ] Node.js 18+ installed
- [ ] Netlify account
- [ ] Git repository with frontend code

#### Step 1: Prepare Frontend for Deployment

1. **Update Build Configuration**

   ```json
   // Add to client/next.config.js
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     images: {
       domains: ['your-app-name.netlify.app']
     }
   };
   
   module.exports = nextConfig;
   ```

2. **Update Package.json**

   ```json
   // Add to client/package.json
   "scripts": {
     "build": "next build",
     "start": "next start",
     "export": "next export"
   }
   ```

#### Step 2: Deploy to Netlify

1. **Build Application**

   ```bash
   # Navigate to client directory
   cd client
   
   # Build the application
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "Sites" → "Add new site"
   - Drag and drop the `out` directory from the build
   - Configure build settings

3. **Configure Environment Variables**

   ```bash
   # Add these in Netlify dashboard
   NEXT_PUBLIC_API_URL=your_deployed_backend_url
   ```

4. **Deploy and Test**
   - Click "Deploy site"
   - Wait for deployment to complete
   - Test the deployed application

## 🔧 Post-Deployment Configuration

### Backend Configuration

1. **Set Up CORS**

   ```javascript
   // In server/index.js
   const cors = require('cors');
   
   app.use(cors({
     origin: ['https://your-frontend-domain.com', 'https://your-app-name.vercel.app'],
     credentials: true
   }));
   ```

2. **Configure File Upload**

   ```javascript
   // In server/index.js
   app.use('/uploads', express.static('uploads'));
   ```

3. **Set Up Rate Limiting**

   ```javascript
   // In server/index.js
   const rateLimit = require('express-rate-limit');
   
   app.use('/api/', rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   }));
   ```

### Frontend Configuration

1. **Update API Base URL**

   ```javascript
   // In client/src/services/api.js
   const api = axios.create({
     baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://your-backend-domain.com/api',
     // ... other config
   });
   ```

2. **Configure Error Handling**

   ```javascript
   // In client/src/services/api.js
   api.interceptors.response.use(
     (response) => {
       return response;
     },
     (error) => {
       if (error.response?.status === 401) {
         window.location.href = '/login';
       }
       return Promise.reject(error);
     }
   );
   ```

## 🔍 Testing Deployed Application

### Backend Testing

1. **API Health Check**

   ```bash
   # Test health endpoint
   curl https://your-backend-domain.com/api/health
   ```

2. **Authentication Testing**

   ```bash
   # Test user registration
   curl -X POST https://your-backend-domain.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"Password123","confirmPassword":"Password123"}'
   
   # Test user login
   curl -X POST https://your-backend-domain.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Password123"}'
   ```

3. **Record Management Testing**

   ```bash
   # Test record creation
   curl -X POST https://your-backend-domain.com/api/records \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"title":"Test Record","type":"lab-result","description":"Test description"}'
   ```

### Frontend Testing

1. **Load Testing**
   - Open the deployed application in a browser
   - Test page load times
   - Check for any console errors

2. **Functional Testing**
   - Test user registration and login
   - Test record creation and management
   - Test file upload functionality
   - Test responsive design on mobile devices

3. **Integration Testing**
   - Test complete user flows from registration to record management
   - Test error handling and validation
   - Test authentication and authorization

## 📊 Monitoring and Maintenance

### Backend Monitoring

1. **Set Up Logging**

   ```javascript
   // In server/index.js
   const winston = require('winston');
   
   const logger = winston.createLogger({
     level: 'info',
     format: winston.format.json(),
     transports: [
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' })
     ]
   });
   
   app.use((req, res, next) => {
     logger.info(`${req.method} ${req.path}`);
     next();
   });
   ```

2. **Set Up Error Tracking**
   - Sign up for [Sentry](https://sentry.io/)
   - Configure error tracking in your application

### Frontend Monitoring

1. **Set Up Error Tracking**

   ```javascript
   // In client/src/pages/_app.js
   import * as Sentry from '@sentry/nextjs';
   
   Sentry.init({
     dsn: 'your-sentry-dsn',
     environment: process.env.NODE_ENV
   });
   ```

2. **Set Up Performance Monitoring**
   - Sign up for [Vercel Analytics](https://vercel.com/analytics)
   - Configure analytics in your Vercel dashboard

## 🔄 CI/CD Pipeline

### GitHub Actions for Backend

```yaml
# .github/workflows/backend.yml
name: Backend CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Run linting
        run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          curl -X POST https://api.render.com/v1/services \
            -H "Authorization: Bearer ${{ secrets.RENDER_API_TOKEN }}" \
            -H "Content-Type: application/json" \
            -d '{"serviceId":"your-service-id"}'
```

### GitHub Actions for Frontend

```yaml
# .github/workflows/frontend.yml
name: Frontend CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Run linting
        run: npm run lint
      - name: Run type checking
        run: npm run type-check

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 🛠️ Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   - Check for syntax errors in code
   - Verify all dependencies are properly installed
   - Check for incompatible package versions

2. **Runtime Errors**
   - Check environment variables
   - Verify database connections
   - Check API endpoint configurations

3. **CORS Issues**
   - Verify frontend URL is in CORS whitelist
   - Check for preflight requests
   - Verify credentials are properly configured

4. **File Upload Issues**
   - Check file size limits
   - Verify file type restrictions
   - Check server disk space

5. **Authentication Issues**
   - Verify JWT secrets are properly configured
   - Check token expiration settings
   - Verify token is properly sent in headers

### Debugging Steps

1. **Check Application Logs**
   - Backend: Check server logs for errors
   - Frontend: Check browser console for errors
   - Database: Check MongoDB logs for connection issues

2. **Test API Endpoints Directly**
   - Use curl or Postman to test endpoints
   - Verify request/response formats
   - Check authentication headers

3. **Check Network Connectivity**
   - Verify DNS settings
   - Check firewall configurations
   - Test with different network conditions

## 📚 Additional Resources

### Documentation

- [Render Documentation](https://render.com/docs/)
- [Vercel Documentation](https://vercel.com/docs/)
- [Railway Documentation](https://docs.railway.app/)
- [Netlify Documentation](https://docs.netlify.com/)

### Deployment Tools

- [Docker](https://www.docker.com/) - Containerization
- [GitHub Actions](https://github.com/features/actions) - CI/CD
- [Terraform](https://www.terraform.io/) - Infrastructure as code

---

Remember: Deployment is not just about getting your code to production, it's about ensuring it runs reliably and securely in the production environment!
