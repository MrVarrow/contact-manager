import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import {Link, useLocation} from "react-router-dom";
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import GradeIcon from '@mui/icons-material/Grade';

export default function Navbar(props) {
    const {drawerWidth, content} = props
    const location = useLocation()
    const path = location.pathname

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "0 20px",
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
            Contact manager
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box'},
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>

              <ListItem disablePadding>
                <ListItemButton component={Link} to="/" selected={"/" === path}>
                  <ListItemIcon>
                        <HomeIcon/>
                  </ListItemIcon>
                  <ListItemText primary={"Home"} />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton component={Link} to="/contacts-list" selected={"/contacts-list" === path}>
                  <ListItemIcon>
                        <InfoIcon/>
                  </ListItemIcon>
                  <ListItemText primary={"Contacts List"} />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton component={Link} to="/favorites" selected={"/favorites" === path}>
                  <ListItemIcon>
                        <GradeIcon/>
                  </ListItemIcon>
                  <ListItemText primary={"Favorites"} />
                </ListItemButton>
              </ListItem>

          </List>

        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 0}}>
        <Toolbar />

          {content}

      </Box>
    </Box>
  );
}
