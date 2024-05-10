import { useEffect } from 'react';
import { Autocomplete, Box, Button, Card, CardActions, CardContent, Chip, FormControl, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemButton, ListItemText, ListSubheader, OutlinedInput, Stack, TextField, Typography } from '@mui/material';
import React from 'react';
import { addBucket, deleteBucket, fetchBuckets } from './plan.slice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { chain } from 'lodash';
import { Bucket } from '../../models';
import { formatCurrency } from '../../components/format';
import { Clear } from '@mui/icons-material';

const PlanPage = () => {
    const [id, setId] = React.useState<string | null>(null);
    const [name, setName] = React.useState(' ');
    const [group, setGroup] = React.useState(' ');
    const [amount, setAmount] = React.useState(0);
    const [patterns, setPatterns] = React.useState(' ');

    const dispatch = useDispatch<any>();
    const buckets = useSelector((state: RootState) => state.plan.buckets);

    useEffect(() => {
        dispatch(fetchBuckets());
    }, [dispatch]);

    const resetForm = () => {
        setId(null);
        setName('');
        setGroup('');
        setAmount(0);
        setPatterns('');
    }

    const handleSaveBucket = () => {
        dispatch(addBucket({ id, group, name, amount, patterns }));
        resetForm();
    }

    const handleDeleteBucket = (bucketId: string) => {
        dispatch(deleteBucket(bucketId));
        resetForm();
    }

    const handleSelectBucket = (bucket: Bucket) => {
        setId(bucket.id);
        setName(bucket.name);
        setGroup(bucket.group);
        setAmount(bucket.amount);
        setPatterns(bucket.patterns?.join(', ') || '');
    }

    return (
        <Box sx={{ height: 'calc(100vh - 150px)', display: 'flex', gap: 2, flexDirection: 'column' }}>
            <Card sx={{ overflow: 'unset' }}>
                <CardContent>
                    <Stack spacing={2}>
                        <TextField
                            label="Group"
                            id="group"
                            defaultValue={' '}
                            variant="outlined"
                            size="small"
                            value={group}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setGroup(event.target.value);
                            }}
                        />

                        <TextField
                            label="Name"
                            id="name"
                            defaultValue={' '}
                            variant="outlined"
                            size="small"
                            value={name}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setName(event.target.value);
                            }}
                        />

                        <FormControl sx={{ m: 1 }} variant="outlined">
                            <InputLabel htmlFor="amount">Amount</InputLabel>
                            <OutlinedInput
                                id="amount"
                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                label="Amount"
                                size="small"
                                value={amount}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setAmount(Number(event.target.value));
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="patterns" size='small'>Patterns</InputLabel>
                            <OutlinedInput
                                id="patterns"
                                size="small"
                                label="Patterns"
                                value={patterns}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setPatterns(event.target.value);
                                }}
                            />
                        </FormControl>
                    </Stack>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }} >
                    <Button variant='contained' size="small" onClick={() => handleSaveBucket()}>Save</Button>
                </CardActions>
            </Card>

            <Box>
                <Card>
                    <CardContent>
                        <Typography variant='h6'>Total</Typography>
                        <Typography variant='body1'>{formatCurrency(chain(buckets).sumBy(b=> b.amount).value())}</Typography>
                    </CardContent>
                </Card>
            </Box>
            <Box sx={{ overflow: 'scroll' }}>
                <List>
                    {chain(buckets).groupBy((b) => b.group).map((buckets, group) => (
                        <List dense subheader={
                            <ListSubheader component="div" sx={{ display: 'flex', gap: 3 }}>
                                <Typography variant="h6" sx={{ flex: 6 }}>{group}</Typography>
                                <Typography variant="h6" sx={{ textAlign: 'right' }}>{formatCurrency(chain(buckets).sumBy(b => b.amount).value())}</Typography>
                                <IconButton size="small" disabled><Clear sx={{ color: 'white' }} fontSize="small" /></IconButton>
                            </ListSubheader>
                        }>
                            {buckets.map((bucket) => (
                                <ListItem disablePadding key={bucket.slug}>
                                    <ListItemButton sx={{ display: 'flex', gap: 3 }} onClick={() => handleSelectBucket(bucket)}>
                                        <ListItemText sx={{ flex: 6 }} primary={bucket.name} />
                                        <ListItemText sx={{ textAlign: 'right' }} primary={formatCurrency(bucket.amount)} />
                                        <IconButton size="small" onClick={() => handleDeleteBucket(bucket.id!)}><Clear fontSize="small" /></IconButton>
                                    </ListItemButton>

                                </ListItem>
                            ))}
                        </List>
                    )).value()}
                </List>
            </Box>
        </Box>

    );
}

export {
    PlanPage
}