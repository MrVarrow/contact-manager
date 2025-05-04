import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const FavoriteContacts = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/favorite-contacts/')
      .then(response => {
        setContacts(response.data);
      })
      .catch(error => {
        console.error('Error fetching contacts:', error);
      });
  }, []);

  return (
    <Box sx={{ width: '100%', display: 'flex', padding: 2, background: "linear-gradient(135deg, #2196F3 30%, #E3F2FD 90%)", minHeight: "100vh" }}>

      <Box flexGrow={1} p={3}>
        <Typography variant="h6" align="center" fontWeight="bold" gutterBottom>
          List of your favorite contacts
        </Typography>

        <TableContainer component={Paper} sx={{ maxWidth: 1000, mx: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Full name</strong></TableCell>
                <TableCell><strong>e-mail</strong></TableCell>
                <TableCell><strong>Phone number</strong></TableCell>
                <TableCell><strong>City</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Add date</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>{contact.first_name} {contact.last_name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone_number}</TableCell>
                  <TableCell>{contact.city}</TableCell>
                  <TableCell>{contact.status}</TableCell>
                  <TableCell>{format(new Date(contact.add_contact_date), 'yyyy-MM-dd')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default FavoriteContacts;