type Bucket = {
    id: string;
    name: string;
    month: Date;
    amount: number;
    status: string;
}

type Transaction = {
    id: string;
    date: Date;
    amount: number;
    description: string;
    bucket: Bucket;
}

export type {
    Bucket,
    Transaction
}