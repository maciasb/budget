import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useState, useEffect } from "react";
import { AccountModel } from "../../models/AccountModel";
import { makeRequest } from "../../utils";

function Accounts() {
  const [accounts, setAccounts] = useState<undefined | AccountModel[]>(undefined);

  useEffect(() => {
    async function getAccountsData() {
      const data = await makeRequest<AccountModel[]>("/accounts");
      setAccounts(data);
    }

    if (!accounts?.length) {
      getAccountsData();
    }
  }, []);
  
  return (
    <>
      {!accounts ? (
        <>Loading</>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Starting Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts?.map((obj) => (
              <TableRow>
                <TableCell>{obj.name}</TableCell>
                <TableCell>{obj.startingBalance}</TableCell>
              </TableRow>
            ))}{" "}
          </TableBody>
        </Table>
      )}
    </>
  );
}

export default Accounts;
