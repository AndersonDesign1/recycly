# Role Selection System

## Overview

The Recycly platform now includes a comprehensive role selection system that allows users to choose their role after completing signup and 2FA verification. This ensures that users understand their responsibilities and access levels before accessing the dashboard.

## How It Works

### 1. User Signup Flow

1. User signs up with email/password or Google OAuth
2. User verifies their email address
3. User completes 2FA verification
4. **NEW**: User is redirected to role selection page
5. User selects their role from available options
6. User is redirected to appropriate dashboard

### 2. User Signin Flow

1. User signs in with email/password or Google OAuth
2. If 2FA is required, user completes verification
3. **NEW**: System checks if user has a role assigned
4. If no role: redirect to role selection
5. If role exists: redirect to appropriate dashboard

## Available Roles

### 1. Individual Recycler (USER)

- **Description**: Recycle waste and earn rewards
- **Features**:
  - Deposit waste at collection points
  - Earn points and rewards
  - Track environmental impact
  - Level up and unlock achievements
  - Refer friends for bonuses
- **Benefits**:
  - Earn money for recycling
  - Environmental impact tracking
  - Loyalty program benefits
  - Community features
  - Educational resources

### 2. Waste Collection Supervisor (WASTE_MANAGER)

- **Description**: Manage collection operations and verify deposits
- **Features**:
  - Monitor collection routes
  - Verify waste deposits
  - Manage collection vehicles
  - Quality control oversight
  - Staff coordination
- **Benefits**:
  - Commission on collections
  - Performance bonuses
  - Operational insights
  - Team management tools
  - Professional development

### 3. Regional/Location Manager (ADMIN)

- **Description**: Manage regional operations and business development
- **Features**:
  - Regional analytics and reporting
  - Waste manager oversight
  - Pricing and incentive management
  - Partnership development
  - Staff management
- **Benefits**:
  - Revenue sharing
  - Performance bonuses
  - Business development opportunities
  - Strategic decision making
  - Leadership growth

### 4. System Administrator (SUPERADMIN)

- **Description**: Global system oversight and master controls
- **Features**:
  - Global user management
  - System health monitoring
  - Fraud detection and prevention
  - Revenue analytics
  - Commission management
- **Benefits**:
  - System-wide oversight
  - Strategic decision making
  - Revenue optimization
  - Security management
  - Executive insights

## Technical Implementation

### Database Changes

- Updated `User` model to allow `null` roles
- Removed default `USER` role assignment
- Users must explicitly select their role

### API Endpoints

- `POST /api/auth/update-role` - Update user role
- `GET /api/auth/session` - Get current session
- `POST /api/auth/sign-out` - Sign out user

### Components

- `SelectRolePage` - Main role selection interface
- Updated `DashboardPage` - Redirects users without roles
- Updated auth flows - Handle role-based redirects

### Auth Flow Updates

- Signup → Email verification → 2FA → Role selection → Dashboard
- Signin → 2FA (if required) → Role check → Role selection (if needed) → Dashboard

## Security Features

- Role selection only available to authenticated users
- Role updates require valid session
- Session invalidation after role update
- Input validation for role selection
- Protected routes based on role assignment

## User Experience

- **Beautiful Design**: Modern, responsive interface with role-specific colors
- **Clear Information**: Each role shows features and benefits
- **Easy Selection**: Click to select, visual feedback
- **Smooth Flow**: Seamless transition from auth to role selection
- **Role Flexibility**: Users can change roles later in settings

## Future Enhancements

- Role change functionality in user settings
- Role-based onboarding flows
- Role-specific welcome messages
- Role upgrade/downgrade workflows
- Role-based feature discovery

## Testing

To test the role selection system:

1. **New User Flow**:

   - Sign up with a new email
   - Complete email verification
   - Complete 2FA verification
   - Should be redirected to `/auth/select-role`
   - Select a role and verify redirect to dashboard

2. **Existing User Flow**:

   - Sign in with existing account
   - If no role: redirect to role selection
   - If role exists: redirect to dashboard

3. **Role Update**:
   - Use the role update API to change user roles
   - Verify session invalidation and re-authentication

## Troubleshooting

### Common Issues

- **Users stuck in role selection**: Check if role update API is working
- **Infinite redirects**: Verify role check logic in dashboard
- **Type errors**: Ensure proper typing for user objects with roles

### Debug Steps

1. Check browser console for errors
2. Verify database role field is nullable
3. Check API endpoint responses
4. Verify auth session data includes role information
