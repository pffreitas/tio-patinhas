
import Papa from "papaparse";
import moment from "moment";
import TransactionRepository from "../repository/transaction.repo";
import BucketRepository from "../repository/bucket.repo";
import { Bucket, Transaction } from "../models";
import { isEmpty } from "lodash";
import accounting from 'accounting';

const findBucket = (buckets: Bucket[], description: string): Bucket | undefined => {
    return buckets.find((bucket) => {
        return bucket.patterns?.filter(p => !isEmpty(p)).some((pattern) => {
            return description.toLowerCase().includes(pattern.toLowerCase());
        });
    });
}

function hashTransaction(transaction: { date: string; description: string; amount: number }): string {
    const { date, description, amount } = transaction;
    const dataString = moment(date).format("MM-DD-YYYY") + description.replace(/\s/g, '') + amount;
    const hashcode = btoa(unescape(encodeURIComponent(dataString)));
    return hashcode;
}

const parseCvsString = async (data: string): Promise<Transaction[]> => {
    const buckets = await BucketRepository.findAll();

    const result = Papa.parse<Transaction>(data, {
        header: true,
        dynamicTyping: true
    });

    const transactions = result.data.map((row: Transaction) => {
        const bucket = findBucket(buckets, row['description']);
        const hashcode = hashTransaction(row);

        const transaction = {
            id: hashcode,
            date: moment(row['date']).format('MM-DD-YYYY'),
            month: moment(row['date']).format('MM-YYYY'),
            description: row['description'],
            amount: accounting.unformat(row['amount'].toString()),
            deleted: false,
            hashcode,
            bucketId: null,
            bucketSlug: bucket?.slug || null,
            bucketName: bucket?.name || null,
        };
        return transaction;
    });

    return transactions;
}

const saveTransactions = async (transactions: Transaction[]) => {
    for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i];

        if (transaction.id) {
            const existingTransaction = await TransactionRepository.getById(transaction.id);
            if (existingTransaction)
                continue;
        }

        let bucketId: string | null = null;

        if (transaction.bucketSlug !== null) {
            const bucket = await getBucket(transaction, transaction.bucketSlug);
            if (bucket) {
                bucketId = bucket.id;
            }
        }

        TransactionRepository.put({ ...transaction, bucketId });
    }
}

const setBucket = async (transactionId: string, bucketSlug: string) => {
    const transaction = await TransactionRepository.getById(transactionId);
    if (transaction) {
        const bucket = await getBucket(transaction, bucketSlug);

        if (bucket) {
            await TransactionRepository.put({
                ...transaction,
                bucketId: bucket.id,
                bucketSlug: bucket.slug,
                bucketName: bucket.name
            });
        }
    }
}

const getBucket = async (transaction: Transaction, bucketSlug: string): Promise<Bucket | null> => {
    let bucket: Bucket | null = null;
    const bucketBySlugAndMonth = await BucketRepository.findBySlugAndMonth(bucketSlug, moment(transaction.date).format('MM-YYYY'));

    if (bucketBySlugAndMonth) {
        bucket = bucketBySlugAndMonth;
    } else {
        const baselineBucket = await BucketRepository.findBaselineBySlug(bucketSlug);
        if (baselineBucket) {
            const monthBucket = {
                ...baselineBucket,
                month: moment(transaction.date).format('MM-YYYY'),
                baseline: false,
                id: null,
            };

            const monthBucketId = await BucketRepository.put(monthBucket);
            bucket = await BucketRepository.findById(monthBucketId);
        }
    }

    return bucket;
}

const TransactionService = {
    parseCvsString,
    saveTransactions,
    setBucket

}

export default TransactionService;