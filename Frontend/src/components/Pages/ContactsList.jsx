import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Menu, MenuItem, Paper, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Select, MenuItem as SelectItem, FormControl, InputLabel } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AxiosInstance from "../configuration/Axios.jsx";
import { format } from 'date-fns';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import OpacityIcon from '@mui/icons-material/Opacity';
import AirIcon from '@mui/icons-material/Air';
import Star from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';

const ContactsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    city: '',
    status: ''
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [statuses, setStatuses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const validateForm = () => {
    const nameRegex = /^[A-Za-z]{1,50}$/;
    const lastNameRegex = /^[A-Za-z]{1,100}$/;
    const phoneRegex = /^\+?\d{1,12}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cityRegex = /^.{0,100}$/;

    return (
      nameRegex.test(formData.first_name) &&
      lastNameRegex.test(formData.last_name) &&
      phoneRegex.test(formData.phone_number) &&
      emailRegex.test(formData.email) &&
      cityRegex.test(formData.city)
    );
  };

  const fetchWeather = async (city) => {
    try {
      // Get coordinates
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`);
      const geoData = await geoRes.json();
      if (!geoData.length) return 'unknown';
      const { lat, lon } = geoData[0];

      // Fetch weather with humidity and wind speed
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m&timezone=auto`);
      const weatherData = await weatherRes.json();

      if (!weatherData.current_weather) return 'unknown';

      const temperature = weatherData.current_weather.temperature;
      const windspeed = weatherData.current_weather.windspeed;

      // Get current hour index to find humidity
      const currentTime = weatherData.current_weather.time;
      const currentHour = currentTime.slice(0, 13) + ":00";
      const humidityIndex = weatherData.hourly.time.indexOf(currentHour);
      const humidity = humidityIndex !== -1 ? weatherData.hourly.relative_humidity_2m[humidityIndex] : 'N/A';

      return (
        <>
          <WbSunnyIcon sx={{ color: "warning.main" }}/>: {temperature}°C, <OpacityIcon sx={{ color: "blue"}} />: {humidity}%, <AirIcon sx={{ color: "text.disabled" }}/>: {windspeed} km/h
        </>
      );
    } catch (err) {
      return err;
    }
  };

  const fetchStatuses = async () => {
    try {
      const response = await AxiosInstance.get('/api/contact-statuses/');
      setStatuses(response.data);
    } catch (error) {
      console.error("Error fetching statuses:", error);
      alert("Failed to fetch statuses. Check console for more details.");
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    try {
      const res = await AxiosInstance.get('/api/contacts-display');
      const rawContacts = res.data.map(contact => ({
        ...contact,
        weather: 'Loading...', // Placeholder
        addDate: contact.add_contact_date
      }));

      setContacts(rawContacts);
      setIsLoading(false);

      const contactsWithWeather = await Promise.all(
        rawContacts.map(async (contact) => {
          const weather = await fetchWeather(contact.city);
          return { ...contact, weather };
        })
      );

      setContacts(contactsWithWeather); // Update contacts with weather
  } catch (err) {
    console.error("Failed to fetch contacts:", err);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    getData();
  },[])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddNew = () => {
    setIsUpdateMode(false);
    setFormData({ first_name: '', last_name: '', phone_number: '', email: '', city: '', status: '' });
    setShowForm(true);
    setSelectedIndex(null);
  };

  const handleConfirm = async () => {
    if (!validateForm()) return alert("Form data is invalid. Please check your input.");

    try {
      const response = await AxiosInstance.post('/api/contacts/', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        email: formData.email,
        city: formData.city,
        status: formData.status,
        add_contact_date: format(new Date(), 'yyyy-MM-dd') // Get current date
      });

      const newContact = response.data;

      // Fetch weather and update UI
      const weather = await fetchWeather(formData.city);

      const contactWithWeather = {
        ...newContact,
        weather,
        addDate: newContact.add_contact_date
      };

      setContacts([...contacts, contactWithWeather]);

      setFormData({ first_name: '', last_name: '', phone_number: '', email: '', city: '', status: '' });
      setShowForm(false);
      setSelectedIndex(null);

    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
      alert("Failed to submit contact. Check console for more details.");
    }
  };

  const handleMenuClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
    // Get the ID of the contact to be deleted
    const contactToDelete = contacts[selectedIndex];

    // Check ID isn't missing
    if (!contactToDelete || !contactToDelete.id) {
      alert("Contact ID is missing. Cannot delete.");
      return;
    }

    await AxiosInstance.delete(`/api/contacts/${contactToDelete.id}/`);

    // If deletion is successful update the contacts
    const updatedContacts = contacts.filter((_, i) => i !== selectedIndex);
    setContacts(updatedContacts);

    setAnchorEl(null);
    setSelectedIndex(null);
  } catch (error) {
    console.error('Error deleting contact:', error.response?.data || error.message);
    alert("Failed to delete contact. Check console for more details.");
  }
  };

  const handleUpdate = () => {
    const contact = contacts[selectedIndex];
    const { first_name, last_name, phone_number, email, city, status, id } = contact;
    setIsUpdateMode(true);
    setFormData({ first_name, last_name, phone_number, email, city, status });
    setEditingId(id)
    setShowForm(true);
    setAnchorEl(null);
  };

  const confirmUpdate = async () => {
    if (!validateForm()) return alert("Form data is invalid. Please check your input.");

    try {
        const response = await AxiosInstance.put(`/api/contacts/${editingId}/`, {
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone_number: formData.phone_number,
            email: formData.email,
            city: formData.city,
            status: formData.status,
            add_contact_date: format(new Date(), 'yyyy-MM-dd')// This should match an existing name in ContactsStatusChoices
        });

        const updatedContact = response.data;

        // Find the original contact to preserve addDate
        const originalContact = contacts.find(contact => contact.id === editingId);

        const contactWithWeather = {
            ...updatedContact,
            weather: await fetchWeather(formData.city), // Fetch new weather
            addDate: originalContact.addDate // Keep existing addDate
        };

        // Update the contacts
        const updatedContacts = contacts.map(contact =>
            contact.id === editingId ? contactWithWeather : contact
        );

        setContacts(updatedContacts);
        setFormData({ first_name: '', last_name: '', phone_number: '', email: '', city: '', status: '' });
        setIsUpdateMode(false);
        setEditingId(null);
        setShowForm(false);
        setSelectedIndex(null);

    } catch (error) {
        console.error('Error submitting form:', error.response?.data || error.message);
        alert("Failed to submit contact. Check console for more details.");
    }
  };

  const toggleFavorite = async (index) => {
    const updatedContacts = [...contacts];
  const contact = updatedContacts[index];
  const newFavoriteStatus = !contact.favorite;

  try {
    const response = await AxiosInstance.patch(`/api/contacts/${contact.id}/`, {
      favorite: newFavoriteStatus,
    });

    const updatedContact = {
      ...response.data,
      addDate: contact.addDate, // Keep existing add date
      weather: contact.weather, // Keep existing weather
    };

    updatedContacts[index] = updatedContact;
    setContacts(updatedContacts);
  } catch (error) {
    console.error('Failed to update favorite status:', error);
    alert('Failed to update favorite status.');
  }
  };

  const handleSort = (field) => {
    const isAsc = sortBy === field && sortDirection === 'asc';
    setSortBy(field);
    setSortDirection(isAsc ? 'desc' : 'asc');
  };

  const sortedContacts = [...contacts];
  if (sortBy) {
    sortedContacts.sort((a, b) => {
      const valA = a[sortBy] || '';
      const valB = b[sortBy] || '';
      return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', padding: 2, background: "linear-gradient(135deg, #2196F3 30%, #E3F2FD 90%)", minHeight: "100vh" }}>
      <Box sx={{ flex: 3, marginRight: 2 }}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Your contacts list</Typography>
            <Button variant="contained" onClick={handleAddNew}>add new</Button>
          </Box>

          <TableContainer>
            <Table>
              {isLoading ? (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="body1">Loading contacts...</Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
              ) : (
                  <>
              <TableHead>
                <TableRow>
                  <TableCell><strong>First name</strong></TableCell>
                  <TableCell><TableSortLabel active={sortBy === 'last_name'} direction={sortDirection} onClick={() => handleSort('last_name')}><strong>Last name</strong></TableSortLabel></TableCell>
                  <TableCell><strong>Phone number</strong></TableCell>
                  <TableCell><strong>e-mail</strong></TableCell>
                  <TableCell><strong>City</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Weather</strong></TableCell>
                  <TableCell><strong>Favorite</strong></TableCell>
                  <TableCell><TableSortLabel active={sortBy === 'addDate'} direction={sortDirection} onClick={() => handleSort('addDate')}><strong>Add date</strong></TableSortLabel></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedContacts.map((contact, index) => (
                  <TableRow key={contact.id || index}>
                    <TableCell>{contact.first_name}</TableCell>
                    <TableCell>{contact.last_name}</TableCell>
                    <TableCell>{contact.phone_number}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.city}</TableCell>
                    <TableCell>{contact.status}</TableCell>
                    <TableCell>{contact.weather}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => toggleFavorite(index)}>
                        {contact.favorite ? (
                          <Star sx={{ color: "warning.main" }} />
                        ) : (
                          <StarBorder sx={{ color: "warning.main" }} />
                        )}
                  </IconButton></TableCell>
                    <TableCell>{contact.addDate ? format(new Date(contact.addDate), 'yyyy-MM-dd') : ''}</TableCell>
                    <TableCell>
                      <IconButton onClick={(event) => handleMenuClick(event, index)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
                </>
              )}
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <Box sx={{ flex: 1 }}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          {!showForm ? (
            <Typography variant="body1">
              Click "add new" to add a contact or select a contact to update.
            </Typography>
          ) : (
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField name="first_name" label="First name" value={formData.first_name} onChange={handleInputChange} />
              <TextField name="last_name" label="Last name" value={formData.last_name} onChange={handleInputChange} />
              <TextField name="phone_number" label="Phone number" value={formData.phone_number} onChange={handleInputChange} />
              <TextField name="email" label="e-mail" value={formData.email} onChange={handleInputChange} />
              <TextField name="city" label="City" value={formData.city} onChange={handleInputChange} />
              <FormControl fullWidth>
                <InputLabel>status</InputLabel>
                <Select name="status" value={formData.status} onChange={handleInputChange} label="Status">
                  {statuses.map((status) => (
                    <SelectItem key={status.id} value={status.name}>{status.name}</SelectItem>
                  ))}
                </Select>
              </FormControl>
              {isUpdateMode ? (
                <Button variant="contained" color="primary" onClick={confirmUpdate}>
                  Update
                </Button>
              ) : (
                <Button variant="contained" color="success" onClick={handleConfirm}>
                  Create
                </Button>
              )}
            </Box>
          )}
        </Paper>
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleUpdate}>Update</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </Box>
  );
};

export default ContactsPage;
