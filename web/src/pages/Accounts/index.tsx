import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Toolbar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState, useEffect } from "react";
import { AccountModel } from "../../models/AccountModel";
import { makeRequest } from "../../utils";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

function Accounts() {
  const [accounts, setAccounts] = useState<undefined | AccountModel[]>(
    undefined
  );
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const [newAccountFormData, setNewAccountFormData] = useState<AccountModel>({
    name: "",
    startingBalance: 0,
  });

  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] =
    useState<boolean>(false);
  const [deleteAccountId, setDeleteAccountId] = useState<number>(0);

  const closeDialog = () => {
    setDialogOpen(false);
    setNewAccountFormData({ name: "", startingBalance: 0 });
  };

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDeleteAccountDialog = () => {
    setDeleteAccountDialogOpen(false);
    setDeleteAccountId(0);
  };

  const openDeleteAccountDialog = (accountId: number) => {
    setDeleteAccountId(accountId);
    setDeleteAccountDialogOpen(true);
  };

  const submitForm = async () => {
    try {
      const data = await makeRequest<AccountModel>(
        "/accounts",
        "POST",
        JSON.stringify(newAccountFormData)
      );
      setAccounts([...(accounts as AccountModel[]), data]);
      closeDialog();
    } catch (error) {
      console.log(error);
    }
  };

  const submitDeleteAccount = async () => {
    try {
      await makeRequest<AccountModel>(`/accounts/${deleteAccountId}`, "DELETE");
      setAccounts(
        accounts?.filter((account) => account.id !== deleteAccountId)
      );
      closeDeleteAccountDialog();
    } catch (error) {
      console.log(error);
    }
  };

  const updateNewAccountFormData = (e: any, property: string) => {
    setNewAccountFormData({
      ...newAccountFormData,
      [property]: e.target.value,
    });
  };

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
      <Toolbar variant="dense">
        <Button variant="outlined" startIcon={<AddIcon />} onClick={openDialog}>
          Add
        </Button>
      </Toolbar>
      <Dialog
        open={deleteAccountDialogOpen}
        onClose={closeDeleteAccountDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>Delete account?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This is irreversible
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteAccountDialog}>Disagree</Button>
          <Button onClick={submitDeleteAccount} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>Add a new account</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Account Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newAccountFormData.name}
            onChange={(e) => updateNewAccountFormData(e, "name")}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Starting Balance"
            type="number"
            fullWidth
            variant="outlined"
            value={newAccountFormData.startingBalance}
            onChange={(e) => updateNewAccountFormData(e, "startingBalance")}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={submitForm}>Submit</Button>
        </DialogActions>
      </Dialog>

      {!accounts ? (
        <>Loading</>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Starting Balance
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts?.map((account) => (
              <TableRow>
                <TableCell>{account.name}</TableCell>
                <TableCell>{account.startingBalance}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    onClick={() =>
                      openDeleteAccountDialog(account.id as number)
                    }
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}{" "}
          </TableBody>
        </Table>
      )}
    </>
  );
}

export default Accounts;
