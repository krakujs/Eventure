import React, { useState, useEffect } from 'react';
import { User } from '../types';
import * as api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission, PERMISSIONS } from '../utils/permissions';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (user && hasPermission(user, PERMISSIONS.READ_USER)) {
      fetchUsers();
    }
  }, [user]);

  const handleDeleteUser = async (userId: string) => {
    if (user && hasPermission(user, PERMISSIONS.DELETE_USER)) {
      try {
        await api.deleteUser(userId);
        setUsers(users.filter(u => u.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (!user || !hasPermission(user, PERMISSIONS.READ_USER)) {
    return <div>Access Denied</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Name</th>
            <th className="text-left">Email</th>
            <th className="text-left">Role</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {hasPermission(user, PERMISSIONS.DELETE_USER) && (
                  <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-700">
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
