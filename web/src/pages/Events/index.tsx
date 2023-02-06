import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useState, useEffect } from "react";
import { EventModel } from "../../models/EventModel";
import { makeRequest } from "../../utils";

function Events() {
  const [events, setEvents] = useState<undefined | EventModel[]>(undefined);

  useEffect(() => {
    async function getEventsData() {
      const data = await makeRequest<EventModel[]>("/events");
      setEvents(data);
    }

    if (!events?.length) {
      getEventsData();
    }
  }, []);

  return (
    <>
      {!events ? (
        <>Loading</>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Frequency</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Day of Month</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Expense Type</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events?.map((obj) => (
              <TableRow>
                <TableCell>{obj.name}</TableCell>
                <TableCell>{obj.amount}</TableCell>
                <TableCell>{obj.startDate}</TableCell>
                <TableCell>{obj.frequency}</TableCell>
                <TableCell>{obj.dayOfMonth}</TableCell>
                <TableCell>{obj.expenseType}</TableCell>
                <TableCell>{obj.balance}</TableCell>
              </TableRow>
            ))}{" "}
          </TableBody>
        </Table>
      )}
    </>
  );
}

export default Events;
