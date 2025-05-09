import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  Autocomplete
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
  CalendarMonth as CalendarIcon,
  SupervisorAccount as ManagerIcon,
  AccountTree as DepartmentIcon
} from "@mui/icons-material";
import axios from "axios";

// API base URL - Make sure this matches your backend server
const API_URL = "http://localhost:5000/api";

// Department options
const departments = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Sales" },
  { id: 3, name: "Marketing" },
  { id: 4, name: "Human Resources" },
  { id: 5, name: "Finance" },
  { id: 6, name: "Research & Development" },
  { id: 7, name: "Customer Support" },
  { id: 8, name: "Operations" }
];

const CreateProject = () => {
  const navigate = useNavigate();
  
  // Project types with icons
  const projectTypes = [
    { value: 'Software', label: 'Software Development' },
    { value: 'Business', label: 'Business' },
    { value: 'Marketing', label: 'Marketing' },
  ];
  
  const [projectData, setProjectData] = useState({
    basicInfo: {
      name: '',
      key: '',
      type: '',
      description: '',
      department: null
    },
    team: {
      lead: null,
      projectManagers: [],
      technicalLeads: [],
      members: []
    },
    timeline: {
      startDate: '',
      endDate: '',
    }
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  // Load employees from API when component mounts
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true);
        // Use the correct endpoint based on your router
        try {
          const response = await axios.get(`${API_URL}/projects/employees/selection`);
          if (response.data && response.data.data) {
            setEmployeeOptions(response.data.data);
          } else {
            setEmployeeOptions([]);
          }
        } catch (error) {
          console.error("Error fetching employees:", error);
          // Fallback with dummy data if endpoint doesn't exist
          setEmployeeOptions([
            { id: 1, name: "John Doe", email: "john@example.com", role: "Developer" },
            { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Project Manager" },
            { id: 3, name: "Michael Brown", email: "michael@example.com", role: "Technical Lead" },
            { id: 4, name: "Emily Wilson", email: "emily@example.com", role: "UI/UX Designer" },
            { id: 5, name: "David Johnson", email: "david@example.com", role: "Technical Lead" },
            { id: 6, name: "Sarah Miller", email: "sarah@example.com", role: "Project Manager" },
            { id: 7, name: "Robert Taylor", email: "robert@example.com", role: "Developer" },
            { id: 8, name: "Lisa Anderson", email: "lisa@example.com", role: "QA Engineer" }
          ]);
        }
      } finally {
        setLoadingEmployees(false);
      }
    };
    
    fetchEmployees();
  }, []);
  
  const handleChange = (e, section, field) => {
    setProjectData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: e.target.value
      }
    }));
    
    // Clear error when field is edited
    if (errors[`${section}.${field}`]) {
      setErrors({
        ...errors,
        [`${section}.${field}`]: ''
      });
    }
  };
  
  const handleLeadChange = (event, newValue) => {
    setProjectData(prev => ({
      ...prev,
      team: {
        ...prev.team,
        lead: newValue
      }
    }));
    
    // Clear error when field is edited
    if (errors['team.lead']) {
      setErrors({
        ...errors,
        'team.lead': ''
      });
    }
  };
  
  const handleDepartmentChange = (event, newValue) => {
    setProjectData(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        department: newValue
      }
    }));
    
    if (errors['basicInfo.department']) {
      setErrors({
        ...errors,
        'basicInfo.department': ''
      });
    }
  };
  
  const handleProjectManagersChange = (event, newValue) => {
    setProjectData(prev => ({
      ...prev,
      team: {
        ...prev.team,
        projectManagers: newValue
      }
    }));
    
    if (errors['team.projectManagers']) {
      setErrors({
        ...errors,
        'team.projectManagers': ''
      });
    }
  };
  
  const handleTechnicalLeadsChange = (event, newValue) => {
    setProjectData(prev => ({
      ...prev,
      team: {
        ...prev.team,
        technicalLeads: newValue
      }
    }));
    
    if (errors['team.technicalLeads']) {
      setErrors({
        ...errors,
        'team.technicalLeads': ''
      });
    }
  };
  
  const handleTeamMembersChange = (event, newValue) => {
    setProjectData(prev => ({
      ...prev,
      team: {
        ...prev.team,
        members: newValue
      }
    }));
  };
  
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;
    
    if (!projectData.basicInfo.name.trim()) {
      newErrors['basicInfo.name'] = 'Project name is required';
      isValid = false;
    }
    
    if (!projectData.basicInfo.key.trim()) {
      newErrors['basicInfo.key'] = 'Project key is required';
      isValid = false;
    } else if (!/^[A-Z0-9]{2,10}$/.test(projectData.basicInfo.key)) {
      newErrors['basicInfo.key'] = 'Project key must be 2-10 uppercase letters or numbers';
      isValid = false;
    }
    
    if (!projectData.basicInfo.type) {
      newErrors['basicInfo.type'] = 'Project type is required';
      isValid = false;
    }
    
    if (!projectData.basicInfo.department) {
      newErrors['basicInfo.department'] = 'Department is required';
      isValid = false;
    }
    
    if (!projectData.team.lead) {
      newErrors['team.lead'] = 'Project lead is required';
      isValid = false;
    }
    
    if (projectData.team.projectManagers.length < 1) {
      newErrors['team.projectManagers'] = 'At least one project manager is required';
      isValid = false;
    }
    
    if (projectData.team.technicalLeads.length < 1) {
      newErrors['team.technicalLeads'] = 'At least one technical lead is required';
      isValid = false;
    }
    
    if (projectData.timeline.startDate && projectData.timeline.endDate && 
        new Date(projectData.timeline.startDate) > new Date(projectData.timeline.endDate)) {
      newErrors['timeline.endDate'] = 'End date must be after start date';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setLoading(true);
        
        // Prepare the data in a format expected by the API
        const formattedData = {
          name: projectData.basicInfo.name,
          key: projectData.basicInfo.key,
          type: projectData.basicInfo.type,
          description: projectData.basicInfo.description || '',
          department: projectData.basicInfo.department ? projectData.basicInfo.department.name : '',
          projectLead: projectData.team.lead ? projectData.team.lead.name : '',
          projectManagers: projectData.team.projectManagers.map(manager => manager.name),
          technicalLeads: projectData.team.technicalLeads.map(lead => lead.name),
          teamMembers: projectData.team.members.map(member => member.name),
          startDate: projectData.timeline.startDate || null,
          endDate: projectData.timeline.endDate || null
        };
        
        console.log("Sending data to API:", formattedData);
        
        try {
          // Try making the API call with error handling
          const response = await axios.post(`${API_URL}/projects`, formattedData);
          
          setSnackbarOpen(true);
          setErrorMessage('');
          
          // Redirect to all projects page after successful creation
          setTimeout(() => {
            navigate('/active-projects');
          }, 1500);
        } catch (apiError) {
          // Handle specifically API errors
          console.error("API Error:", apiError);
          
          let message = "Failed to create project. Please try again.";
          
          if (apiError.response) {
            // Server responded with error
            if (apiError.response.status === 500) {
              message = "Internal server error. Please check your backend service.";
            } else if (apiError.response.data && apiError.response.data.message) {
              message = apiError.response.data.message;
            } else if (apiError.response.data && apiError.response.data.error) {
              message = apiError.response.data.error;
            }
          } else if (apiError.request) {
            // No response received
            message = "Unable to connect to the server. Please check if your backend is running.";
          }
          
          setErrorMessage(message);
          setSnackbarOpen(true);
          
          // If in development, provide a workaround
          if (process.env.NODE_ENV === 'development') {
            console.log("Development mode detected - would have created:", formattedData);
            // Optionally implement local storage fallback or other development workarounds
          }
        }
      } catch (error) {
        console.error("General error:", error);
        setErrorMessage("An unexpected error occurred");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Get all employees except those already selected in other roles
  const getAvailableEmployees = (excludeRole) => {
    let excludedIds = [];
    
    if (excludeRole !== 'lead' && projectData.team.lead) {
      excludedIds.push(projectData.team.lead.id);
    }
    
    if (excludeRole !== 'projectManagers') {
      projectData.team.projectManagers.forEach(pm => excludedIds.push(pm.id));
    }
    
    if (excludeRole !== 'technicalLeads') {
      projectData.team.technicalLeads.forEach(tl => excludedIds.push(tl.id));
    }
    
    if (excludeRole !== 'members') {
      projectData.team.members.forEach(m => excludedIds.push(m.id));
    }
    
    return employeeOptions.filter(emp => !excludedIds.includes(emp.id));
  };

  return (
    <Box sx={{ maxWidth: 1500, margin: "auto", padding: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom align="center" fontWeight="bold" sx={{ flexGrow: 1 }}>
          Create New Project
        </Typography>
      </Box>
      
      <>
        {/* Project Information Section */}
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BusinessIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" gutterBottom>Project Information</Typography>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project Name"
                value={projectData.basicInfo.name}
                onChange={(e) => handleChange(e, "basicInfo", "name")}
                required
                error={!!errors['basicInfo.name']}
                helperText={errors['basicInfo.name']}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project Key"
                value={projectData.basicInfo.key}
                onChange={(e) => handleChange(e, "basicInfo", "key")}
                required
                error={!!errors['basicInfo.key']}
                helperText={errors['basicInfo.key'] || 'Used as a prefix for your project tasks (e.g., PRJ)'}
                placeholder="e.g., PRJ"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors['basicInfo.type']}>
                <InputLabel>Project Type</InputLabel>
                <Select
                  value={projectData.basicInfo.type}
                  label="Project Type"
                  onChange={(e) => handleChange(e, "basicInfo", "type")}
                >
                  {projectTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ mr: 1 }}>{type.icon}</Typography>
                        {type.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors['basicInfo.type'] && (
                  <FormHelperText>{errors['basicInfo.type']}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
           
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={projectData.basicInfo.description}
                onChange={(e) => handleChange(e, "basicInfo", "description")}
                placeholder="Describe the purpose and goals of this project"
              />
            </Grid>
          </Grid>
        </Paper>
        
        {/* Team Assignment Section */}
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <GroupIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" gutterBottom>Team Assignment</Typography>
          </Box>
          <Grid container spacing={3}>
            {/* Project Lead */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors['team.lead']}>
                <Autocomplete
                  options={getAvailableEmployees('lead')}
                  loading={loadingEmployees}
                  value={projectData.team.lead}
                  onChange={handleLeadChange}
                  getOptionLabel={(option) => option.name || ""}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Project Lead"
                      required
                      error={!!errors['team.lead']}
                      helperText={errors['team.lead']}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingEmployees ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            
            {/* Project Managers */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors['team.projectManagers']}>
                <Autocomplete
                  multiple
                  options={getAvailableEmployees('projectManagers')}
                  loading={loadingEmployees}
                  value={projectData.team.projectManagers}
                  onChange={handleProjectManagersChange}
                  getOptionLabel={(option) => option.name || ""}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Project Manager"
                      placeholder="Add project manager"
                      required
                      error={!!errors['team.projectManagers']}
                      helperText={errors['team.projectManagers'] }
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <ManagerIcon color="action" sx={{ mr: 1 }} />
                            {params.InputProps.startAdornment}
                          </>
                        ),
                        endAdornment: (
                          <>
                            {loadingEmployees ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        avatar={
                          <Avatar
                            alt={option.name}
                            src={option.avatar || "/api/placeholder/40/40"}
                            sx={{ width: 24, height: 24 }}
                          />
                        }
                        label={option.name}
                        {...getTagProps({ index })}
                        key={option.id}
                      />
                    ))
                  }
                />
              </FormControl>
            </Grid>
            
           
            
            {/* Team Members */}
            <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                options={getAvailableEmployees('members')}
                loading={loadingEmployees}
                value={projectData.team.members}
                onChange={handleTeamMembersChange}
                getOptionLabel={(option) => option.name || ""}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Team Members"
                    placeholder="Add team members"
                    helperText="Select additional team members"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingEmployees ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      avatar={
                        <Avatar
                          alt={option.name}
                          src={option.avatar || "/api/placeholder/40/40"}
                          sx={{ width: 24, height: 24 }}
                        />
                      }
                      label={option.name}
                      {...getTagProps({ index })}
                      key={option.id}
                    />
                  ))
                }
              />
            </Grid>
          </Grid>
        </Paper>
        
        {/* Project Timeline Section */}
        <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" gutterBottom>Project Timeline</Typography>
          </Box>
          
          {/* Two fields in one line */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={projectData.timeline.startDate}
                onChange={(e) => handleChange(e, "timeline", "startDate")}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Target End Date"
                type="date"
                value={projectData.timeline.endDate}
                onChange={(e) => handleChange(e, "timeline", "endDate")}
                InputLabelProps={{ shrink: true }}
                error={!!errors['timeline.endDate']}
                helperText={errors['timeline.endDate']}
              />
            </Grid>
          </Grid>
        </Paper>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button 
            variant="outlined" 
            color="inherit" 
            onClick={() => navigate('/projects')}
            disabled={loading}
            startIcon={<ArrowBackIcon />}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSubmit}
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckIcon />}
          >
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </Box>
      </>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={errorMessage ? "error" : "success"}
          sx={{ width: '100%' }}
        >
          {errorMessage || "Project created successfully!"}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateProject;