import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Paper, 
  Chip, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Avatar,
  IconButton,
  Card,
  CardContent,
  Divider,
  FormLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LoopIcon from '@mui/icons-material/Loop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Mock data for tasks
const initialTasks = [
  { 
    id: 'TASK-101', 
    title: 'Create login page',
    type: 'Task',
    priority: 'High',
    status: 'To Do', 
    assignee: 'Alex Smith',
    avatar: '/api/placeholder/40/40',
    dueDate: '2025-05-20',
    description: 'Implement user authentication and login page with validation',
    reporter: 'Sarah Johnson',
    created: '2025-05-01',
    updated: '2025-05-03',
    estimate: '3 days'
  },
  
];

// Priority styling function
const getPriorityChipProps = (priority) => {
  const baseProps = { size: 'small', sx: { fontWeight: 500 } };
  
  switch (priority) {
    case 'Critical':
      return { ...baseProps, color: 'error', variant: 'filled' };
    case 'High':
      return { ...baseProps, color: 'warning', variant: 'filled' };
    case 'Medium':
      return { ...baseProps, color: 'primary', variant: 'filled' };
    case 'Low':
      return { ...baseProps, color: 'success', variant: 'filled' };
    default:
      return { ...baseProps, color: 'default', variant: 'filled' };
  }
};

// Status styling function
const getStatusChipProps = (status) => {
  const baseProps = { size: 'small', sx: { fontWeight: 500 } };
  
  switch (status) {
    case 'To Do':
      return { ...baseProps, color: 'default', variant: 'outlined' };
    case 'In Progress':
      return { ...baseProps, color: 'primary', variant: 'outlined' };
    case 'Done':
      return { ...baseProps, color: 'success', variant: 'outlined' };
    default:
      return { ...baseProps, color: 'default', variant: 'outlined' };
  }
};

// Task Detail Dialog Component
const TaskDetailDialog = ({ task, isOpen, onClose }) => {
  if (!task) return null;

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">{task.id}</Typography>
          <Typography variant="h6">{task.title}</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" gutterBottom>Description</Typography>
              <Typography variant="body2" color="text.secondary">{task.description}</Typography>
            </Box>
            
            <Box sx={{ mt: 6 }}>
              <Typography variant="subtitle2" gutterBottom>Comments</Typography>
              <TextField
                multiline
                rows={3}
                fullWidth
                placeholder="Add a comment..."
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Button variant="contained" color="primary">
                Comment
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
              <Box sx={{ mb: 3 }}>
                <FormLabel component="legend" sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 600, mb: 1 }}>
                  STATUS
                </FormLabel>
                <FormControl fullWidth size="small">
                  <Select defaultValue={task.status}>
                    <MenuItem value="To Do">To Do</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Done">Done</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <FormLabel component="legend" sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 600, mb: 1 }}>
                  ASSIGNEE
                </FormLabel>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src={task.avatar} sx={{ width: 24, height: 24, mr: 1 }} />
                  <Typography variant="body2">{task.assignee}</Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <FormLabel component="legend" sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 600, mb: 1 }}>
                  REPORTER
                </FormLabel>
                <Typography variant="body2">{task.reporter}</Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <FormLabel component="legend" sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 600, mb: 1 }}>
                  PRIORITY
                </FormLabel>
                <FormControl fullWidth size="small">
                  <Select defaultValue={task.priority}>
                    <MenuItem value="Critical">Critical</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <FormLabel component="legend" sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 600, mb: 1 }}>
                  DUE DATE
                </FormLabel>
                <Typography variant="body2">{task.dueDate}</Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <FormLabel component="legend" sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 600, mb: 1 }}>
                  ESTIMATE
                </FormLabel>
                <Typography variant="body2">{task.estimate}</Typography>
              </Box>
              
              <Box>
                <FormLabel component="legend" sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 600, mb: 1 }}>
                  CREATED
                </FormLabel>
                <Typography variant="body2">{task.created}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Stat Card Component
const StatCard = ({ label, count, icon, color }) => {
  return (
    <Card>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography color="text.secondary" variant="body2">{label}</Typography>
            <Typography variant="h4" fontWeight="bold">{count}</Typography>
          </Box>
          <Avatar sx={{ bgcolor: `${color}.100`, color: `${color}.800`, width: 48, height: 48 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

// Main Component
const MyTasksPage = () => {
  // Assuming current user is 'Alex Smith'
  const currentUser = 'Alex Smith';
  const [tasks, setTasks] = useState(initialTasks.filter(task => task.assignee === currentUser));
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  
  const filteredTasks = tasks.filter(task => {
    // Filter by status
    return statusFilter === 'All' || task.status === statusFilter;
  });
  
  const openTaskDetail = (task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };
  
  const closeTaskDetail = () => {
    setIsDetailOpen(false);
  };

  // Stats for user dashboard
  const todoCount = tasks.filter(task => task.status === 'To Do').length;
  const inProgressCount = tasks.filter(task => task.status === 'In Progress').length;
  const doneCount = tasks.filter(task => task.status === 'Done').length;
  
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">My Tasks</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
        >
          Create Task
        </Button>
      </Box>
      
      {/* Dashboard Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <StatCard 
            label="To Do" 
            count={todoCount} 
            icon={<AssignmentIcon />}
            color="grey"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            label="In Progress" 
            count={inProgressCount} 
            icon={<LoopIcon />}
            color="blue"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            label="Completed" 
            count={doneCount} 
            icon={<CheckCircleIcon />}
            color="green"
          />
        </Grid>
      </Grid>
      
      {/* Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="medium">
          My Assigned Tasks
        </Typography>
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="All">All Status</MenuItem>
            <MenuItem value="To Do">To Do</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {/* Task List */}
      <TableContainer component={Paper} elevation={1}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'background.default' }}>
              <TableCell sx={{ width: '50%' }}>Task</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Priority</TableCell>
              <TableCell align="center">Due Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TableRow 
                  key={task.id}
                  hover
                  onClick={() => openTaskDetail(task)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">{task.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {task.id} • {task.type}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip {...getStatusChipProps(task.status)} label={task.status} />
                  </TableCell>
                  <TableCell align="center">
                    <Chip {...getPriorityChipProps(task.priority)} label={task.priority} />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <AccessTimeIcon fontSize="small" color="action" />
                      <Typography variant="caption">{task.dueDate}</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  <Typography color="text.secondary">No tasks match your filters</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Task Detail Dialog */}
      <TaskDetailDialog 
        task={selectedTask}
        isOpen={isDetailOpen}
        onClose={closeTaskDetail}
      />
    </Box>
  );
};

export default MyTasksPage;