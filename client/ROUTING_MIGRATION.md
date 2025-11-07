# Next.js App Router Migration Guide

This document explains the migration from React Router to Next.js App Router file system based routing.

## Overview

The MedTracker client has been migrated from React Router to Next.js App Router, which provides:

- File system based routing
- Server-side route protection via middleware
- Improved performance with automatic code splitting
- Better SEO and loading states

## Directory Structure

```
src/app/
├── (auth)/                    # Route group for public auth routes
│   ├── layout.jsx           # Layout for auth routes
│   ├── login/
│   │   └── page.jsx       # Login page at /login
│   └── signup/
│       └── page.jsx       # Signup page at /signup
├── (dashboard)/               # Route group for protected routes
│   ├── layout.jsx           # Layout for dashboard routes (includes sidebar, header)
│   ├── dashboard/
│   │   └── page.jsx       # Dashboard page at /dashboard
│   ├── records/
│   │   ├── page.jsx       # Records list at /records
│   │   ├── add/
│   │   │   └── page.jsx   # Add record at /records/add
│   │   └── [id]/
│   │       └── page.jsx   # Record detail at /records/[id]
│   ├── profile/
│   │   └── page.jsx       # Profile page at /profile
│   └── report/
│       └── page.jsx       # Reports page at /report
├── layout.jsx                 # Root layout
├── page.jsx                  # Root page (redirects based on auth)
└── middleware.js              # Authentication middleware
```

## Route Groups

### `(auth)` Route Group
- Contains public routes that don't require authentication
- Routes: `/login`, `/signup`
- Has its own layout with minimal styling

### `(dashboard)` Route Group
- Contains protected routes that require authentication
- Routes: `/dashboard`, `/records/*`, `/profile`, `/report`
- Includes sidebar navigation and header with user info
- Protected by middleware

## Authentication

### Middleware
- Located at `src/middleware.js`
- Checks for JWT token in cookies
- Redirects unauthenticated users from protected routes to `/login`
- Redirects authenticated users from auth routes to `/dashboard`
- Handles root path `/` redirection

### Token Management
- JWT token stored in cookies as `medtracker_token`
- Token automatically included in API requests via axios interceptors
- Server-side validation in middleware

## Key Changes from React Router

### Navigation Components
- `Link` from `react-router-dom` → `Link` from `next/link`
- `useNavigate` → `useRouter` from `next/navigation`
- `useLocation` → `usePathname` from `next/navigation`
- `NavLink` → Custom implementation with `usePathname`

### Route Parameters
- Dynamic routes use brackets: `[id]` instead of `:id`
- Access params with `useParams()` hook
- Example: `/records/[id]/page.jsx`

### Layouts
- Nested layouts automatically applied to route groups
- No need for `<Outlet>` component
- Layouts wrap their children automatically

### Code Splitting
- Automatic code splitting by route
- Improved performance with lazy loading
- No manual import required

## Benefits

1. **Performance**: Automatic code splitting and lazy loading
2. **SEO**: Better server-side rendering and meta tags
3. **Security**: Server-side route protection
4. **Developer Experience**: File system based routing is intuitive
5. **Bundle Size**: Smaller bundles due to automatic splitting

## Migration Notes

1. All React Router dependencies have been removed
2. Components updated to use Next.js routing
3. Authentication now handled by middleware
4. Layouts simplified with automatic nesting
5. Route parameters follow Next.js conventions

## Testing

To test the new routing:

1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Test authentication flow:
   - Visit `/` → redirects to `/login` or `/dashboard`
   - Login → redirects to `/dashboard`
   - Logout → redirects to `/login`
4. Test protected routes:
   - Try accessing `/dashboard` without token → redirects to `/login`
   - Access with valid token → loads protected route

## Troubleshooting

### Common Issues

1. **Middleware not working**
   - Ensure `middleware.js` is in `src/` directory
   - Check matcher configuration in middleware

2. **Route not found**
   - Verify file structure matches route
   - Check for correct `page.jsx` filenames

3. **Authentication issues**
   - Check token cookie name: `medtracker_token`
   - Verify API base URL in environment variables

4. **Navigation not working**
   - Ensure using `Link` from `next/link`
   - Check for correct `href` props

## Future Enhancements

1. **Loading UI**: Implement loading.js files for route groups
2. **Error Handling**: Add error.js files for error boundaries
3. **Metadata**: Add metadata to pages for better SEO
4. **API Routes**: Move API calls to Next.js API routes