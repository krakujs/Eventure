import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { User } from '../types';
import { useAuth } from '../contexts/AuthContext';

const InputField: React.FC<{
  label: string;
  type: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}> = ({ label, type, id, name, value, onChange, required = false }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-gray-700 font-bold mb-2">{label}</label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      required={required}
    />
  </div>
);

const TextareaField: React.FC<{
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  rows?: number;
}> = ({ label, id, name, value, onChange, required = false, rows = 4 }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-gray-700 font-bold mb-2">{label}</label>
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      rows={rows}
      required={required}
    ></textarea>
  </div>
);

const SelectField: React.FC<{
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: User[];
  required?: boolean;
}> = ({ label, id, name, value, onChange, options, required = false }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-gray-700 font-bold mb-2">{label}</label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      required={required}
    >
      <option value="">Select a creator</option>
      {options.map(option => (
        <option key={option.id} value={option.id}>{option.name}</option>
      ))}
    </select>
  </div>
);

const EventCreation: React.FC = () => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    creatorId: '',
  });
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.getAllUsers();
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (user) {
      setEventData(prevData => ({
        ...prevData,
        creatorId: user.id
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.createEvent(eventData);
      navigate(`/events/${response.data.id}`);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Create New Event</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Title"
            type="text"
            id="title"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            required
          />
          <TextareaField
            label="Description"
            id="description"
            name="description"
            value={eventData.description}
            onChange={handleChange}
            required
          />
          <InputField
            label="Date"
            type="date"
            id="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            required
          />
          <InputField
            label="Location"
            type="text"
            id="location"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            required
          />
          <SelectField
            label="Creator"
            id="creatorId"
            name="creatorId"
            value={eventData.creatorId}
            onChange={handleChange}
            options={users}
            required
          />
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventCreation;
