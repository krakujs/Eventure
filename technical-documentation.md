# Eventure Project Comprehensive Documentation

## Overview

Eventure is a full-stack event management system consisting of three main components:
1. Java Backend (Eventure)
2. Node.js Chat System (node-chat-system)
3. React Frontend (eventure-frontend)

## 1. Java Backend (Eventure)

### Technology Stack:
- Java 17
- Spring Boot
- MongoDB
- Spring Security with JWT
- WebSocket for real-time updates

### Project Structure:

```
Eventure/
├── activity/           # Activity logging
├── base/               # Base classes and interfaces
├── chat/               # Chat functionality
├── chatroom/           # Chat room management
├── config/             # Application configurations
├── event/              # Event management
├── messageTemplate/    # Message templating
├── notification/       # Notification system
├── participant/        # Event participant management
├── permission/         # Role-based permissions
├── search/             # Search functionality
├── security/           # Authentication and authorization
├── task/               # Task management
└── user/               # User management
    └── dashboard/      # User dashboard
```

### Key Features:
- CRUD operations for events, tasks, and users
- Real-time notifications and updates
- Role-based access control
- Activity logging
- Chat functionality
- Search capabilities
- OAuth2 integration with Okta

### Main Components:
- Controllers: Handle HTTP requests
- Services: Implement business logic
- Repositories: Interface with MongoDB
- Entities: Define data structures
- DTOs: Data Transfer Objects for API responses
- WebSocket Configuration: For real-time features

## 2. Node.js Chat System (node-chat-system)

### Technology Stack:
- Node.js
- Express.js
- MongoDB
- WebSocket (ws library)

### Key Components:
- WebSocket Server: Handles real-time messaging
- Chat Message Model: Defines the structure for chat messages
- Chat Service: Manages message storage and retrieval

### Features:
- Real-time messaging between users
- Message persistence in MongoDB
- Integration with the main application for user authentication

## 3. React Frontend (eventure-frontend)

### Technology Stack:
- React
- TypeScript
- React Router for navigation
- Axios for API calls
- WebSocket for real-time updates
- CSS (likely Tailwind CSS)

### Project Structure:

```
eventure-frontend/
├── components/         # React components
├── contexts/           # React contexts for state management
├── hooks/              # Custom React hooks
├── services/           # API and WebSocket services
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Key Features:
- User authentication and authorization
- Event management (creation, viewing, editing)
- Real-time chat functionality
- User dashboard with activity overview
- Notifications system
- Admin panel for user management
- User profile management
- Real-time updates via WebSocket

### Main Components:
- App.tsx: Main application component
- AuthContext.tsx & NotificationContext.tsx: Global state management
- api.ts: Centralized API service
- WebSocket services: For real-time features
- Various React components for different views and functionalities

## Integration Points

1. **Backend to Frontend**: 
   - RESTful API calls for CRUD operations
   - WebSocket connection for real-time event updates and notifications

2. **Chat System to Frontend**:
   - WebSocket connection for real-time messaging

3. **Backend to Chat System**:
   - Shared user authentication
   - Possibly shared database for user and chat data

## Authentication Flow

1. User initiates login on the frontend (Landing.tsx)
2. OAuth2 authentication with Okta
3. Backend validates the OAuth token and issues a JWT
4. Frontend stores JWT and uses it for subsequent API calls to both Java backend and Node.js chat system

## Data Flow

1. User interacts with React frontend
2. Frontend makes API calls to Java backend for most operations
3. Real-time updates (notifications, chat messages) are pushed from backend to frontend via WebSocket
4. Chat messages are handled by the Node.js chat system, with real-time updates sent via WebSocket

## Deployment Considerations

- Java Backend: Deployable as a standalone JAR or in a container
- Node.js Chat System: Can be deployed on Node.js-compatible servers or containers
- React Frontend: Build as static files, deployable on any web server

## Security Considerations

- JWT-based authentication
- Role-based access control
- Secure WebSocket connections
- OAuth2 integration for user authentication
- HTTPS for all communications in production

## Scalability and Performance

- Stateless backend design allows for horizontal scaling
- WebSocket usage minimizes unnecessary polling
- MongoDB can be scaled horizontally for increased data load
- Consider implementing caching (e.g., Redis) for frequently accessed data

## Future Enhancements

- Implement more advanced event features (e.g., ticketing, analytics)
- Enhance chat system with features like file sharing and group chats
- Develop mobile app version using React Native
- Implement real-time collaborative features for event planning

This comprehensive documentation provides an overview of the entire Eventure system, detailing the structure, technologies, and key features of each component. It serves as a central reference for understanding the system architecture and the interactions between different parts of the application.