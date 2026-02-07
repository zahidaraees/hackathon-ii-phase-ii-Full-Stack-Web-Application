---
name: signup
description: Register a new user in the Todo app using Next.js frontend form, Better Auth integration, and FastAPI route. Use this skill whenever a new user wants to create an account, with Claude code orchestrating validation, security checks, and workflow automation.
license: Complete terms in LICENSE.txt
---

# Signup Skill

This skill provides functionality to register new users in the Todo app.

## Purpose

Register a new user in the Todo app when they want to create an account. This skill handles the complete user registration flow from form submission to account creation.

## When to Use

Use this skill whenever a new user wants to create an account in the Todo app. This includes:
- New user registration flows
- Account creation with email verification
- Social login integration (if enabled)
- Profile setup during registration
- Welcome workflow automation

## Implementation Overview

The signup functionality is implemented using:
- Next.js frontend form for user registration
- Better Auth integration for secure authentication
- FastAPI route for backend processing
- Claude code for validation, security checks, and workflow automation

## Detailed Implementation

### 1. Next.js Signup Form Component

Create a signup form component in your Next.js application:

```jsx
// components/SignupForm.jsx
import { useState } from 'react';
import { signUp } from 'better-auth/client';

const SignupForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setGeneralError('');

    try {
      // Call Better Auth signup
      const response = await signUp('email', {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        redirect: false
      });

      if (response?.error) {
        setGeneralError(response.error.message || 'An error occurred during signup');
      } else {
        // Registration successful
        onSuccess && onSuccess(response);
      }
    } catch (error) {
      setGeneralError('An unexpected error occurred. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.firstName ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        />
        {errors.firstName && (
          <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
        )}
      </div>

      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.lastName ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        />
        {errors.lastName && (
          <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${
            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
        )}
      </div>

      {generalError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{generalError}</div>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isSubmitting 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          {isSubmitting ? 'Creating Account...' : 'Sign Up'}
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
```

### 2. Better Auth Configuration

Set up Better Auth in your Next.js application:

```javascript
// pages/api/auth/[...auth].js (or lib/auth.js for App Router)
import { auth } from 'better-auth';

export default auth({
  secret: process.env.AUTH_SECRET,
  database: {
    provider: 'postgresql', // or your preferred DB
    url: process.env.DATABASE_URL,
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true, // Enable email verification
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
  callbacks: {
    signIn: {
      async emailVerification(user) {
        // Called when a user signs up and needs to verify their email
        console.log(`Email verification requested for user: ${user.email}`);
        // You can customize the email verification process here
        return true;
      },
      async afterSignUp(user) {
        // Called after a user successfully signs up
        console.log(`New user registered: ${user.email}`);
        
        // Trigger Claude code for workflow automation
        await triggerSignupWorkflow(user);
        
        return true;
      }
    }
  }
});

// Function to trigger signup workflow
async function triggerSignupWorkflow(user) {
  // This would typically call a service to handle post-signup actions
  // such as sending welcome emails, creating user profiles, etc.
  console.log(`Triggering signup workflow for user: ${user.email}`);
  
  // Example: Call a service to handle post-signup actions
  try {
    await fetch('/api/signup-workflow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }),
    });
  } catch (error) {
    console.error('Error triggering signup workflow:', error);
  }
}
```

### 3. FastAPI Backend Route

Create a FastAPI route for handling signup-related backend operations:

```python
# api/v1/endpoints/auth.py
from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime
import re
from utils.security import hash_password, verify_password_strength
from utils.email_service import send_welcome_email, send_verification_email
from utils.workflow_orchestrator import trigger_post_signup_workflow
from models.user import User, UserCreate, UserPublic
from database import get_session
from sqlmodel import Session, select

router = APIRouter(prefix="/auth", tags=["auth"])

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        return v

class SignupResponse(BaseModel):
    user_id: str
    email: str
    first_name: str
    last_name: str
    created_at: datetime
    message: str

@router.post("/signup", response_model=SignupResponse)
async def signup(
    request: SignupRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_session)
) -> SignupResponse:
    """
    Register a new user in the Todo app.
    
    Args:
        request: Signup request with user details
        background_tasks: FastAPI background tasks for async operations
        db: Database session dependency
    
    Returns:
        Signup response with user details
    """
    try:
        # Claude-enhanced validation and security checks
        from utils.signup_validator import validate_signup_request
        validation_result = validate_signup_request(request)
        
        if not validation_result.is_valid:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid signup request: {validation_result.errors}"
            )
        
        # Check if user already exists
        existing_user = db.exec(select(User).where(User.email == request.email)).first()
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="A user with this email already exists"
            )
        
        # Hash the password
        hashed_password = hash_password(request.password)
        
        # Create the user
        user = User(
            email=request.email,
            password_hash=hashed_password,
            first_name=request.first_name,
            last_name=request.last_name,
            is_verified=False,  # Will be verified via email
            created_at=datetime.utcnow()
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        # Send verification email in the background
        background_tasks.add_task(send_verification_email, user.email, user.id)
        
        # Trigger post-signup workflow in the background
        background_tasks.add_task(trigger_post_signup_workflow, user.id)
        
        return SignupResponse(
            user_id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            created_at=user.created_at,
            message="Account created successfully. Please check your email to verify your account."
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error during signup: {str(e)}")
```

### 4. Claude Code for Validation, Security Checks, and Workflow Automation

The following Claude-enhanced code provides validation, security checks, and workflow automation:

```python
# utils/signup_validator.py
from typing import NamedTuple, List
from pydantic import EmailStr
import re
from datetime import datetime

class ValidationResult(NamedTuple):
    is_valid: bool
    errors: List[str]

class SignupValidator:
    def __init__(self):
        self.forbidden_domains = [
            'tempmail.com', '10minutemail.com', 'guerrillamail.com',
            'throwawaymail.com', 'mailinator.com'
        ]
        self.suspicious_patterns = [
            r'(admin|root|test)',  # Suspicious usernames
            r'(password|123456)',  # Common passwords
        ]

    def validate_signup_request(self, request) -> ValidationResult:
        """
        Claude-enhanced validation for signup requests.
        
        Args:
            request: Signup request object with email, password, etc.
        
        Returns:
            ValidationResult with validity and error list
        """
        errors = []
        
        # Email validation
        email_domain = request.email.split('@')[1].lower()
        if email_domain in self.forbidden_domains:
            errors.append("Email domain not allowed. Please use a permanent email address.")
        
        # Password strength validation
        password_errors = self._validate_password_strength(request.password)
        errors.extend(password_errors)
        
        # Name validation
        name_errors = self._validate_names(request.first_name, request.last_name)
        errors.extend(name_errors)
        
        # Check for suspicious patterns
        if any(re.search(pattern, request.email, re.IGNORECASE) for pattern in self.suspicious_patterns):
            errors.append("Email contains suspicious patterns")
        
        if any(re.search(pattern, request.password, re.IGNORECASE) for pattern in self.suspicious_patterns):
            errors.append("Password contains common weak patterns")
        
        # Check for potential impersonation
        impersonation_errors = self._check_impersonation_risks(request.first_name, request.last_name)
        errors.extend(impersonation_errors)
        
        return ValidationResult(is_valid=len(errors) == 0, errors=errors)

    def _validate_password_strength(self, password: str) -> List[str]:
        """
        Validate password strength with Claude-enhanced checks.
        
        Args:
            password: Password to validate
        
        Returns:
            List of validation errors
        """
        errors = []
        
        # Standard checks
        if len(password) < 8:
            errors.append("Password must be at least 8 characters")
        
        if not re.search(r'[A-Z]', password):
            errors.append("Password must contain at least one uppercase letter")
        
        if not re.search(r'[a-z]', password):
            errors.append("Password must contain at least one lowercase letter")
        
        if not re.search(r'\d', password):
            errors.append("Password must contain at least one digit")
        
        # Claude-enhanced checks
        # Check for common patterns
        common_patterns = [
            r'(.)\1{2,}',  # Repeated characters (aaa, 111)
            r'(012|123|234|345|456|567|678|789|890)',  # Sequential numbers
            r'(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)',  # Sequential letters
        ]
        
        for pattern in common_patterns:
            if re.search(pattern, password, re.IGNORECASE):
                errors.append("Password contains common predictable patterns")
                break
        
        # Check against common passwords
        common_passwords = [
            'password', 'password123', 'letmein', 'welcome', 'monkey', 
            '123456', '123456789', 'qwerty', 'abc123', 'admin'
        ]
        
        if password.lower() in common_passwords:
            errors.append("Password is too common and easily guessable")
        
        return errors

    def _validate_names(self, first_name: str, last_name: str) -> List[str]:
        """
        Validate names with Claude-enhanced checks.
        
        Args:
            first_name: User's first name
            last_name: User's last name
        
        Returns:
            List of validation errors
        """
        errors = []
        
        # Length checks
        if len(first_name.strip()) < 2:
            errors.append("First name must be at least 2 characters")
        
        if len(last_name.strip()) < 2:
            errors.append("Last name must be at least 2 characters")
        
        # Character checks
        name_pattern = r'^[a-zA-Z\s\'-]+$'  # Allow letters, spaces, apostrophes, hyphens
        if not re.match(name_pattern, first_name):
            errors.append("First name contains invalid characters")
        
        if not re.match(name_pattern, last_name):
            errors.append("Last name contains invalid characters")
        
        return errors

    def _check_impersonation_risks(self, first_name: str, last_name: str) -> List[str]:
        """
        Check for potential impersonation risks.
        
        Args:
            first_name: User's first name
            last_name: User's last name
        
        Returns:
            List of impersonation risk warnings
        """
        errors = []
        
        # Check against known admin/service names
        admin_names = [
            'admin', 'administrator', 'moderator', 'support', 
            'service', 'system', 'root', 'webmaster'
        ]
        
        full_name = f"{first_name} {last_name}".lower()
        for admin_name in admin_names:
            if admin_name in full_name:
                errors.append(f"Name '{full_name}' may be confused with administrative accounts")
        
        return errors


# Global instance
signup_validator = SignupValidator()

def validate_signup_request(request) -> ValidationResult:
    """
    Convenience function to validate signup requests.
    
    Args:
        request: Signup request object
    
    Returns:
        ValidationResult with validity and error list
    """
    return signup_validator.validate_signup_request(request)
```

```python
# utils/workflow_orchestrator.py
from typing import Dict, Any
from datetime import datetime
import asyncio
import logging

logger = logging.getLogger(__name__)

class WorkflowOrchestrator:
    def __init__(self):
        self.workflows = {
            'post_signup': self._execute_post_signup_workflow,
            'welcome_sequence': self._execute_welcome_sequence,
            'profile_setup': self._execute_profile_setup
        }

    async def trigger_workflow(self, workflow_name: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Claude-enhanced workflow orchestration.
        
        Args:
            workflow_name: Name of the workflow to trigger
            context: Contextual information for the workflow
        
        Returns:
            Dictionary with workflow execution results
        """
        if workflow_name not in self.workflows:
            raise ValueError(f"Unknown workflow: {workflow_name}")
        
        logger.info(f"Triggering workflow: {workflow_name} with context: {context}")
        
        try:
            # Execute the workflow
            result = await self.workflows[workflow_name](context)
            
            # Log successful execution
            logger.info(f"Workflow {workflow_name} completed successfully")
            
            return {
                "workflow": workflow_name,
                "status": "completed",
                "result": result,
                "timestamp": datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Error executing workflow {workflow_name}: {str(e)}")
            
            return {
                "workflow": workflow_name,
                "status": "failed",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }

    async def _execute_post_signup_workflow(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the post-signup workflow.
        
        Args:
            context: Contextual information including user details
        
        Returns:
            Dictionary with workflow execution results
        """
        user_id = context.get('user_id')
        email = context.get('email')
        
        # Create user profile
        await self._create_user_profile(user_id)
        
        # Send welcome email
        await self._send_welcome_email(email)
        
        # Add to mailing list
        await self._add_to_mailing_list(email)
        
        # Create initial tasks
        await self._create_initial_tasks(user_id)
        
        return {
            "user_profile_created": True,
            "welcome_email_sent": True,
            "added_to_mailing_list": True,
            "initial_tasks_created": True
        }

    async def _execute_welcome_sequence(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the welcome sequence workflow.
        
        Args:
            context: Contextual information including user details
        
        Returns:
            Dictionary with workflow execution results
        """
        user_id = context.get('user_id')
        email = context.get('email')
        
        # Send day 1 welcome email
        await self._send_welcome_email_day_1(email)
        
        # Schedule day 3 follow-up
        await self._schedule_follow_up_email(user_id, day=3)
        
        # Schedule day 7 feature highlight
        await self._schedule_feature_highlight(user_id, day=7)
        
        return {
            "day_1_email_sent": True,
            "follow_up_scheduled": True,
            "feature_highlight_scheduled": True
        }

    async def _execute_profile_setup(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute the profile setup workflow.
        
        Args:
            context: Contextual information including user details
        
        Returns:
            Dictionary with workflow execution results
        """
        user_id = context.get('user_id')
        
        # Create default settings
        await self._create_default_settings(user_id)
        
        # Create default task categories
        await self._create_default_categories(user_id)
        
        # Set up notification preferences
        await self._setup_notifications(user_id)
        
        return {
            "default_settings_created": True,
            "default_categories_created": True,
            "notifications_setup": True
        }

    # Helper methods for workflow steps
    async def _create_user_profile(self, user_id: str):
        """Create a user profile after signup."""
        # Implementation would create a user profile in the database
        logger.info(f"Creating user profile for user_id: {user_id}")
        await asyncio.sleep(0.1)  # Simulate async operation

    async def _send_welcome_email(self, email: str):
        """Send a welcome email to the new user."""
        # Implementation would send an email
        logger.info(f"Sending welcome email to: {email}")
        await asyncio.sleep(0.1)  # Simulate async operation

    async def _add_to_mailing_list(self, email: str):
        """Add the user to the mailing list."""
        # Implementation would add to mailing list service
        logger.info(f"Adding {email} to mailing list")
        await asyncio.sleep(0.1)  # Simulate async operation

    async def _create_initial_tasks(self, user_id: str):
        """Create initial tasks for the new user."""
        # Implementation would create starter tasks
        logger.info(f"Creating initial tasks for user_id: {user_id}")
        await asyncio.sleep(0.1)  # Simulate async operation

    async def _send_welcome_email_day_1(self, email: str):
        """Send day 1 welcome email."""
        logger.info(f"Sending day 1 welcome email to: {email}")
        await asyncio.sleep(0.1)  # Simulate async operation

    async def _schedule_follow_up_email(self, user_id: str, day: int):
        """Schedule a follow-up email."""
        logger.info(f"Scheduling follow-up email for user_id: {user_id} on day {day}")
        await asyncio.sleep(0.1)  # Simulate async operation

    async def _schedule_feature_highlight(self, user_id: str, day: int):
        """Schedule a feature highlight email."""
        logger.info(f"Scheduling feature highlight for user_id: {user_id} on day {day}")
        await asyncio.sleep(0.1)  # Simulate async operation

    async def _create_default_settings(self, user_id: str):
        """Create default settings for the user."""
        logger.info(f"Creating default settings for user_id: {user_id}")
        await asyncio.sleep(0.1)  # Simulate async operation

    async def _create_default_categories(self, user_id: str):
        """Create default task categories for the user."""
        logger.info(f"Creating default categories for user_id: {user_id}")
        await asyncio.sleep(0.1)  # Simulate async operation

    async def _setup_notifications(self, user_id: str):
        """Set up notification preferences for the user."""
        logger.info(f"Setting up notifications for user_id: {user_id}")
        await asyncio.sleep(0.1)  # Simulate async operation


# Global instance
workflow_orchestrator = WorkflowOrchestrator()

async def trigger_post_signup_workflow(user_id: str):
    """
    Trigger the post-signup workflow.
    
    Args:
        user_id: ID of the newly signed-up user
    """
    context = {"user_id": user_id}
    await workflow_orchestrator.trigger_workflow('post_signup', context)
```

### 5. Using the Signup Components

Here's how to use the signup components in your application:

```jsx
// pages/signup.jsx
import { useState } from 'react';
import SignupForm from '../components/SignupForm';
import { useRouter } from 'next/router';

const SignupPage = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleSignupSuccess = (response) => {
    setSuccessMessage('Account created successfully! Please check your email to verify your account.');
    
    // Optionally redirect after a delay
    setTimeout(() => {
      router.push('/verify-email'); // Redirect to email verification page
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your Todo app account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </a>
          </p>
        </div>
        
        {successMessage ? (
          <div className="rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-700">{successMessage}</div>
          </div>
        ) : (
          <SignupForm onSuccess={handleSignupSuccess} />
        )}
      </div>
    </div>
  );
};

export default SignupPage;
```

## Additional Features

The implementation includes:
- Comprehensive signup form with validation
- Better Auth integration for secure authentication
- FastAPI backend route with security checks
- Claude-enhanced validation and security checks
- Post-signup workflow automation
- Email verification process
- Password strength validation
- Background task processing

## Security Considerations

- Implement proper password hashing using bcrypt or similar
- Validate all user inputs to prevent injection attacks
- Use HTTPS to encrypt all communications
- Implement rate limiting for signup attempts
- Verify email addresses before allowing full access
- Sanitize and validate all data stored in the database
- Implement proper session management
- Use secure cookies for authentication
- Regularly update dependencies to address security vulnerabilities