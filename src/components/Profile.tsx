import React, { useState, useEffect } from 'react';
import { User } from '../types';
import * as api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { TextField, Button, Paper, Typography, Avatar, Grid, Chip } from '@mui/material';
import { Edit, Save, ExitToApp } from '@mui/icons-material';

const Profile = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userData) {
      try {
        await api.updateUser(userData.id, userData);
        setEditMode(false);
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    }
  };

  if (!userData) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper elevation={3} className="p-8 max-w-2xl mx-auto">
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        <Grid item>
          <Avatar
            alt={userData.name}
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${userData.name}`}
            sx={{ width: 100, height: 100, fontSize: 40 }}
          />
        </Grid>
        <Grid item>
          <Typography variant="h4" component="h1" gutterBottom>
            {userData.name}
          </Typography>
          <Chip
            label={userData.role}
            color="primary"
            variant="outlined"
            className="mt-2"
          />
        </Grid>
      </Grid>
      <form onSubmit={handleSubmit} className="mt-8">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              disabled={!editMode}
              variant={editMode ? "outlined" : "filled"}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              disabled={!editMode}
              variant={editMode ? "outlined" : "filled"}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Role"
              name="role"
              value={userData.role}
              disabled
              variant="filled"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            {editMode ? (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<Save />}
                fullWidth
              >
                Save Changes
              </Button>
            ) : (
              <Button
                onClick={() => setEditMode(true)}
                variant="contained"
                color="secondary"
                startIcon={<Edit />}
                fullWidth
              >
                Edit Profile
              </Button>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              onClick={logout}
              variant="outlined"
              color="error"
              startIcon={<ExitToApp />}
              fullWidth
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default Profile;