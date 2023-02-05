import "./App.css";
import {
  AppBar,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div">
            Budget Projection
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Grid container spacing={2}>
        <Grid xs={2}>
          <List>
            <ListItem disablePadding component={Link} to="/">
              <ListItemButton>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding component={Link} to="/report">
              <ListItemButton>
                <ListItemText primary="Report" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding component={Link} to="/accounts">
              <ListItemButton>
                <ListItemText primary="Accounts" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding component={Link} to="/events">
              <ListItemButton>
                <ListItemText primary="Events" />
              </ListItemButton>
            </ListItem>
          </List>
        </Grid>
        <Grid xs={10}>
          <Outlet />
        </Grid>
      </Grid>
    </>
  );
}

export default App;
