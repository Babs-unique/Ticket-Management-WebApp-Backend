# Ticket Management Backend

A simple backend server for managing support tickets and user accounts.

## What Does It Do?

This backend API helps you:
- Create and manage user accounts (register, login)
- Create tickets to report issues or tasks
- Search and filter tickets
- Update and delete tickets
- Manage user profile settings (picture, name, email, password)

---

## Setup Instructions

### 1. Install Node.js
Download and install from [nodejs.org](https://nodejs.org)

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
Create a `.env` file in the root folder:
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 4. Start the Server
```bash
npm run dev
```

The server will run at `http://localhost:3000`

---

## API Endpoints

### User Endpoints
- **Register**: `POST /api/users/register`
- **Login**: `POST /api/users/login`

### Ticket Endpoints (Need Login)
- **Create Ticket**: `POST /api/tickets/createTicket`
- **Get All Tickets**: `GET /api/tickets/getAllTickets`
- **Search Tickets**: `GET /api/tickets/search?q=search_word`
- **Filter by Status**: `GET /api/tickets/filterByStatus?status=open`
- **Update Ticket**: `PUT /api/tickets/update/:id`
- **Delete Ticket**: `DELETE /api/tickets/delete/:id`

### Settings Endpoints (Need Login)
- **Upload Profile Picture**: `PUT /api/settings/update/profileImg`
- **Update Profile Details**: `PUT /api/settings/update/profileDetails`
- **Change Password**: `PUT /api/settings/update/password`

---

## File Structure

```
src/
├── config/
│   └── db.js              → Database connection
├── controllers/           → Logic for handling requests
│   ├── user.controller.js
│   ├── ticket.controller.js
│   └── setting.controller.js
├── models/                → Database schemas
│   ├── user.models.js
│   └── ticket.models.js
├── routes/                → API routes
│   ├── user.routes.js
│   ├── ticket.routes.js
│   └── setting.routes.js
├── middleware/            → Authentication & error handling
│   ├── auth.js
│   └── errorhandler.js
└── utils/                 → Helper functions
    ├── multer.js          → File upload setup
    └── cloudinary.js      → Image storage
```

---

## Data Models

### User
- Name
- Email
- Password (encrypted)
- Profile Picture

### Ticket
- Title
- Description
- Status (open, in-progress, closed)
- Priority (easy, medium, hard)
- Ticket ID
- User (who created it)
- Created Date

---

## Important Features

✅ **Authentication**: Login required for most features  
✅ **Rate Limiting**: Protects against too many requests  
✅ **File Upload**: Upload profile pictures using Cloudinary  
✅ **Search**: Find tickets by title or description  
✅ **Soft Delete**: Deleted tickets are marked but not removed  
✅ **Password Encryption**: Passwords are hashed with bcryptjs  

---

## Common Errors & Fixes

### Error: "Cannot find module"
```bash
npm install
```

### Error: "MongoDB connection failed"
Check your `MONGODB_URI` in `.env` file

### Error: "Unauthorized"
Make sure you include the JWT token in the Authorization header:
```
Authorization: Bearer your_token_here
```

---

## Tech Stack

- **Node.js** - Server runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - Database library
- **JWT** - Authentication
- **bcryptjs** - Password encryption
- **Cloudinary** - Image storage
- **Multer** - File upload handling

---

## Development Commands

```bash
# Install dependencies
npm install

# Run in development mode (with auto-reload)
npm run dev

# Run normal mode
npm start
```

---

## Questions?

If you need help, check:
1. The `.env` file has all required values
2. MongoDB is running and connected
3. Node.js version is up to date
4. Port 3000 is not already in use
