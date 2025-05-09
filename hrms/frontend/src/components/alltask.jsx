import React, { useState } from 'react';

import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  IconButton, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Paper, 
  Chip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Avatar, 
  Grid, 
  InputAdornment, 
  Card, 
  CardContent, 
  Divider, 
  Badge, 
  Tooltip,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';

// Import icons
import { 
  Search, 
  Add, 
  Close, 
  FilterList, 
  AccessTime, 
  Comment,
  Save,
  BugReport,
  Assignment,
  Bookmark
} from '@mui/icons-material';

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
    estimate: '3 days',
    comments: []
  },
 
];

// Color utilities
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Critical': return { bg: 'error.main', text: 'white' };
    case 'High': return { bg: 'warning.main', text: 'white' };
    case 'Medium': return { bg: 'orange', text: 'white' };
    case 'Low': return { bg: 'success.main', text: 'white' };
    default: return { bg: 'grey.500', text: 'white' };
  }
};

const getTypeIcon = (type) => {
  switch (type) {
    case 'Bug': return <BugReport fontSize="small" />;
    case 'Task': return <Assignment fontSize="small" />;
    case 'Story': return <Bookmark fontSize="small" />;
    default: return <Assignment fontSize="small" />;
  }
};

const getTypeColor = (type) => {
  switch (type) {
    case 'Bug': return { bg: 'error.light', text: 'error.dark' };
    case 'Task': return { bg: 'primary.light', text: 'primary.dark' };
    case 'Story': return { bg: 'success.light', text: 'success.dark' };
    default: return { bg: 'grey.200', text: 'grey.800' };
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'To Do': return { bg: 'grey.200', text: 'grey.800' };
    case 'In Progress': return { bg: 'info.light', text: 'info.dark' };
    case 'Done': return { bg: 'success.light', text: 'success.dark' };
    default: return { bg: 'grey.200', text: 'grey.800' };
  }
};

// Task detail dialog component - FIXED to follow React Hooks rules
const TaskDetailDialog = ({ task, isOpen, onClose }) => {
  // Declare all hooks at the top level, regardless of conditions
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  
  // Use React's useEffect to update state when task changes
  React.useEffect(() => {
    if (task) {
      setStatus(task.status);
      setPriority(task.priority);
    }
  }, [task]);

  // Early return after hooks are declared
  if (!isOpen || !task) return null;
  
  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="caption" color="text.secondary">
              {task.id}
            </Typography>
            <Typography variant="h6">{task.title}</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box mb={3}>
              <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                Description
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {task.description}
              </Typography>
            </Box>
            
            <Box mt={4}>
              <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                Comments
              </Typography>
              {task.comments && task.comments.length > 0 ? (
                task.comments.map((comment, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="body2">{comment}</Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" mb={2}>
                  No comments yet
                </Typography>
              )}
              
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Add a comment..."
                variant="outlined"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ mb: 2 }}
              />
              
              <Button 
                variant="contained" 
                startIcon={<Comment />}
              >
                Comment
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'grey.50' }}>
              <Box mb={2}>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                  STATUS
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <MenuItem value="To Do">To Do</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Done">Done</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Box mb={2}>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                  ASSIGNEE
                </Typography>
                <Box display="flex" alignItems="center">
                  <Avatar 
                    src={task.avatar} 
                    alt={task.assignee} 
                    sx={{ width: 24, height: 24, mr: 1 }}
                  />
                  <Typography variant="body2">{task.assignee}</Typography>
                </Box>
              </Box>
              
              <Box mb={2}>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                  REPORTER
                </Typography>
                <Typography variant="body2">{task.reporter}</Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                  PRIORITY
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <MenuItem value="Critical">Critical</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Box mb={2}>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                  DUE DATE
                </Typography>
                <Typography variant="body2">{task.dueDate}</Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                  ESTIMATE
                </Typography>
                <Typography variant="body2">{task.estimate}</Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                  CREATED
                </Typography>
                <Typography variant="body2">{task.created}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button 
          variant="contained" 
          startIcon={<Save />}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AllTasksPage = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const filteredTasks = tasks.filter(task => {
    // Filter by search term
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        task.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const openTaskDetail = (task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };
  
  const closeTaskDetail = () => {
    setIsDetailOpen(false);
  };
  
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          All Tasks
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          sx={{ borderRadius: 2 }}
        >
          Create Task
        </Button>
      </Box>
      
      <Box 
        mb={3}
        display="flex" 
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        gap={2}
      >
        <Box 
          display="flex" 
          gap={2}
          width={{ xs: '100%', sm: 'auto' }}
        >
          <TextField
            placeholder="Search tasks..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: { xs: '100%', sm: 280 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            size="medium"
          >
            Filter
          </Button>
        </Box>
        
        <Box 
          display="flex" 
          alignItems="center" 
          gap={2}
          width={{ xs: '100%', sm: 'auto' }}
          justifyContent={{ xs: 'space-between', sm: 'flex-start' }}
        >
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="To Do">To Do</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </Select>
          </FormControl>
          
          <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
            {filteredTasks.length} tasks
          </Typography>
        </Box>
      </Box>
      
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.50' }}>
              <TableCell width="40%">Task</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>Type</TableCell>
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
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar src={task.avatar} alt={task.assignee} />
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {task.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {task.id} • {task.assignee}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Chip 
                      label={task.status}
                      size="small"
                      sx={{ 
                        bgcolor: getStatusColor(task.status).bg,
                        color: getStatusColor(task.status).text,
                      }}
                    />
                  </TableCell>
                  
                  <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Tooltip title={task.type}>
                      <Chip
                        icon={getTypeIcon(task.type)}
                        label={task.type}
                        size="small"
                        sx={{ 
                          bgcolor: getTypeColor(task.type).bg,
                          color: getTypeColor(task.type).text,
                        }}
                      />
                    </Tooltip>
                  </TableCell>
                  
                  <TableCell align="center">
                    <Chip 
                      label={task.priority}
                      size="small"
                      sx={{ 
                        bgcolor: getPriorityColor(task.priority).bg,
                        color: getPriorityColor(task.priority).text,
                      }}
                    />
                  </TableCell>
                  
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                      <AccessTime fontSize="small" color="action" />
                      <Typography variant="body2">{task.dueDate}</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No tasks match your filters
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TaskDetailDialog 
        task={selectedTask}
        isOpen={isDetailOpen}
        onClose={closeTaskDetail}
      />
    </Box>
  );
};

export default AllTasksPage;