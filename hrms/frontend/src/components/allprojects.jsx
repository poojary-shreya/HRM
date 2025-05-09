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
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  MoreVert as MoreVertIcon, 
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AllProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [starredProjects, setStarredProjects] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuProject, setMenuProject] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [sortType, setSortType] = useState('name-asc');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Fetch projects from the backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/projects');
        if (response.data.success) {
          setProjects(response.data.data);
          
          // Load starred projects from local storage
          const storedStarred = localStorage.getItem('starredProjects');
          if (storedStarred) {
            setStarredProjects(new Set(JSON.parse(storedStarred)));
          }
        } else {
          setError('Failed to load projects');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);
  
  // Format project data for display
  const formatProjects = (projectsData) => {
    return projectsData.map(project => ({
      id: project.id,
      name: project.basicInfo.name,
      key: project.basicInfo.key,
      type: project.basicInfo.type,
      description: project.basicInfo.description,
      lead: project.team.lead ? `${project.team.lead.name}` : 'Unassigned',
      leadAvatar: '/api/placeholder/40/40',
      starred: starredProjects.has(project.id),
      status: project.status,
      lastUpdated: formatDate(project.updatedAt),
      teamMembers: project.team.members || []
    }));
  };
  
  // Format date as "X days/hours ago"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    }
  };
  
  // Handle project menu
  const handleMenuOpen = (event, project) => {
    setAnchorEl(event.currentTarget);
    setMenuProject(project);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuProject(null);
  };
  
  // Handle filter menu
  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  
  const handleFilterMenuClose = (type = null) => {
    if (type) {
      setFilterType(type);
    }
    setFilterAnchorEl(null);
  };
  
  // Handle sort menu
  const handleSortMenuOpen = (event) => {
    setSortAnchorEl(event.currentTarget);
  };
  
  const handleSortMenuClose = (type = null) => {
    if (type) {
      setSortType(type);
    }
    setSortAnchorEl(null);
  };
  
  // Toggle star for a project
  const toggleStar = (id) => {
    const newStarred = new Set(starredProjects);
    if (newStarred.has(id)) {
      newStarred.delete(id);
    } else {
      newStarred.add(id);
    }
    setStarredProjects(newStarred);
    
    // Save to local storage
    localStorage.setItem('starredProjects', JSON.stringify([...newStarred]));
  };
  
  // Handle search
  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };
  
  // Delete a project
  const handleDeleteProject = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/projects/${id}`);
      if (response.data.success) {
        setProjects(projects.filter(project => project.id !== id));
        setSnackbar({
          open: true,
          message: 'Project deleted successfully',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to delete project',
          severity: 'error'
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || 'An error occurred while deleting project',
        severity: 'error'
      });
    }
    handleMenuClose();
  };
  
  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Apply filters and sorting
  const applyFiltersAndSort = () => {
    let filteredProjects = [...formatProjects(projects)];
    
    // Apply search filter
    if (searchText) {
      filteredProjects = filteredProjects.filter(project => 
        project.name.toLowerCase().includes(searchText.toLowerCase()) ||
        project.key.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // Apply category filter
    switch (filterType) {
      case 'starred':
        filteredProjects = filteredProjects.filter(project => project.starred);
        break;
      case 'active':
        filteredProjects = filteredProjects.filter(project => project.status === 'Active');
        break;
      case 'completed':
        filteredProjects = filteredProjects.filter(project => project.status === 'Completed');
        break;
      case 'planning':
        filteredProjects = filteredProjects.filter(project => project.status === 'Planning');
        break;
      case 'on-hold':
        filteredProjects = filteredProjects.filter(project => project.status === 'On Hold');
        break;
      default:
        // 'all' - no filtering
        break;
    }
    
    // Apply sorting
    switch (sortType) {
      case 'name-asc':
        filteredProjects.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filteredProjects.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'updated':
        // This is approximate since we've already converted to "X days ago"
        filteredProjects.sort((a, b) => {
          // Extract number of days/hours
          const aNum = parseInt(a.lastUpdated.split(' ')[0]);
          const bNum = parseInt(b.lastUpdated.split(' ')[0]);
          
          // Check if it's days or hours
          const aIsDays = a.lastUpdated.includes('day');
          const bIsDays = b.lastUpdated.includes('day');
          
          if (aIsDays && !bIsDays) return 1;
          if (!aIsDays && bIsDays) return -1;
          return aNum - bNum;
        });
        break;
      case 'status':
        filteredProjects.sort((a, b) => a.status.localeCompare(b.status));
        break;
      default:
        break;
    }
    
    return filteredProjects;
  };
  
  const filteredProjects = applyFiltersAndSort();
  
  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'primary';
      case 'Planning': return 'info';
      case 'Completed': return 'success';
      case 'On Hold': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">All Projects</Typography>
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
            </Button>
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={() => handleFilterMenuClose()}
            >
              <MenuItem onClick={() => handleFilterMenuClose('all')}>All Projects</MenuItem>
              <MenuItem onClick={() => handleFilterMenuClose('starred')}>Starred Projects</MenuItem>
              <Divider />
              <MenuItem onClick={() => handleFilterMenuClose('active')}>Active</MenuItem>
              <MenuItem onClick={() => handleFilterMenuClose('planning')}>Planning</MenuItem>
              <MenuItem onClick={() => handleFilterMenuClose('completed')}>Completed</MenuItem>
              <MenuItem onClick={() => handleFilterMenuClose('on-hold')}>On Hold</MenuItem>
            </Menu>
            
           
          </Box>
        </Box>
        
        <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 2 }}>
          Showing {filteredProjects.length} of {projects.length} projects
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        ) : (
          <Grid container spacing={3}>
            {filteredProjects.map(project => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
                          {project.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                          Key: {project.key}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton 
                          size="small" 
                          onClick={() => toggleStar(project.id)}
                          color={project.starred ? "warning" : "default"}
                        >
                          {project.starred ? <StarIcon /> : <StarBorderIcon />}
                        </IconButton>
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, project)}>
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar src={project.leadAvatar} sx={{ width: 24, height: 24, mr: 1 }} />
                      <Typography variant="body2">
                        Lead: {project.lead}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label={project.status} 
                        size="small" 
                        color={getStatusColor(project.status)} 
                      />
                      <Typography variant="caption" color="textSecondary">
                        Updated {project.lastUpdated}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      color="primary"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      View Board
                    </Button>
                    <Button 
                      size="small"
                      onClick={() => navigate(`/projects/${project.id}/settings`)}
                    >
                      Settings
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleMenuClose();
          if (menuProject) navigate(`/projects/${menuProject.id}`);
        }}>View details</MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose();
          if (menuProject) navigate(`/projects/${menuProject.id}/settings`);
        }}>Edit</MenuItem>
       
        <Divider />
        <MenuItem 
          sx={{ color: 'error.main' }} 
          onClick={() => {
            if (menuProject) handleDeleteProject(menuProject.id);
          }}
        >
          Delete
        </MenuItem>
      </Menu>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AllProjects;