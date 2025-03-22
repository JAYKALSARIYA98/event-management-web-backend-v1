# Event Management System Backend

A backend API for an event management system that allows users to create, manage, and register for events.

## Features

- **User Authentication**: Register, login, and password reset functionality
- **User Roles**: Different roles including Student, Faculty, HOD, Principal, ISTE, IEEE, ETTC, and Admin
- **Student Profiles**: Students can create and manage their profiles with details like enrollment number, class, etc.
- **Event Management**: Create, update, delete, and view events
- **Event Registration**: Students can register for events after completing their profiles
- **Registration Management**: Event organizers can view registrations for their events
- **Live Capacity Counter**: Real-time tracking of available seats for each event
- **Registration Tracking**: Students can view all events they have registered for

## API Endpoints

### Authentication

- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/signin`: Login with email and password
- `POST /api/auth/forgot-password`: Request password reset
- `POST /api/auth/reset-password`: Reset password with OTP
- `GET /api/auth/whoami`: Get current user information

### Profile Management (Students Only)

- `POST /api/profile`: Create a student profile
- `GET /api/profile`: Get current user's profile
- `PUT /api/profile`: Update student profile
- `GET /api/profile/events`: Get all events registered by the current student

### Event Management

- `GET /api/events`: Get all events with capacity information
- `GET /api/events/:id`: Get a specific event with capacity information
- `POST /api/events`: Create a new event (requires event creator role)
- `PUT /api/events/:id`: Update an event (requires event creator role)
- `DELETE /api/events/:id`: Delete an event (requires event creator role)

### Event Registration

- `POST /api/events/:id/register`: Register for an event (students only, requires completed profile)
- `GET /api/events/:id/registrations`: Get all registrations for an event (event organizers only)
- `GET /api/events/user/registrations`: Get all events registered by the current user

### Admin Functions

- `POST /api/events/change-role`: Change a user's role (admin only)

## Student Profile Fields

Students must complete their profile before registering for events. The profile includes:

- Phone Number
- Enrollment Number
- Birthdate
- Class
- Year
- Semester

## Capacity Management

The system includes a live capacity counter for each event:
- Total seats are set when creating an event
- Available seats decrease by 1 when a student registers
- Events include capacity information in the response:
  - Total seats
  - Available seats
  - Filled seats
  - Percentage filled

## Setup and Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=your_frontend_url
   ```
4. Start the server: `npm start`

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Express Validator for input validation
