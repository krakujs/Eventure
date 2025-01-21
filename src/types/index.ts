export interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'ORGANIZER' | 'PARTICIPANT' | 'GUEST';
  }
  
  export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    creatorId: string;
  }
  
  export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    status: string;
    assigneeId: string;
    eventId: string;
  }
  
  export interface Notification {
    id: string;
    message: string;
    createdAt: string;
    read: boolean;
    type: string;
  }

  export interface Activity {
    id: string;
    createdAt: string;
    description: string;
  }

  export interface UserDashboardSummary{
    upcomingEvents: Page<Event>;
    recentNotifications: Notification[];
    recentActivities: Page<Activity>;
  }

  export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
  }

  export interface Task {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    status: string;
    creatorId: string;
    eventId: string;
  }
  
  export interface Participant {
    id: string;
    userId: string;
    eventId: string;
    role: string;
  }
  

  export interface ChatMessage {
    id: string;
    senderId: string;
    recipientId: string;
    content: string;
  }