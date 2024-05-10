type Bucket = {
    id: string | null;
    group: string;
    name: string;
    slug: string;
    baseline: boolean;
    month?: string;
    amount: number;
    patterns?: string[];
}

type Transaction = {
    id?: string;
    date: string;
    month: string;
    amount: number;
    description: string;
    hashcode: string;
    deleted: boolean;
    bucketId: string | null;
    bucketSlug: string | null;
    bucketName: string | null;
}

export type {
    Bucket,
    Transaction
}