import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Event, Task, Participant, User } from '../types';
import * as api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { connectWebSocket, disconnectWebSocket, sendEventUpdate } from '../services/websocket';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantCount, setParticipantCount] = useState<number>(0);
  const [users, setUsers] = useState<User[]>([]);
  const [newTask, setNewTask] = useState<Partial<Task>>({ 
    title: '', 
    description: '', 
    dueDate: '', 
    status: 'TODO',
    creatorId: ''
  });
  const [newParticipant, setNewParticipant] = useState<Partial<Participant>>({ userId: '', role: 'ATTENDEE' });
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventData = async () => {
      if (id) {
        setLoading(true);
        setErrors({});

        const fetchData = async (apiCall: () => Promise<any>, setter: (data: any) => void, errorKey: string) => {
          try {
            const response = await apiCall();
            setter(response.data);
          } catch (error) {
            console.error(`Error fetching ${errorKey}:`, error);
            setErrors(prev => ({ ...prev, [errorKey]: `Failed to load ${errorKey}. Please try again later.` }));
          }
        };

        await Promise.all([
          fetchData(() => api.getEventDetails(id), (data) => {
            setEvent(data);
            setParticipantCount(data.participantCount);  
          }, 'event'),
          fetchData(() => api.getEventTasks(id), setTasks, 'tasks'),
          fetchData(() => api.getEventParticipants(id), setParticipants, 'participants'),
          fetchData(() => api.getAllUsers(), setUsers, 'users')
        ]);

        setLoading(false);
      }
    };

    fetchEventData();

    if (user) {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        connectWebSocket(token, user.id, handleWebSocketMessage);
      }
    }

    return () => {
      disconnectWebSocket();
    };
  }, [id, user]);

  const handleWebSocketMessage = (message: any) => {
    if (message.type === 'EVENT_UPDATE' && message.eventId === id) {
      switch (message.updateType) {
        case 'PARTICIPANT_COUNT':
          setParticipantCount(message.data.participantCount);
          break;
        case 'TASK_UPDATE':
          setTasks(prevTasks => prevTasks.map(task => 
            task.id === message.data.taskId ? { ...task, ...message.data } : task
          ));
          break;
      }
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (event) {
      try {
        const response = await api.createTask(event.id, newTask);
        setTasks([...tasks, response.data]);
        setNewTask({ 
          title: '', 
          description: '', 
          dueDate: '', 
          status: 'TODO',
          creatorId: ''
        });
        sendEventUpdate(event.id, 'TASK_UPDATE', response.data);
      } catch (error) {
        console.error('Error creating task:', error);
        alert('Failed to create task. Please try again.');
      }
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const response = await api.updateTaskStatus(taskId, newStatus);
      const updatedTask = response.data;
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? updatedTask : task
        )
      );
      sendEventUpdate(event!.id, 'TASK_UPDATE', updatedTask);
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status. Please try again.');
    }
  };

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (event) {
      try {
        const response = await api.addParticipant(event.id, newParticipant);
        setParticipants([...participants, response.data]);
        setNewParticipant({ userId: '', role: 'ATTENDEE' });
        setParticipantCount(participantCount + 1);
        sendEventUpdate(event.id, 'PARTICIPANT_COUNT', { participantCount: participantCount + 1 });
      } catch (error) {
        console.error('Error adding participant:', error);
        alert('Failed to add participant. Please try again.');
      }
    }
  };

  const handleChatClick = (recipientId: string) => {
    if (user) {
      navigate(`/chat/${recipientId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-xl font-bold">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-xl font-bold">Event not found or failed to load.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-4xl font-bold mb-8">{event.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
          <div className="bg-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Description:</strong> {event.description}</p>
            <p><strong>Participants:</strong> {participantCount}</p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
          {errors.tasks && <p className="text-red-500">{errors.tasks}</p>}
          {!errors.tasks && tasks.length === 0 && <p>No tasks yet.</p>}
          {tasks.length > 0 && (
            <ul className="space-y-4">
              {tasks.map(task => (
                <li key={task.id} className="bg-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                  <strong>{task.title}</strong> - {task.status}
                  <br />
                  <small>Created by: {users.find(u => u.id === task.creatorId)?.name || 'Unknown'}</small>
                  <select
                    value={task.status}
                    onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                    className="ml-2 p-1 border rounded transition-colors duration-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </li>
              ))}
            </ul>
          )}
          {user?.id === event.creatorId && (
            <form onSubmit={handleCreateTask} className="mt-4 space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task Title"
                  className="flex-grow border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <input
                type="text"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Description"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newTask.creatorId}
                onChange={(e) => setNewTask({ ...newTask, creatorId: e.target.value })}
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Creator</option>
                {participants.map(participant => (
                  <option key={participant.id} value={participant.userId}>
                    {users.find(u => u.id === participant.userId)?.name || participant.userId}
                  </option>
                ))}
              </select>
              <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
                Create Task
              </button>
            </form>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Participants</h2>
          {errors.participants && <p className="text-red-500">{errors.participants}</p>}
          {!errors.participants && participants.length === 0 && <p>No participants yet.</p>}
          {participants.length > 0 && (
            <ul className="space-y-4">
              {participants.map(participant => (
                <li key={participant.id} className="bg-white p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
                  <span className="font-semibold">{users.find(u => u.id === participant.userId)?.name || 'Unknown'}</span>
                  <span className="text-gray-600"> ({participant.role})</span>
                  {user?.id !== participant.userId && (
                    <button onClick={() => handleChatClick(participant.userId)} className="ml-2 text-blue-500 hover:text-blue-700 transition-colors duration-200">
                      Chat
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          {user?.id === event.creatorId && (
            <form onSubmit={handleAddParticipant} className="mt-4 space-y-4">
              <select
                value={newParticipant.userId}
                onChange={(e) => setNewParticipant({ ...newParticipant, userId: e.target.value })}
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select User</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <select
                value={newParticipant.role}
                onChange={(e) => setNewParticipant({ ...newParticipant, role: e.target.value })}
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="ATTENDEE">Attendee</option>
                <option value="ORGANIZER">Organizer</option>
              </select>
              <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
                Add Participant
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
