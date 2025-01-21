import axios from 'axios';
import {User, Task, Event,UserDashboardSummary,Participant,ChatMessage} from "../types"
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getCurrentUser = () => api.get('/users/me');
export const getAllUsers = () => api.get('/users');

export const getUserDashboardSummary = (userId: string) => 
    api.get<UserDashboardSummary>(`/user-dashboard/${userId}/summary`);

export const getEvents = () => api.get('/events');
export const createEvent = (eventData: Partial<Event>) => 
  api.post('/events', eventData);
export const getEventDetails = (eventId: string) => 
  api.get(`/events/${eventId}`);
export const getUser = (eventId: string) => 
  api.get<User>(`/users/${eventId}`);
export const updateEvent = (eventId: string, eventData: Partial<Event>) => 
  api.patch(`/events/${eventId}`, eventData);
export const deleteEvent = (eventId: string) => 
  api.delete(`/events/${eventId}`);



export const getTasks = (eventId: string) => 
  api.get(`/events/${eventId}/tasks`);
export const updateTask = (taskId: string, taskData: Partial<Task>) => 
  api.patch(`/tasks/${taskId}`, taskData);
export const deleteTask = (taskId: string) => 
  api.delete(`/tasks/${taskId}`);
export const updateTaskStatus = (taskId: string, status: string) =>
  api.patch(`/tasks/${taskId}`, { status });


export const getNotifications = () => api.get('/notifications');
export const markNotificationAsRead = (notificationId: string) => 
  api.patch(`/notifications/${notificationId}`, { read: true });

export const getUsers = () => api.get('/users');
export const updateUser = (userId: string, userData: Partial<User>) => 
  api.patch(`/users/${userId}`, userData);
export const deleteUser = (userId: string) => 
  api.delete(`/users/${userId}`);

  
  export const getEventTasks = (eventId: string) =>
    api.get<Task[]>(`/event/${eventId}/tasks`);
  
  export const createTask = (eventId: string, taskData: Partial<Task>) =>
    api.post<Task>(`/event/${eventId}/task`, taskData);
  
  export const getEventParticipants = (eventId: string) =>
    api.get<Participant[]>(`/event/${eventId}/participants`);
  
  export const addParticipant = (eventId: string, participantData: Partial<Participant>) =>
    api.post<Participant>(`/event/${eventId}/participant`, participantData);

  
  const API_URL = 'http://localhost:5000';

  export const getChatMessages = async (senderId: string, recipientId: string): Promise<ChatMessage[]> => {
    const response = await axios.get(`${API_URL}/messages/${senderId}/${recipientId}`);
    return response.data;
  };
  
  export const sendMessage = async (message: ChatMessage) => {
    await axios.post(`${API_URL}/sendMessage`, message);
  };
  
  