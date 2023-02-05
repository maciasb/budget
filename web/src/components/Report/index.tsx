import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useState, useEffect } from "react";
import { EventModel } from "../../models/event-model";
import { makeRequest } from "../../utils";

function Report() {
  const [events, setEvents] = useState<undefined | EventModel[]>(undefined);

  useEffect(() => {
    async function getEventsData() {
      const data = await makeRequest<EventModel[]>("/budget");
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
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Running Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events?.map((obj: any) => (
              <TableRow>
                <TableCell>{obj.date}</TableCell>
                <TableCell>{obj.name}</TableCell>
                <TableCell>{obj.amount}</TableCell>
                <TableCell>{obj.runningTotal}</TableCell>
              </TableRow>
            ))}{" "}
          </TableBody>
        </Table>
      )}
    </>
  );
}

export default Report;
