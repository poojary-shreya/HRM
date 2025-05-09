import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Grid,
  Avatar,
  Card,
  CardContent,
  TextareaAutosize,
  Divider,
  InputAdornment
} from '@mui/material';

// Import MUI icons
import {
  Add as AddIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  AccessTime as AccessTimeIcon,
  Delete as DeleteIcon,
  Save as SaveIcon
} from '@mui/icons-material';

// Initial tasks for demo purposes
const initialTasks = [
  {
    id: 'TASK-101',
    title: 'Implement login functionality',
    description: 'Create user authentication system with JWT tokens',
    status: 'In Progress',
    type: 'Task',
    priority: 'High',
    assignee: 'Alex Johnson',
    avatar: '/api/placeholder/40/40',
    reporter: 'Sarah Miller',
    dueDate: '2025-05-20',
    estimate: '3 days',
    created: '2025-05-01',
    updated: '2025-05-03',
    comments: [
      {
        id: '1',
        text: 'Backend APIs are ready for integration',
        author: 'Alex Johnson',
        timestamp: '2025-05-02T14:22:00Z'
      }
    ]
  },
  {
    id: 'BUG-102',
    title: 'Fix navigation sidebar collapse issue',
    description: 'Sidebar doesn\'t collapse properly on mobile devices',
    status: 'To Do',
    type: 'Bug',
    priority: 'Medium',
    assignee: 'Emily Chen',
    avatar: '/api/placeholder/40/40',
    reporter: 'Michael Brown',
    dueDate: '2025-05-15',
    estimate: '1 day',
    created: '2025-05-03',
    updated: '2025-05-03',
    comments: []
  },
  {
    id: 'STOR-103',
    title: 'User profile customization',
    description: 'Allow users to customize their profile with themes and avatars',
    status: 'Done',
    type: 'Story',
    priority: 'Low',
    assignee: 'David Wilson',
    avatar: '/api/placeholder/40/40',
    reporter: 'Sarah Miller',
    dueDate: '2025-05-05',
    estimate: '5 days',
    created: '2025-04-25',
    updated: '2025-05-05',
    comments: [
      {
        id: '1',
        text: 'Design mockups are ready',
        author: 'Lisa Taylor',
        timestamp: '2025-04-26T09:15:00Z'
      },
      {
        id: '2',
        text: 'Completed and ready for review',
        author: 'David Wilson',
        timestamp: '2025-05-05T16:30:00Z'
      }
    ]
  },
  {
    id: 'BUG-104',
    title: 'Dashboard statistics not updating in real-time',
    description: 'User dashboard stats are only refreshing on page reload',
    status: 'In Progress',
    type: 'Bug',
    priority: 'Critical',
    assignee: 'Michael Brown',
    avatar: '/api/placeholder/40/40',
    reporter: 'Alex Johnson',
    dueDate: '2025-05-10',
    estimate: '2 days',
    created: '2025-05-02',
    updated: '2025-05-04',
    comments: []
  }
];

// Helper functions for styling based on status, priority, and type
const getStatusColor = (status) => {
  switch (status) {
    case 'To Do': return { bg: '#E5E7EB', color: '#374151' };
    case 'In Progress': return { bg: '#DBEAFE', color: '#1E40AF' };
    case 'Done': return { bg: '#D1FAE5', color: '#065F46' };
    default: return { bg: '#E5E7EB', color: '#374151' };
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Critical': return { bg: '#FEE2E2', color: '#B91C1C' };
    case 'High': return { bg: '#FEF3C7', color: '#92400E' };
    case 'Medium': return { bg: '#E0E7FF', color: '#3730A3' };
    case 'Low': return { bg: '#D1FAE5', color: '#065F46' };
    default: return { bg: '#E0E7FF', color: '#3730A3' };
  }
};

const getTypeColor = (type) => {
  switch (type) {
    case 'Bug': return { bg: '#FEE2E2', color: '#B91C1C' };
    case 'Task': return { bg: '#E0E7FF', color: '#3730A3' };
    case 'Story': return { bg: '#D1FAE5', color: '#065F46' };
    default: return { bg: '#E0E7FF', color: '#3730A3' };
  }
};

// Create Task Dialog Component with MUI
const CreateTaskDialog = ({ onClose, onCreate, tasks }) => {
  const [newTask, setNewTask] = useState({
    id: '',
    title: '',
    description: '',
    status: 'To Do',
    type: 'Task',
    priority: 'Medium',
    assignee: 'Current User', // In a real app, this would be selected from users list
    avatar: '/api/placeholder/40/40',
    reporter: 'Current User', // In a real app, this would be the logged-in user
    dueDate: '',
    estimate: '',
    created: new Date().toISOString().split('T')[0],
    updated: new Date().toISOString().split('T')[0],
    comments: []
  });

  // Generate a unique task ID based on type and existing tasks
  useEffect(() => {
    const generateTaskId = () => {
      const prefix = newTask.type === 'Bug' ? 'BUG' : 
                     newTask.type === 'Story' ? 'STOR' : 'TASK';
      
      // Find the highest number for this prefix
      const existingIds = tasks
        .filter(task => task.id.startsWith(prefix))
        .map(task => {
          const numStr = task.id.split('-')[1];
          return numStr ? parseInt(numStr, 10) : 0;
        });
      
      const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
      return `${prefix}-${(maxId + 1).toString().padStart(3, '0')}`;
    };

    setNewTask(prev => ({ ...prev, id: generateTaskId() }));
  }, [newTask.type, tasks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(newTask);
  };

  return (
    <Dialog 
      open={true} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      aria-labelledby="create-task-dialog"
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle id="create-task-dialog" sx={{ p: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6">Create New Task</Typography>
            <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Task ID
                </Typography>
                <TextField
                  value={newTask.id}
                  disabled
                  fullWidth
                  variant="outlined"
                  size="small"
                  helperText="ID is automatically generated based on task type"
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Title *
                </Typography>
                <TextField
                  name="title"
                  value={newTask.title}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter task title"
                  required
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Description
                </Typography>
                <TextField
                  name="description"
                  value={newTask.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  placeholder="Describe the task in detail"
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: '#F9FAFB' }}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block">
                    TYPE *
                  </Typography>
                  <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                    <Select
                      name="type"
                      value={newTask.type}
                      onChange={handleChange}
                      displayEmpty
                      required
                    >
                      <MenuItem value="Bug">Bug</MenuItem>
                      <MenuItem value="Task">Task</MenuItem>
                      <MenuItem value="Story">Story</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block">
                    STATUS *
                  </Typography>
                  <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                    <Select
                      name="status"
                      value={newTask.status}
                      onChange={handleChange}
                      displayEmpty
                      required
                    >
                      <MenuItem value="To Do">To Do</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Done">Done</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block">
                    PRIORITY *
                  </Typography>
                  <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                    <Select
                      name="priority"
                      value={newTask.priority}
                      onChange={handleChange}
                      displayEmpty
                      required
                    >
                      <MenuItem value="Critical">Critical</MenuItem>
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block">
                    ASSIGNEE
                  </Typography>
                  <TextField
                    name="assignee"
                    value={newTask.assignee}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    sx={{ mt: 0.5 }}
                    placeholder="Who should work on this task?"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block">
                    REPORTER
                  </Typography>
                  <TextField
                    name="reporter"
                    value={newTask.reporter}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    sx={{ mt: 0.5 }}
                    placeholder="Who is reporting this task?"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block">
                    DUE DATE
                  </Typography>
                  <TextField
                    type="date"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block">
                    ESTIMATE
                  </Typography>
                  <TextField
                    name="estimate"
                    value={newTask.estimate}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    sx={{ mt: 0.5 }}
                    placeholder="e.g., 2 days"
                  />
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block">
                    CREATED
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>{newTask.created}</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
            disabled={!newTask.title}
          >
            Create Task
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Task Detail Dialog Component with MUI
const TaskDetailDialog = ({ task, onClose, onUpdate, onDelete }) => {
  const [editedTask, setEditedTask] = useState({ ...task });
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(task.comments || []);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...editedTask, comments });
  };

  const handleAddComment = () => {
    if (comment.trim() === '') return;
    
    const newComment = {
      id: Date.now().toString(),
      text: comment,
      author: 'Current User', // In a real app, this would be the logged-in user
      timestamp: new Date().toISOString()
    };
    
    setComments([...comments, newComment]);
    setComment('');
  };

  return (
    <Dialog 
      open={true} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      aria-labelledby="task-detail-dialog"
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle id="task-detail-dialog" sx={{ p: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                {editedTask.id}
              </Typography>
              <TextField
                name="title"
                value={editedTask.title}
                onChange={handleChange}
                variant="standard"
                InputProps={{ 
                  disableUnderline: true,
                  sx: { fontSize: '1.25rem', fontWeight: 'medium' } 
                }}
                sx={{ '& .MuiInputBase-input:focus': { outline: 'none' } }}
              />
            </Box>
            <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Description
                </Typography>
                <TextField
                  name="description"
                  value={editedTask.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Comments
                </Typography>
                <Box sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
                  {comments && comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <Card key={index} variant="outlined" sx={{ mb: 2, bgcolor: '#F9FAFB' }}>
                        <CardContent sx={{ py: 2, px: 2, '&:last-child': { pb: 2 } }}>
                          <Typography variant="body2">{comment.text || comment}</Typography>
                          {comment.author && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                              {comment.author} • {new Date(comment.timestamp).toLocaleString()}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No comments yet
                    </Typography>
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    placeholder="Add a comment..."
                    multiline
                    rows={2}
                    fullWidth
                    variant="outlined"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddComment}
                    sx={{ alignSelf: 'flex-end', height: 'fit-content' }}
                  >
                    Comment
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
  <Paper variant="outlined" sx={{ p: 3, bgcolor: '#F9FAFB', maxWidth: "2200px", width: "100%" }}>
    <Box sx={{ mb: 3 }}>
      <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block">
        STATUS
      </Typography>
      <FormControl fullWidth size="medium" sx={{ mt: 1 }}>
        <Select
          name="status"
          value={editedTask.status}
          onChange={handleChange}
          displayEmpty
        >
          <MenuItem value="To Do">To Do</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Done">Done</MenuItem>
        </Select>
      </FormControl>
    </Box>

    <Box sx={{ mb: 3 }}>
      <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block">
        ASSIGNEE
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Avatar src={editedTask.avatar} alt={editedTask.assignee} sx={{ width: 28, height: 28, mr: 1.5 }} />
        <Typography variant="body2">{editedTask.assignee}</Typography>
      </Box>
    </Box>

    <Box sx={{ mb: 3 }}>
      <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block">
        REPORTER
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>{editedTask.reporter}</Typography>
    </Box>

    <Box sx={{ mb: 3 }}>
      <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block">
        PRIORITY
      </Typography>
      <FormControl fullWidth size="medium" sx={{ mt: 1 }}>
        <Select
          name="priority"
          value={editedTask.priority}
          onChange={handleChange}
          displayEmpty
        >
          <MenuItem value="Critical">Critical</MenuItem>
          <MenuItem value="High">High</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Low">Low</MenuItem>
        </Select>
      </FormControl>
    </Box>

    <Box sx={{ mb: 3 }}>
      <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block">
        TYPE
      </Typography>
      <FormControl fullWidth size="medium" sx={{ mt: 1 }}>
        <Select
          name="type"
          value={editedTask.type}
          onChange={handleChange}
          displayEmpty
        >
          <MenuItem value="Bug">Bug</MenuItem>
          <MenuItem value="Task">Task</MenuItem>
          <MenuItem value="Story">Story</MenuItem>
        </Select>
      </FormControl>
    </Box>

    <Box sx={{ mb: 3 }}>
      <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block">
        DUE DATE
      </Typography>
      <TextField
        type="date"
        name="dueDate"
        value={editedTask.dueDate}
        onChange={handleChange}
        fullWidth
        size="medium"
        sx={{ mt: 1 }}
      />
    </Box>

    <Box sx={{ mb: 3 }}>
      <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block">
        ESTIMATE
      </Typography>
      <TextField
        name="estimate"
        value={editedTask.estimate}
        onChange={handleChange}
        fullWidth
        size="medium"
        sx={{ mt: 1 }}
      />
    </Box>

    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight="bold" display="block">
        CREATED
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>{editedTask.created}</Typography>
    </Box>
  </Paper>
</Grid>
</Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider', justifyContent: 'space-between' }}>
          <Button
            onClick={() => setIsDeleteConfirmOpen(true)}
            color="error"
            variant="outlined"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
          <Box>
            <Button onClick={onClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              startIcon={<SaveIcon />}
            >
              Save Changes
            </Button>
          </Box>
        </DialogActions>
      </form>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Task
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this task? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteConfirmOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              onDelete(task.id);
              setIsDeleteConfirmOpen(false);
            }} 
            color="error" 
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

// Component for task management with MUI styling
const TaskManagementSystem = () => {
  // State management
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('dueDate');
  const [sortDirection, setSortDirection] = useState('asc');

  // Load initial data
  useEffect(() => {
    // In a real project, this would be an API call
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      setTasks(initialTasks);
    }
  }, []);

  // Save tasks to localStorage whenever tasks state changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Filter and sort tasks
  const processedTasks = tasks
    .filter(task => {
      // Filter by search term
      const matchesSearch = 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        task.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by status
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by the selected field
      if (a[sortField] < b[sortField]) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (a[sortField] > b[sortField]) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

  // Handlers
  const handleOpenTaskDetail = (task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };
  
  const handleCloseTaskDetail = () => {
    setIsDetailOpen(false);
  };

  const handleOpenCreateForm = () => {
    setIsCreateFormOpen(true);
  };

  const handleCloseCreateForm = () => {
    setIsCreateFormOpen(false);
  };

  const handleCreateTask = (newTask) => {
    setTasks([...tasks, newTask]);
    handleCloseCreateForm();
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    handleCloseTaskDetail();
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    handleCloseTaskDetail();
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <Box sx={{ bgcolor: '#F9FAFB', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Task Management System
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleOpenCreateForm}
          >
            Create Task
          </Button>
        </Box>

        {/* Search and filter section */}
        <Paper sx={{ p: 3, mb: 4 }} elevation={1}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: { xs: '100%', sm: 'auto' } }}>
              <TextField
                placeholder="Search tasks..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: { xs: '100%', sm: '250px' } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              
              <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
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
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              {processedTasks.length} task{processedTasks.length !== 1 ? 's' : ''} found
            </Typography>
          </Box>
        </Paper>

        {/* Tasks table */}
        <Paper sx={{ overflowX: 'auto' }} elevation={1}>
          <TableContainer>
            <Table aria-label="tasks table">
              <TableHead>
                <TableRow sx={{ bgcolor: '#F3F4F6' }}>
                  <TableCell 
                    onClick={() => toggleSort('id')}
                    sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableCell>
                  <TableCell 
                    onClick={() => toggleSort('title')}
                    sx={{ cursor: 'pointer', fontWeight: 'bold', width: '30%' }}
                  >
                    Title {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Priority</TableCell>
                  <TableCell 
                    onClick={() => toggleSort('assignee')}
                    sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Assignee {sortField === 'assignee' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableCell>
                  <TableCell 
                    onClick={() => toggleSort('dueDate')}
                    sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Due Date {sortField === 'dueDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {processedTasks.length > 0 ? (
                  processedTasks.map((task) => (
                    <TableRow 
                      key={task.id} 
                      hover 
                      onClick={() => handleOpenTaskDetail(task)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{task.id}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {task.title}
                          {task.comments && task.comments.length > 0 && (
                            <Chip 
                              label={task.comments.length} 
                              size="small" 
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={task.type} 
                          size="small"
                          sx={{ 
                            bgcolor: getTypeColor(task.type).bg,
                            color: getTypeColor(task.type).color,
                            fontWeight: 'medium'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={task.status} 
                          size="small"
                          sx={{ 
                            bgcolor: getStatusColor(task.status).bg,
                            color: getStatusColor(task.status).color,
                            fontWeight: 'medium'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={task.priority} 
                          size="small"
                          sx={{ 
                            bgcolor: getPriorityColor(task.priority).bg,
                            color: getPriorityColor(task.priority).color,
                            fontWeight: 'medium'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar 
                            src={task.avatar} 
                            alt={task.assignee}
                            sx={{ width: 24, height: 24 }}
                          />
                          <Typography variant="body2">{task.assignee}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTimeIcon fontSize="small" color="action" />
                          <Typography variant="body2">{task.dueDate}</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        No tasks found. Create a new task to get started.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      {/* Task detail dialog */}
      {isDetailOpen && selectedTask && (
        <TaskDetailDialog
          task={selectedTask}
          onClose={handleCloseTaskDetail}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
        />
      )}

      {/* Create task dialog */}
      {isCreateFormOpen && (
        <CreateTaskDialog
          onClose={handleCloseCreateForm}
          onCreate={handleCreateTask}
          tasks={tasks}
        />
      )}
    </Box>
  );
};

export default TaskManagementSystem;