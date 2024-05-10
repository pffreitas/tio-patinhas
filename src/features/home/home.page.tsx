import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Box, Button, Card, CardActions, CardContent, Drawer, FormControl, IconButton, LinearProgress, List, ListItem, ListItemButton, ListItemText, ListSubheader, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import CircularProgress, {
    circularProgressClasses,
    CircularProgressProps,
} from '@mui/material/CircularProgress';
import moment from 'moment';
import { RootState } from '../../store';
import { deleteTransaction, fetchBuckets, fetchTransactions, fetchTransactionsByMonth, setBucket } from './home.slice';
import { useDispatch, useSelector } from 'react-redux';
import { chain } from 'lodash';
import { formatCurrency, formatPercentage } from '../../components/format';
import ClearIcon from '@mui/icons-material/Clear';
import { Transaction } from '../../models';
import { teal } from '@mui/material/colors';

interface StyledDropzoneProps {
    isDragActive: boolean;
}

const StyledDropzone = styled.div<StyledDropzoneProps>`
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  background-color: ${props => props.isDragActive ? '#e9e9e9' : 'white'};
  display: ${props => props.isDragActive ? 'block' : 'none'};
  transition: background-color 0.3s ease;
`;

const CarouselContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
`

const Carousel = styled.div`
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
`

const CarouselItem = styled.div`
    flex: 0 0 auto;
    width: 275px;
    margin: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    scroll-snap-align: start;
`

const CarouselBackdrop = styled.div`
    position: absolute;
    top: 0;
    width: 275px;
    height: 100%;
    background: rgba(255, 255, 255, 0.55);
    display: flex;
    justify-content: center;
    align-items: center;
`

const Progress = styled.div`
    position: relative;
    overflow: hidden;
    display: block;
    height: 4px;
    z-index: 0;
    background-color: rgb(167, 202, 237);
`

const ProgressBar = styled.div`
`

type ProgressIndicatorProps = {
    progress: number;
    total: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ progress, total }) => {
    const cappedProgress = Math.min(progress, total);
    const overProgress = Math.max(progress - total, 0);

    const percentage = (cappedProgress / progress) * 100;
    const overPercentage = (overProgress / progress) * 100;

    return (
        <Progress>
            <ProgressBar style={{ width: `${percentage}%`, backgroundColor: 'rgb(33, 150, 243)', height: '100%' }}></ProgressBar>
            {overProgress > 0 && <ProgressBar style={{ width: `${overPercentage}%`, backgroundColor: 'rgb(255, 0, 0)', height: '100%' }}></ProgressBar>}
        </Progress>
    )
}

const bull = (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      •
    </Box>
  );


const HomePage = () => {
    const [curentTransaction, setCurrentTransaction] = useState<string | undefined>(undefined);
    const [bucketSheetOpen, setBucketSheetOpen] = useState<boolean>(false);
    const [curentBucket, setCurrentBucket] = useState<string | undefined>(undefined);
    const [bucketDetailsSheetOpen, setBucketDetailsSheetOpen] = useState<boolean>(false);
    const [month, setMonth] = useState<string>(moment().format('MM-YYYY'));

    const dispatch = useDispatch<any>();
    const { buckets } = useSelector((state: RootState) => state.home);
    const { transactions, monthTransactions } = useSelector((state: RootState) => state.home);
    const { loadingSetBucket } = useSelector((state: RootState) => state.home);

    const findTransactionsByBucket = (bucketSlug: string | null, transactions: Transaction[]) => {
        return transactions.filter(t => t.bucketSlug === bucketSlug);
    }

    useEffect(() => {
        dispatch(fetchBuckets());
    }, []);

    useEffect(() => {
        dispatch(fetchTransactions());
        dispatch(fetchTransactionsByMonth(month));
    }, [loadingSetBucket]);


    const openBucketSheet = (transactionId: string | undefined) => {
        setBucketSheetOpen(true);
        setCurrentTransaction(transactionId);
    }

    const closeBucketSheet = () => {
        setBucketSheetOpen(false);
        setCurrentTransaction(undefined);
    }

    const handleOpenBucketDetailsSheet = (bucketId: string | null) => {
        if (bucketId) {
            setBucketDetailsSheetOpen(true);
            setCurrentBucket(bucketId);
        }
    }

    const handleCloseBucketDetailsSheet = () => {
        setBucketDetailsSheetOpen(false);
        setCurrentBucket(undefined);
    }

    const selectBucket = (bucketSlug: string | undefined) => {
        dispatch(setBucket({ transactionId: curentTransaction!, bucketSlug: bucketSlug! }));
        closeBucketSheet();
    }

    const months = moment.months().map((month, index) => ({
        value: moment().month(index).format('MM-YYYY'),
        label: month
    }));

    const handleMonthChange = (event: SelectChangeEvent) => {
        setMonth(event.target.value);
        dispatch(fetchTransactionsByMonth(event.target.value));
    }

    const handleDeleteTransaction = (transactionId: string | undefined) => {
        if (transactionId) {
            dispatch(deleteTransaction({ transactionId }));
        }
    }

    return (
        <>
            <Drawer
                anchor="bottom"
                open={bucketSheetOpen}
                onClose={closeBucketSheet}>
                <Box sx={{ height: '300px', paddingX: 3, marginBottom: '50px' }}>
                    <List>
                        {chain(buckets).groupBy((b) => b.group).map((buckets, group) => (
                            <>
                                <List subheader={
                                    <ListSubheader component="div">
                                        {group}
                                    </ListSubheader>
                                }>
                                    {buckets.map((bucket) => (
                                        <ListItem disablePadding key={bucket.slug}>
                                            <ListItemButton onClick={() => selectBucket(bucket.slug)}>
                                                <ListItemText primary={bucket.name} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </>
                        )).value()}
                    </List>
                </Box>
            </Drawer>
            <Drawer
                anchor="bottom"
                open={bucketDetailsSheetOpen}
                onClose={handleCloseBucketDetailsSheet}>
                <Box sx={{ height: '300px', paddingX: 3, marginBottom: '50px' }}>
                    <List>
                        {chain(transactions).filter(t => t.bucketId === curentBucket).map((transaction) => (
                            <ListItem disablePadding key={transaction.id}>
                                <ListItemText primary={transaction.description} secondary={transaction.date} />
                                <ListItemText primary={formatCurrency(transaction.amount)} />
                                <IconButton size="small" onClick={() => handleDeleteTransaction(transaction.id)}><ClearIcon fontSize="small" /></IconButton>
                            </ListItem>
                        )).value()}
                    </List>
                </Box>
            </Drawer>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Box>
                    <Typography variant="h5">Unbucketed Transactions</Typography>
                    <CarouselContainer>
                        <Carousel>
                            {transactions.filter(t => t.id && t.bucketId === null).map((transaction) => {
                                return (
                                    <CarouselItem key={`carousel-item-${transaction.id}`}>
                                        <Card sx={{ flex: 1, position: 'relative' }}>
                                            <CardContent>
                                                <Box sx={{ height: '100px', display: 'flex', flexDirection: 'column' }}>
                                                    <Typography variant="body2" sx={{ flex: 1 }}>{transaction.description}</Typography>
                                                    <Typography variant="caption" sx={{ textAlign: 'right' }}>{moment(transaction.date.toString()).format('Do MMM YYYY')}</Typography>
                                                    <Typography variant="h5" component="div" sx={{ textAlign: 'right' }}>${transaction.amount}</Typography>
                                                </Box>
                                            </CardContent>
                                            <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <Button size="small" color="error" onClick={() => handleDeleteTransaction(transaction.id)} >Delete</Button>
                                                {transaction.bucketId && <Button size="small" variant='contained' color="success" onClick={() => openBucketSheet(transaction.id)}>{transaction.bucketId}</Button>}
                                                {!transaction.bucketId && <Button size="small" variant='outlined' onClick={() => openBucketSheet(transaction.id)}>Select Bucket</Button>}
                                            </CardActions>
                                            {loadingSetBucket === transaction.id && (
                                                <CarouselBackdrop>
                                                    <CircularProgress color="inherit" />
                                                </CarouselBackdrop>
                                            )}

                                        </Card>
                                    </CarouselItem>
                                )
                            })}
                        </Carousel>
                    </CarouselContainer>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Typography variant="h5">Buckets</Typography>
                        <FormControl size="small">
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={month}
                                label="Month"
                                size='small'
                                onChange={handleMonthChange}
                            >
                                {months.map((month) => (
                                    <MenuItem key={month.value} value={month.value}>{month.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                    </Box>
                    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                        <Card sx={{ backgroudColor: 'cornflowerblue' }}>
                            <CardContent sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <CircularProgress variant="determinate" sx={{ height: '100%', width: 'auto', color: 'rgb(167, 202, 237)' }} value={100} />
                                    <CircularProgress variant="determinate" sx={{
                                        position: 'absolute',
                                        left: 0,
                                        [`& .${circularProgressClasses.circle}`]: {
                                            strokeLinecap: 'round',
                                        },
                                    }} value={chain(monthTransactions).sumBy(t => t.amount).value() / chain(buckets).sumBy(b => b.amount).value() * 100} />
                                    <Box
                                        sx={{
                                            top: 0,
                                            left: 0,
                                            bottom: 0,
                                            right: 0,
                                            position: 'absolute',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            component="div"
                                            color={teal[700]}
                                        >{formatPercentage(chain(monthTransactions).sumBy(t => t.amount).value() / chain(buckets).sumBy(b => b.amount).value())}</Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Typography variant='h6' sx={{ lineHeight: '1.25rem' }}>{formatCurrency(chain(monthTransactions).sumBy(t => t.amount).value())}</Typography>
                                        <Typography variant='body2' color={teal[700]}>{formatCurrency(chain(buckets).sumBy(b => b.amount).value())}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
                        {chain(buckets)
                            .map((bucket) => ({ transactions: findTransactionsByBucket(bucket.slug, monthTransactions), bucket }))
                            .map(({ transactions, bucket }) => ({ transactions, bucket, transactionsTotal: chain(transactions).sumBy(t => t.amount).value() }))
                            .sortBy(({ bucket, transactionsTotal }) => transactionsTotal / bucket.amount)
                            .reverse()
                            .map(({ transactions, bucket, transactionsTotal }) => {
                                const bucketGroup = bucket.group;
                                const bucketName = bucket.name;
                                const pct = transactionsTotal / bucket.amount;
                                console.log(bucket.id, bucketName, transactions);
                                return (
                                    <Card key={bucketName}>
                                        <CardContent onClick={() => handleOpenBucketDetailsSheet(chain(transactions).first().value().bucketId)}>
                                            <Typography variant="caption" color={teal[700]}>{bucketGroup}{bull}{bucketName}</Typography>
                                            <Typography variant="h5" component="div">{formatCurrency(transactionsTotal)}</Typography>
                                            <Typography variant="body2">{formatPercentage(pct)}</Typography>
                                        </CardContent>
                                        <ProgressIndicator progress={pct * 100} total={100} />
                                    </Card>
                                )
                            }).value()}
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export {
    HomePage
}

