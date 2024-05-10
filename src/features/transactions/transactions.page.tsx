import { Box, Button, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import moment from "moment";
import ClearIcon from '@mui/icons-material/Clear';
import { deleteParsedTransaction, saveTransactions } from "./transactions.slice";

const TransactionsPage = () => {

    const dispatch = useDispatch<any>();
    const { parsedTransactions } = useSelector((state: RootState) => state.transactions);

    const handleDelete = (hashcode: string) => {
        dispatch(deleteParsedTransaction({ hashcode }));
    }

    const handleSave = () => {
        dispatch(saveTransactions({transactions: parsedTransactions!}));
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', mb: 4 }}>
                <Typography variant="h4" sx={{ flex: 1 }}>Transactions</Typography>
                <Button variant="contained" color="primary" size="small" onClick={handleSave}>Save</Button>
            </Box>
            <List>
                {parsedTransactions && parsedTransactions.filter(t => !t.deleted).map((transaction) => (
                    <ListItem key={`${transaction.description}-${transaction.amount}`} divider sx={{ gap: 2 }}>
                        <ListItemText sx={{ flex: 6 }} primary={transaction.description} secondary={moment(transaction.date).format('Do MMM YYYY')} />
                        <ListItemText sx={{ flex: 2, textAlign: 'right', fontWeight: 400 }} primary={<Typography variant="body1">${transaction.amount}</Typography>} />
                        {transaction.bucketName &&
                            <Button sx={{ flex: 2 }} variant="contained" color="success" size="small">{transaction.bucketName}</Button>}
                        {transaction.bucketName === null &&
                            <Button sx={{ flex: 2 }} variant="outlined" size="small">select bucket</Button>}
                        <IconButton size="small" onClick={() => handleDelete(transaction.hashcode)}><ClearIcon fontSize="small" /></IconButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )
}

export { TransactionsPage };