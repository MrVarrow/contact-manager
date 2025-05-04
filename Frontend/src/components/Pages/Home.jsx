import React from 'react';
import animationData from "../../assets/contacts_lottie_animation.json"
import { Box, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #2196F3 30%, #E3F2FD 90%)",
        color: "white",
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Typography variant="h4" fontWeight="bold">
          Start your journey with Contact manager
        </Typography>
      </motion.div>

      <Box sx={{ mt: 4, width: "400px"}}>
        <Lottie animationData={animationData} loop autoplay />
      </Box>

      <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
        <motion.div whileHover={{ scale: 1.1 }}>
            <Link to="/contacts-list" style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="primary" size="large" to="/signup">
                Your contacts list →
              </Button>
            </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.1 }}>
            <Link to="/favorites" style={{ textDecoration: 'none' }}>
              <Button variant="outlined" color="inherit" size="large">
                Favorite contacts →
              </Button>
            </Link>
        </motion.div>
      </Box>
    </Box>
  );
};

export default Home;