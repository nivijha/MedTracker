# MedTracker Testing Guide

This guide provides comprehensive testing strategies for the MedTracker application to ensure quality and reliability.

## 🧪 Backend Testing

### 1. Unit Testing

#### Authentication Tests
```bash
# Test user registration
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Password123",
  "confirmPassword": "Password123"
}
```

```bash
# Test user login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Password123"
}
```

```bash
# Test password update
PUT http://localhost:5000/api/auth/updatepassword
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "Password123",
  "newPassword": "NewPassword123",
  "confirmNewPassword": "NewPassword123"
}
```

#### Medical Record Tests
```bash
# Test record creation
POST http://localhost:5000/api/records
Authorization: Bearer <token>
Content-Type: multipart/form-data

# Form data with file
```

```bash
# Test record retrieval
GET http://localhost:5000/api/records
Authorization: Bearer <token>
```

```bash
# Test record update
PUT http://localhost:5000/api/records/<record_id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Record",
  "description": "Updated description"
}
```

```bash
# Test record deletion
DELETE http://localhost:5000/api/records/<record_id>
Authorization: Bearer <token>
```

### 2. Integration Testing

#### Database Connection
```bash
# Test MongoDB connection
node -e "console.log('Testing DB connection...')" server/index.js
```

#### API Endpoint Testing
```bash
# Test health check endpoint
GET http://localhost:5000/api/health
```

### 3. Error Handling Tests

#### Authentication Errors
```bash
# Test invalid credentials
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "wrongpassword"
}
```

#### Authorization Errors
```bash
# Test protected route without token
GET http://localhost:5000/api/records
```

```bash
# Test protected route with invalid token
GET http://localhost:5000/api/records
Authorization: Bearer invalid_token
```

#### Validation Errors
```bash
# Test record creation with missing fields
POST http://localhost:5000/api/records
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Test description"
  // Missing title field
}
```

## 🌐 Frontend Testing

### 1. Component Testing

#### Authentication Components
```javascript
// Test Login component
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';

test('renders login form', () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  
  expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
  expect(screen.getByLabelText('Email address')).toBeInTheDocument();
  expect(screen.getByLabelText('Password')).toBeInTheDocument();
});

test('submits form with correct data', () => {
  const mockLogin = jest.fn();
  jest.mock('../context/AuthContext', () => ({
    useAuth: () => ({
      login: mockLogin
    })
  }));
  
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  
  fireEvent.change(screen.getByLabelText('Email address'), {
    target: { value: 'test@example.com' }
  });
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'password123' }
  });
  fireEvent.click(screen.getByText('Sign in'));
  
  expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
});
```

#### Dashboard Component
```javascript
// Test Dashboard component
import { render, screen } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';

test('displays user welcome message', () => {
  jest.mock('../context/AuthContext', () => ({
    useAuth: () => ({
      user: { name: 'Test User' }
    })
  }));
  
  render(<Dashboard />);
  
  expect(screen.getByText('Welcome back, Test User!')).toBeInTheDocument();
});
```

### 2. Integration Testing

#### Authentication Flow
```javascript
// Test complete authentication flow
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';

test('complete authentication flow', async () => {
  const mockLogin = jest.fn().mockResolvedValue({
    success: true,
    data: { user: { name: 'Test User' }, token: 'mock_token' }
  });
  
  jest.mock('../context/AuthContext', () => ({
    useAuth: () => ({
      login: mockLogin,
      isAuthenticated: false
    })
  }));
  
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
  
  // Fill and submit form
  fireEvent.change(screen.getByLabelText('Email address'), {
    target: { value: 'test@example.com' }
  });
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'password123' }
  });
  fireEvent.click(screen.getByText('Sign in'));
  
  // Wait for navigation to dashboard
  await waitFor(() => {
    expect(screen.getByText('Welcome back, Test User!')).toBeInTheDocument();
  });
});
```

### 3. End-to-End Testing

#### Record Management Flow
```javascript
// Test complete record management flow
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AddRecord from '../pages/AddRecord';
import Records from '../pages/Records';

test('complete record management flow', async () => {
  const mockCreateRecord = jest.fn().mockResolvedValue({
    success: true,
    data: { record: { _id: 'mock_id', title: 'Test Record' } }
  });
  
  const mockGetRecords = jest.fn().mockResolvedValue({
    success: true,
    data: { records: [{ _id: 'mock_id', title: 'Test Record' }] }
  });
  
  jest.mock('../services/api', () => ({
    recordsAPI: {
      createRecord: mockCreateRecord,
      getRecords: mockGetRecords
    }
  }));
  
  // Start at Add Record page
  const { history } = createMemoryHistory();
  render(
    <BrowserRouter history={history}>
      <AddRecord />
    </BrowserRouter>
  );
  
  // Fill and submit form
  fireEvent.change(screen.getByLabelText('Title'), {
    target: { value: 'Test Record' }
  });
  fireEvent.click(screen.getByText('Add Record'));
  
  // Wait for navigation to Records page
  await waitFor(() => {
    expect(history.location.pathname).toBe('/records');
  });
  
  // Navigate to Records page
  history.push('/records');
  render(
    <BrowserRouter history={history}>
      <Records />
    </BrowserRouter>
  );
  
  // Verify record appears in list
  await waitFor(() => {
    expect(screen.getByText('Test Record')).toBeInTheDocument();
  });
});
```

## 🔧 Debugging Guide

### 1. Common Issues & Solutions

#### Authentication Issues
- **Problem**: User stays logged in after token expires
- **Solution**: Implement token refresh mechanism or redirect to login on 401 errors

#### File Upload Issues
- **Problem**: Large files cause timeout
- **Solution**: Increase timeout limit and implement progress indicators

#### CORS Issues
- **Problem**: Frontend can't access backend API
- **Solution**: Ensure proper CORS configuration in backend

### 2. Debugging Tools

#### Backend Debugging
```javascript
// Add debugging middleware
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`${req.method} ${req.path}`, req.body);
  }
  next();
});
```

#### Frontend Debugging
```javascript
// Add debugging to API calls
const apiCall = async () => {
  try {
    console.log('Making API call...');
    const response = await api.get('/records');
    console.log('API response:', response);
    return response;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};
```

### 3. Performance Testing

#### Load Testing
```bash
# Install artillery for load testing
npm install -g artillery

# Create test configuration
# artillery-config.yml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 20
  payload:
    path: "/api/auth/login"
    method: "POST"
    data:
      email: "test@example.com"
      password: "password123"

# Run load test
artillery run artillery-config.yml
```

## 📋 Testing Checklist

### Backend Testing
- [ ] Unit tests for all controllers
- [ ] Integration tests for API endpoints
- [ ] Error handling tests
- [ ] Database connection tests
- [ ] File upload tests
- [ ] Authentication middleware tests
- [ ] Load testing for critical endpoints

### Frontend Testing
- [ ] Component unit tests
- [ ] Integration tests for user flows
- [ ] Form validation tests
- [ ] Navigation tests
- [ ] Error handling tests
- [ ] Loading state tests
- [ ] Responsive design tests

### End-to-End Testing
- [ ] Complete authentication flow
- [ ] Record creation and management flow
- [ ] File upload flow
- [ ] Profile update flow
- [ ] Error recovery flows

### Cross-Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

### Performance Testing
- [ ] Page load time tests
- [ ] API response time tests
- [ ] File upload performance tests
- [ ] Concurrent user tests

## 🚀 Deployment Testing

### Staging Environment
- [ ] Deploy to staging environment
- [ ] Test all critical user flows
- [ ] Verify database migrations
- [ ] Test file upload functionality
- [ ] Test email notifications

### Production Environment
- [ ] Smoke tests for all major features
- [ ] Regression tests for recent changes
- [ ] Performance monitoring setup
- [ ] Error tracking setup
- [ ] User acceptance testing

## 📊 Test Reporting

### Test Coverage
- [ ] Backend: Aim for >80% code coverage
- [ ] Frontend: Aim for >70% component coverage
- [ ] Generate coverage reports
- [ ] Set up coverage badges in README

### Bug Tracking
- [ ] Set up issue tracking system
- [ ] Create bug report templates
- [ ] Define severity levels
- [ ] Establish bug fix workflow

### Test Documentation
- [ ] Document test cases
- [ ] Create test data fixtures
- [ ] Write test execution guides
- [ ] Document debugging procedures

## 🔍 Security Testing

### Authentication Security
- [ ] Test SQL injection attempts
- [ ] Test XSS vulnerabilities
- [ ] Test CSRF protection
- [ ] Test password strength requirements
- [ ] Test session management
- [ ] Test rate limiting

### Data Security
- [ ] Test file upload restrictions
- [ ] Test data access controls
- [ ] Test data encryption
- [ ] Test audit logging
- [ ] Test data retention policies

### API Security
- [ ] Test API rate limiting
- [ ] Test input validation
- [ ] Test error message sanitization
- [ ] Test authentication bypass attempts
- [ ] Test authorization checks

## 📝 Test Automation

### Continuous Integration
- [ ] Set up GitHub Actions for automated testing
- [ ] Configure test runners
- [ ] Set up test databases
- [ ] Configure test environments
- [ ] Set up test reporting

### Test Scheduling
- [ ] Schedule daily regression tests
- [ ] Schedule weekly performance tests
- [ ] Schedule monthly security scans
- [ ] Schedule pre-deployment tests

## 🐛 Troubleshooting

### Common Issues
1. **Authentication failures**
   - Check token format
   - Verify CORS configuration
   - Check API endpoint URLs

2. **File upload failures**
   - Check file size limits
   - Check file type restrictions
   - Check server disk space

3. **Database connection errors**
   - Check connection string
   - Verify network connectivity
   - Check database server status

4. **Frontend rendering issues**
   - Check console for errors
   - Verify component props
   - Check CSS conflicts

### Debugging Steps
1. Identify the specific issue
2. Reproduce the issue consistently
3. Check logs for error messages
4. Isolate the problematic component
5. Test with minimal data
6. Verify fix with comprehensive testing

## 📚 Resources

### Testing Tools
- [Jest](https://jestjs.io/) - JavaScript testing framework
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - React component testing
- [Postman](https://www.postman.com/) - API testing
- [Artillery](https://artillery.io/) - Load testing
- [BrowserStack](https://www.browserstack.com/) - Cross-browser testing
- [Sentry](https://sentry.io/) - Error tracking

### Documentation
- [Testing Best Practices](https://martinfowler.com/articles/testing.html)
- [JavaScript Testing Style Guide](https://github.com/airbnb/javascript)
- [React Testing Documentation](https://reactjs.org/docs/testing.html)

---

Remember: Testing is not just about finding bugs, it's about ensuring quality, reliability, and user satisfaction. Make testing an integral part of your development process!