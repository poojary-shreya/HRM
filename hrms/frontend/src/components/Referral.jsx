import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Referral = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    experience: '',
    positionApplied: '',
    noticePeriod: '',
    referralreason:'',
    referrerName: '',
    referrerEmail: '',
    referrerRelation: ''
  });
  
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingReferrerInfo, setLoadingReferrerInfo] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });


  useEffect(() => {
    const fetchReferrerInfo = async () => {
      try {
        setLoadingReferrerInfo(true);

        const sessionDebug = await axios.get('http://localhost:5000/api/refer/debug-session', {
          withCredentials: true
        });
        console.log('Session debug:', sessionDebug.data);
        const response = await axios.get('http://localhost:5000/api/refer/referrer/info', {withCredentials: true});
        
        setFormData(prevFormData => ({
          ...prevFormData,
          referrerName: response.data.referrerName || '',
          referrerEmail: response.data.referrerEmail || ''
        }));
      } catch (error) {
        console.error('Error fetching referrer info:', error);
        setSnackbar({
          open: true,
          message: 'Failed to fetch your information. Please fill in your details manually.',
          severity: 'warning'
        });
      } finally {
        setLoadingReferrerInfo(false);
      }
    };

    fetchReferrerInfo();
    fetchAvailableJobs();
  }, []);


  const fetchAvailableJobs = async () => {
    try {
      setLoadingJobs(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/jobpost/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
  
      const openJobs = response.data.jobs.filter(job => {
        const closingDate = new Date(job.jobClosedDate);
        const today = new Date();
        return closingDate > today;
      });
      
      setAvailableJobs(openJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch available positions. Please try again.",
        severity: "error",
      });
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'skills') {
          const skillsArray = formData[key].split(',').map(skill => skill.trim()).filter(skill => skill !== '');
          formDataToSend.append(key, JSON.stringify(skillsArray));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      if (file) {
        formDataToSend.append('resume', file);
      }

      const response = await axios.post('http://localhost:5000/api/refer/create', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      
      setSnackbar({
        open: true,
        message: 'Candidate referred successfully!',
        severity: 'success'
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        skills: '',
        experience: '',
        positionApplied: '',
        noticePeriod: '',
        referrerName: formData.referrerName,
        referrerEmail: formData.referrerEmail,
        referrerRelation: ''
      });
      setFile(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to create referral',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Refer a Candidate
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1, mb: 2 }}>
            Candidate Information
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                id="phone"
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="skills"
                name="skills"
                label="Skills"
                placeholder="e.g. React, JavaScript, Node.js"
                value={formData.skills}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                id="experience"
                label="Years of Experience"
                name="experience"
                type="number"
                value={formData.experience}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="notice-period-label">Notice Period</InputLabel>
                <Select
                  labelId="notice-period-label"
                  id="noticePeriod"
                  name="noticePeriod"
                  value={formData.noticePeriod}
                  label="Notice Period"
                  onChange={handleChange}
                >
                  <MenuItem value="Immediate">Immediate</MenuItem>
                  <MenuItem value="15 days">15 days</MenuItem>
                  <MenuItem value="30 days">30 days</MenuItem>
                  <MenuItem value="60 days">60 days</MenuItem>
                  <MenuItem value="90 days">90 days</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="position-applied-label">Position Applied For</InputLabel>
                <Select
                  labelId="position-applied-label"
                  id="positionApplied"
                  name="positionApplied"
                  value={formData.positionApplied}
                  label="Position Applied For"
                  onChange={handleChange}
                  disabled={loadingJobs}
                >
                  {loadingJobs ? (
                    <MenuItem value="">
                      <CircularProgress size={20} /> Loading positions...
                    </MenuItem>
                  ) : availableJobs.length > 0 ? (
                    availableJobs.map((job) => (
                      <MenuItem key={job.id} value={job.jobTitle}>
                        {job.jobTitle} - {job.jobId}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="">No open positions available</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="referralreason"
                label="Reason for Referral"
                name="referralreason"
                multiline
                rows={3}
                value={formData.referralreason}
                onChange={handleChange}
                placeholder="Why do you think this candidate would be a good fit?"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
              >
                Upload Resume
                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </Button>
              {file && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Selected file: {file.name}
                </Typography>
              )}
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1, mb: 2, mt: 4 }}>
            Referrer Information
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                id="referrerName"
                label="Your Name"
                name="referrerName"
                value={formData.referrerName}
                onChange={handleChange}
                disabled={loadingReferrerInfo}
                helperText={loadingReferrerInfo ? "Loading your information..." : ""}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                id="referrerEmail"
                label="Your Email"
                name="referrerEmail"
                type="email"
                value={formData.referrerEmail}
                onChange={handleChange}
                disabled={loadingReferrerInfo}
                helperText={loadingReferrerInfo ? "Loading your information..." : ""}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="referrerRelation"
                label="Relationship to Candidate"
                name="referrerRelation"
                value={formData.referrerRelation}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading || loadingReferrerInfo || (availableJobs.length === 0 && !loadingJobs)}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Submitting...' : 'Submit Referral'}
            </Button>
          </Box>
        </Box>
      </Paper>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Referral;