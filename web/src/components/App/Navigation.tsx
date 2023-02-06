import { AppBar, Toolbar, Typography } from "@mui/material";

function Navigation() {
  return (
    <AppBar position="fixed" elevation={0}>
      <Toolbar variant="dense">
        <Typography variant="h6" color="inherit" component="div">
          Budget Projection
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;
