import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserDashboardSummary, Event, Notification, Activity } from '../types';
import * as api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, Grid, Typography, Button, Avatar, Chip, List, ListItem, ListItemText, ListItemAvatar } from '@mui/material';
import { Event as EventIcon, Notifications as NotificationsIcon, History as HistoryIcon, Add as AddIcon } from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<UserDashboardSummary | null>(null);
  const { notifications } = useNotifications();
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (user) {
        try {
          console.log('Fetching dashboard data for user:', user.id);
          const response = await api.getUserDashboardSummary(user.id);
          console.log('Dashboard data fetched successfully:', response.data);
          setDashboardData(response.data);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
      } else {
        console.warn('No user found, skipping dashboard data fetch.');
      }
    };

    fetchDashboardData();
  }, [user]);

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography variant="h5">Loading...</Typography>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Typography variant="h4" className="mb-8 font-bold">Welcome, {user?.name}</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader
              title="Upcoming Events"
              avatar={<Avatar><EventIcon /></Avatar>}
              action={
                <Button
                  component={Link}
                  to="/events/create"
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                >
                  Create Event
                </Button>
              }
            />
            <CardContent>
              <List>
                {dashboardData.upcomingEvents.content.map((event: Event) => (
                  <ListItem
                    key={event.id}
                    button
                    component={Link}
                    to={`/events/${event.id}`}
                    className="mb-2 hover:bg-gray-100 rounded-lg transition duration-300"
                  >
                    <ListItemAvatar>
                      <Avatar>{event.title[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={event.title}
                      secondary={format(new Date(event.date), 'PPP')}
                    />
                    <Chip label={event.location} size="small" className="ml-2" />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader
              title="Recent Notifications"
              avatar={<Avatar><NotificationsIcon /></Avatar>}
            />
            <CardContent>
              <List>
              {dashboardData.recentNotifications.map((notification: Notification) => (
                  <div key={notification.id} className="bg-white shadow rounded-lg p-4 mb-4">
                    <p>{notification.message}</p>
                    <small>{new Date(notification.createdAt).toLocaleString()}</small>
                  </div>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Card elevation={3} className="mt-8">
        <CardHeader
          title="Recent Activities"
          avatar={<Avatar><HistoryIcon /></Avatar>}
        />
        <CardContent>
          <List>
            {dashboardData.recentActivities.content.map((activity: Activity) => (
              <ListItem key={activity.id} className="mb-2">
                <ListItemText
                  primary={activity.description}
                  secondary={format(new Date(activity.createdAt), 'PPp')}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;