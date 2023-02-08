import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Toolbar,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { EventModel } from '../../models/EventModel';
import { makeRequest } from '../../utils';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const defaultValues: EventModel = {
  name: '',
  startDate: (new Date()).toISOString(),
  frequency: 'monthly',
  amount: 0,
  expenseType: 'expense',
  dayOfMonth: 1,
} as EventModel;

function Events() {
  const [events, setEvents] = useState<undefined | EventModel[]>(undefined);

  const [newEventDialogOpen, setNewEventDialogOpen] = useState<boolean>(false);

  const [newEventFormData, setNewEventFormData] = useState<EventModel>({} as EventModel);
  const [deleteEventDialogOpen, setDeleteEventDialogOpen] =
    useState<boolean>(false);
  const [deleteEventId, setDeleteEventId] = useState<number>(0);

  const closeNewEventDialog = () => {
    setNewEventDialogOpen(false);
    setNewEventFormData({} as EventModel);
  };

  const openNewEventDialog = () => {
    setNewEventFormData({ ...defaultValues });
    setNewEventDialogOpen(true);
  };

  const closeDeleteEventDialog = () => {
    setDeleteEventId(0);
    setDeleteEventDialogOpen(false);
  };

  const openDeleteEventDialog = (accountId: number) => {
    setDeleteEventId(accountId);
    setDeleteEventDialogOpen(true);
  };

  const submitNewEventForm = async () => {
    try {
      const data = await makeRequest<EventModel>(
        '/events',
        'POST',
        JSON.stringify(newEventFormData),
      );
      setEvents([...(events as EventModel[]), data]);
      closeNewEventDialog();
    } catch (error) {
      console.log(error);
    }
  };

  const submitDeleteEventForm = async () => {
    try {
      await makeRequest<EventModel>(`/events/${deleteEventId}`, 'DELETE');
      setEvents(events?.filter((event) => event.id !== deleteEventId));
      closeDeleteEventDialog();
    } catch (error) {
      console.log(error);
    }
  };

  const updateNewEventFormData = (e: any, property: string) => {
    setNewEventFormData({
      ...newEventFormData,
      [property]: e,
    });
  };

  useEffect(() => {
    async function getEventsData() {
      const data = await makeRequest<EventModel[]>('/events');
      setEvents(data);
    }

    if (!events?.length) {
      getEventsData();
    }
  }, []);

  return (
    <>
      <Toolbar variant="dense">
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={openNewEventDialog}
        >
          Add
        </Button>
      </Toolbar>
      <Dialog
        open={deleteEventDialogOpen}
        onClose={closeDeleteEventDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>Delete event?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This is irreversible
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteEventDialog}>Disagree</Button>
          <Button onClick={submitDeleteEventForm} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={newEventDialogOpen} onClose={closeNewEventDialog}>
        <DialogTitle>Add a new event</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Account Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newEventFormData.name}
            onChange={(e) => updateNewEventFormData(e.target.value, 'name')}
          />
          <TextField
            autoFocus
            margin="dense"
            id="amount"
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={newEventFormData.amount}
            onChange={(e) => updateNewEventFormData(e.target.value, 'amount')}
          />

<LocalizationProvider dateAdapter={AdapterDayjs}>
  <DatePicker
    label="Start Date"
    value={newEventFormData.startDate}
    onChange={(e) => updateNewEventFormData(e, 'startDate')}
    renderInput={(params) => <TextField {...params} />}
  />
</LocalizationProvider>

<FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Frequency</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="expenseType"
    value={newEventFormData.frequency}
    label="Age"
    onChange={(e) => updateNewEventFormData(e.target.value, 'frequency')}
  >
    <MenuItem value={'monthly'}>Weekly</MenuItem>
    <MenuItem value={'biweekly'}>Bi-Weekly</MenuItem>
    <MenuItem value={'twicemonthly'}>Twice a month</MenuItem>
    <MenuItem value={'monthly'}>Monthly</MenuItem>
    <MenuItem value={'yearly'}>Yearly</MenuItem>
  </Select>
</FormControl>
          <TextField
            autoFocus
            margin="dense"
            id="dayOfMonth"
            label="Day of Month"
            type="number"
            fullWidth
            variant="outlined"
            value={newEventFormData.dayOfMonth}
            onChange={(e) => updateNewEventFormData(e.target.value, 'dayOfMonth')}
          />
<FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Expense Type</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="expenseType"
    value={newEventFormData.expenseType}
    label="Age"
    onChange={(e) => updateNewEventFormData(e.target.value, 'expenseType')}
  >
        <MenuItem value={'expense'}>Expense</MenuItem>

    <MenuItem value={'income'}>Income</MenuItem>
  </Select>
</FormControl>
<TextField
            autoFocus
            margin="dense"
            id="balance"
            label="Balance"
            type="number"
            fullWidth
            variant="outlined"
            value={newEventFormData.balance}
            onChange={(e) => updateNewEventFormData(e.target.value, 'balance')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeNewEventDialog}>Cancel</Button>
          <Button onClick={submitNewEventForm}>Submit</Button>
        </DialogActions>
      </Dialog>
      {!events ? (
        <>Loading</>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Frequency</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Day of Month</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Expense Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Balance</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events?.map((event) => (
              <TableRow>
                <TableCell>{event.name}</TableCell>
                <TableCell>{event.amount}</TableCell>
                <TableCell>{event.startDate}</TableCell>
                <TableCell>{event.frequency}</TableCell>
                <TableCell>{event.dayOfMonth}</TableCell>
                <TableCell>{event.expenseType}</TableCell>
                <TableCell>{event.balance}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() => openDeleteEventDialog(event.id as number)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
}

export default Events;
