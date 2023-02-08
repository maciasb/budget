import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
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
  );
}

export default Sidebar;
