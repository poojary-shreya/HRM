import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  Chip,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Tooltip,
  AvatarGroup,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  MoreVert as MoreVertIcon, 
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Add as AddIcon,
  PeopleAlt as PeopleAltIcon,
  Assignment as AssignmentIcon,
  Today as TodayIcon,
  Notifications as NotificationsIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ActiveProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [projectMenuId, setProjectMenuId] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/projects`);
        
        if (response.data.success) {
          // Transform the backend data into the format expected by our component
          const transformedProjects = response.data.data.map(project => ({
            id: project.id,
            name: project.basicInfo.name,
            key: project.basicInfo.key,
            type: project.basicInfo.type,
            lead: project.team.lead ? project.team.lead.name : 'Not Assigned',
            leadAvatar: '/api/placeholder/40/40',
            starred: false, // This could be stored in user preferences
            status: project.status,
            lastUpdated: formatLastUpdated(project.updatedAt),
            progress: calculateProgress(project), // You may need to calculate this based on tasks
            dueDate: project.timeline.endDate,
            tasks: {
              total: 0, // These would need to come from a tasks API
              completed: 0
            },
            team: project.team.members.map(member => ({
              id: member.id,
              name: member.name,
              avatar: '/api/placeholder/40/40'
            })),
            priority: determinePriority(project) // This function would determine priority
          }));
          
          setProjects(transformedProjects);
        } else {
          setError('Failed to fetch projects');
        }
      } catch (err) {
        setError(err.message || 'Error fetching projects');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  // Helper function to format the last updated date
  const formatLastUpdated = (dateString) => {
    const now = new Date();
    const updatedDate = new Date(dateString);
    const diffTime = Math.abs(now - updatedDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    if (diffDays > 7) {
      return updatedDate.toLocaleDateString();
    } else if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };
  
  // Helper function to calculate progress (placeholder)
  const calculateProgress = (project) => {
    // This would ideally come from task data
    // For now, let's generate a random progress value
    return Math.floor((project.id * 17) % 100);
  };
  
  // Helper function to determine priority (placeholder)
  const determinePriority = (project) => {
    // This would ideally be stored in the project data
    // For now, let's assign priorities in a round-robin fashion
    const priorities = ['High', 'Medium', 'Low'];
    return priorities[project.id % 3];
  };
  
  const handleMenuOpen = (event, projectId) => {
    setAnchorEl(event.currentTarget);
    setProjectMenuId(projectId);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setProjectMenuId(null);
  };
  
  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  
  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };
  
  const handleSortMenuOpen = (event) => {
    setSortAnchorEl(event.currentTarget);
  };
  
  const handleSortMenuClose = () => {
    setSortAnchorEl(null);
  };
  
  const toggleStar = (id) => {
    setProjects(projects.map(project => 
      project.id === id ? {...project, starred: !project.starred} : project
    ));
  };
  
  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleViewProject = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleSortChange = (sortKey) => {
    if (sortBy === sortKey) {
      // Toggle direction if clicking the same sort field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(sortKey);
      setSortDirection('asc');
    }
    handleSortMenuClose();
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    handleFilterMenuClose();
  };
  
  const handleArchiveProject = async (projectId) => {
    try {
      const project = projects.find(p => p.id === projectId);
      
      // Update project status to 'Archived'
      await axios.put(`${API_URL}/projects/${projectId}`, {
        status: 'Archived'
      });
      
      // Remove project from list
      setProjects(projects.filter(p => p.id !== projectId));
      
      // Show success message
      setSnackbar({
        open: true,
        message: `Project "${project.name}" archived successfully`,
        severity: 'success'
      });
      
      handleMenuClose();
    } catch (err) {
      console.error('Error archiving project:', err);
      setSnackbar({
        open: true,
        message: 'Failed to archive project',
        severity: 'error'
      });
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Filter projects based on search text and status filter
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchText.toLowerCase()) ||
      project.key.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || 
      project.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let comparison = 0;
    
    switch(sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'dueDate':
        comparison = new Date(a.dueDate) - new Date(b.dueDate);
        break;
      case 'progress':
        comparison = a.progress - b.progress;
        break;
      case 'priority':
        const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'updatedAt':
      default:
        // Compare by lastUpdated, which is a string description
        // For real app, you'd want to sort by actual date timestamps
        comparison = a.lastUpdated.localeCompare(b.lastUpdated);
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'primary';
      case 'Planning': return 'info';
      case 'Completed': return 'success';
      case 'On Hold': return 'warning';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return '#f44336';
      case 'Medium': return '#ff9800';
      case 'Low': return '#2196f3';
      default: return '#757575';
    }
  };

  const renderProgressBar = (progress) => {
    const getProgressColor = (value) => {
      if (value < 30) return '#ff9800';
      if (value < 70) return '#2196f3';
      return '#4caf50';
    };

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
        <Box
          sx={{
            width: '100%',
            backgroundColor: '#e0e0e0',
            borderRadius: 1,
            mr: 1
          }}
        >
          <Box
            sx={{
              width: `${progress}%`,
              height: 8,
              backgroundColor: getProgressColor(progress),
              borderRadius: 1,
            }}
          />
        </Box>
        <Typography variant="body2" color="textSecondary">{progress}%</Typography>
      </Box>
    );
  };
  
  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">Active Projects</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/create-project')}
        >
          Create Project
        </Button>
      </Box>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField
            placeholder="Search projects"
            variant="outlined"
            size="small"
            value={searchText}
            onChange={handleSearch}
            sx={{ width: '400px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <Box>
            <Button 
              variant="outlined" 
              startIcon={<FilterListIcon />}
              onClick={handleFilterMenuOpen}
              sx={{ mr: 1 }}
            >
              Filter
              {filterStatus !== 'all' && (
                <Badge 
                  color="primary" 
                  variant="dot" 
                  sx={{ ml: 1 }}
                />
              )}
            </Button>
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterMenuClose}
            >
              <MenuItem 
                onClick={() => handleFilterChange('all')}
                selected={filterStatus === 'all'}
              >
                All Projects
              </MenuItem>
              <MenuItem 
                onClick={() => handleFilterChange('active')}
                selected={filterStatus === 'active'}
              >
                Active
              </MenuItem>
              <MenuItem 
                onClick={() => handleFilterChange('planning')}
                selected={filterStatus === 'planning'}
              >
                Planning
              </MenuItem>
              <MenuItem 
                onClick={() => handleFilterChange('completed')}
                selected={filterStatus === 'completed'}
              >
                Completed
              </MenuItem>
              <MenuItem 
                onClick={() => handleFilterChange('on hold')}
                selected={filterStatus === 'on hold'}
              >
                On Hold
              </MenuItem>
            </Menu>
           
          
            
          </Box>
        </Box>
       
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
            Showing {sortedProjects.length} of {projects.length} projects
          </Typography>
          {filterStatus !== 'all' && (
            <Chip 
              label={`Status: ${filterStatus}`}
              size="small"
              onDelete={() => setFilterStatus('all')}
              sx={{ mr: 1 }}
            />
          )}
          {sortBy !== 'updatedAt' && (
            <Chip 
              label={`Sorted by: ${sortBy}`}
              size="small"
              onDelete={() => {
                setSortBy('updatedAt');
                setSortDirection('desc');
              }}
            />
          )}
        </Box>
      </Paper>
     
      <Grid container spacing={3}>
        {sortedProjects.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: getPriorityColor(project.priority),
                        width: 36, 
                        height: 36,
                        mr: 1.5,
                        fontSize: '0.875rem'
                      }}
                    >
                      {project.key}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="h2">
                        {project.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {project.type}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex' }}>
                    <IconButton 
                      size="small" 
                      onClick={() => toggleStar(project.id)}
                      sx={{ mr: 0.5 }}
                    >
                      {project.starred ? 
                        <StarIcon fontSize="small" color="warning" /> : 
                        <StarBorderIcon fontSize="small" />
                      }
                    </IconButton>
                    <IconButton 
                      size="small"
                      onClick={(e) => handleMenuOpen(e, project.id)}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
               
                <Divider sx={{ my: 2 }} />
               
                <Box sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Chip 
                      label={project.status} 
                      size="small"
                      color={getStatusColor(project.status)}
                    />
                    <Tooltip title={`Priority: ${project.priority}`}>
                      <Box 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          bgcolor: getPriorityColor(project.priority),
                        }} 
                      />
                    </Tooltip>
                  </Box>
                 
                  {renderProgressBar(project.progress)}
                 
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AssignmentIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="textSecondary">
                        {project.tasks.completed}/{project.tasks.total} tasks
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TodayIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="textSecondary">
                        {project.dueDate ? `Due ${new Date(project.dueDate).toLocaleDateString()}` : 'No due date'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
               
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title={`Lead: ${project.lead}`}>
                      <Avatar 
                        src={project.leadAvatar} 
                        sx={{ width: 24, height: 24, mr: 1 }}
                      />
                    </Tooltip>
                    <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24 } }}>
                      {project.team.map(member => (
                        <Tooltip key={member.id} title={member.name}>
                          <Avatar 
                            src={member.avatar} 
                            sx={{ width: 24, height: 24 }}
                          />
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                  </Box>
                  <Typography variant="caption" color="textSecondary">
                    Updated {project.lastUpdated}
                  </Typography>
                </Box>
              </CardContent>
             
              <CardActions>
                <Button 
                  size="small" 
                  variant="text" 
                  onClick={() => handleViewProject(project.id)}
                  sx={{ ml: 'auto' }}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
     
      {sortedProjects.length === 0 && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No projects found matching your criteria
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Try changing your search or filter settings
          </Typography>
        </Paper>
      )}
     
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleViewProject(projectMenuId);
          handleMenuClose();
        }}>
          View details
        </MenuItem>
        <MenuItem onClick={() => {
          navigate(`/projects/${projectMenuId}/edit`);
          handleMenuClose();
        }}>
          Edit project
        </MenuItem>
      
      </Menu>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ActiveProjects;