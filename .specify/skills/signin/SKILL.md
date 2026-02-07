---
name: signin
description: Authenticate an existing user with Next.js frontend form, Better Auth JWT issuance, and FastAPI middleware verification. Use this skill whenever a user logs in to securely authenticate them and establish their session.
license: Complete terms in LICENSE.txt
---

# Sign-In Skill

This skill provides a complete authentication solution for user login functionality.

## Purpose

Authenticate an existing user when they attempt to log in to the application. This skill handles the complete authentication flow from user credential submission to session establishment.

## When to Use

Use this skill whenever a user needs to log in to the application. This includes:
- Traditional username/password login
- Social login flows
- Session restoration
- Authentication for protected routes

## Implementation Overview

The sign-in functionality is implemented using a combination of:
- Next.js frontend form for credential collection
- Better Auth for secure JWT token issuance
- FastAPI middleware for token verification

## Detailed Implementation

### 1. Next.js Frontend Form

Create a login form component in your Next.js application:

```jsx
// components/LoginForm.jsx
import { useState } from 'react';
import { signIn } from 'better-auth/client';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await signIn('credentials', {
        email,
        password,
        redirect: false
      });
      
      if (response?.error) {
        setError(response.error);
      } else {
        // Redirect to dashboard or previous page
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError('An error occurred during sign in');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <div className="error">{error}</div>}
      <button type="submit">Sign In</button>
    </form>
  );
};

export default LoginForm;
```

### 2. Better Auth JWT Issuance

Set up Better Auth in your Next.js application to handle authentication:

```javascript
// pages/api/auth/[...nextauth].js (or lib/auth.js for App Router)
import { auth } from 'better-auth';

export default auth({
  secret: process.env.AUTH_SECRET,
  database: {
    provider: 'postgresql', // or your preferred DB
    url: process.env.DATABASE_URL,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },
});
```

Configure your Next.js middleware to protect routes:

```javascript
// middleware.js
import { authMiddleware } from 'better-auth/client';

export default authMiddleware();

export const config = {
  matcher: ['/dashboard/:path*', '/api/auth/:path*', '/profile/:path*'],
};
```

### 3. FastAPI Middleware Verification

Create middleware in your FastAPI application to verify JWT tokens:

```python
# middleware/auth_middleware.py
from fastapi import HTTPException, Request
from fastapi.security.http import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from starlette.status import HTTP_401_UNAUTHORIZED, HTTP_403_FORBIDDEN
import os

# Configuration
SECRET_KEY = os.getenv("AUTH_SECRET")
ALGORITHM = "HS256"

security = HTTPBearer()

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=HTTP_403, detail="Could not validate credentials")
        return payload
    except JWTError:
        raise HTTPException(status_code=HTTP_403, detail="Could not validate credentials")

async def auth_middleware(request: Request):
    # Extract token from Authorization header
    credentials: HTTPAuthorizationCredentials = await security.__call__(request)
    
    if not credentials:
        raise HTTPException(
            status_code=HTTP_401, detail="Authentication required"
        )
    
    token = credentials.credentials
    user_payload = verify_token(token)
    
    # Add user info to request state
    request.state.user = user_payload
    return user_payload

# Example usage in a route
from fastapi import Depends

async def get_current_user(request: Request) = Depends(auth_middleware):
    return request.state.user

@app.get("/protected-route")
async def protected_endpoint(current_user: dict = Depends(get_current_user)):
    return {"message": f"Hello {current_user.get('email')}"}
```

## Environment Variables

Make sure to set the following environment variables:

```bash
# For Better Auth
AUTH_SECRET=your-super-secret-jwt-key-here
DATABASE_URL=your-database-url

# For social providers (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## Security Best Practices

- Always use HTTPS in production
- Store secrets securely using environment variables
- Implement rate limiting to prevent brute force attacks
- Use strong password requirements
- Implement multi-factor authentication for sensitive applications
- Regularly rotate JWT secrets
- Set appropriate token expiration times