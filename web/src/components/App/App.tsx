import './App.css';
import { Toolbar } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import Sidebar from './Sidebar';

function App() {
  return (
    <>
      <Navigation />
      <Toolbar />
      <Grid container spacing={2}>
        <Grid xs={2}>
          <Sidebar />
        </Grid>
        <Grid xs={10}>
          <Outlet />
        </Grid>
      </Grid>
    </>
  );
}

export default App;
