import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { EventModel } from '../../models/EventModel';
import { makeRequest } from '../../utils';

function Report() {
  const [report, setReport] = useState<undefined | EventModel[]>(undefined);

  useEffect(() => {
    async function getReportData() {
      const data = await makeRequest<EventModel[]>('/report');
      setReport(data);
    }

    if (!report?.length) {
      getReportData();
    }
  }, []);

  return (
    <>
      {!report ? (
        <>Loading</>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Running Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {report?.map((obj: any) => (
              <TableRow>
                <TableCell>{obj.date}</TableCell>
                <TableCell>{obj.name}</TableCell>
                <TableCell>{obj.amount}</TableCell>
                <TableCell>{obj.runningTotal}</TableCell>
              </TableRow>
            ))}{' '}
          </TableBody>
        </Table>
      )}
    </>
  );
}

export default Report;
