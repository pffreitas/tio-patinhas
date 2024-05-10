import { Bucket } from "../models";
import { getFirestore, collection, addDoc, getDocs, query, where, DocumentData, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";

const COLLECTION_NAME = "buckets";

const mapData = (doc: DocumentData): Bucket => {
    const data = doc.data();
    return {
        id: doc.id,
        group: data.group,
        name: data.name,
        slug: data.slug,
        baseline: data.baseline,
        month: data.month,
        amount: data.amount,
        patterns: data.patterns,
    };
}

const put = async (bucket: Bucket): Promise<string> => {
    let db = getFirestore();

    try {
        if (bucket.id) {
            await setDoc(doc(db, COLLECTION_NAME, bucket.id), bucket);
            return bucket.id;
        } else {
            const document = await addDoc(collection(db, COLLECTION_NAME), bucket);
            return document.id
        }
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
}

const deleteBucket = async (bucketId: string): Promise<void> => {
    let db = getFirestore();

    try {
        await deleteDoc(doc(db, COLLECTION_NAME, bucketId));
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
}

const findById = async (id: string): Promise<Bucket | null> => {
    let db = getFirestore();

    try {
        const document = await getDoc(doc(db, COLLECTION_NAME, id));
        if (document.exists()) {
            return mapData(document);
        } else {
            return null;
        }
    } catch (e) {
        console.error("Error getting document: ", e);
        throw e;
    }
}

const findAll = async (): Promise<Bucket[]> => {
    let db = getFirestore();

    try {
        const q = query(collection(db, COLLECTION_NAME), where("baseline", "==", true));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => mapData(doc));
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
}

const findBySlugAndMonth = async (slug: string, month: string): Promise<Bucket> => {
    let db = getFirestore();

    try {
        const q = query(collection(db, COLLECTION_NAME), where("slug", "==", slug), where("month", "==", month));
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map(doc => mapData(doc));
        return docs[0];
    } catch (e) {
        console.error("Error getting documents: ", e);
        throw e;
    }
}

const findBaselineBySlug = async (slug: string): Promise<Bucket> => {
    let db = getFirestore();

    try {
        const q = query(collection(db, COLLECTION_NAME), where("slug", "==", slug), where("baseline", "==", true));
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map(doc => mapData(doc));
        return docs[0];
    } catch (e) {
        console.error("Error getting documents: ", e);
        throw e;
    }
}



const BucketRepository = {
    put,
    deleteBucket,
    findById,
    findAll,
    findBySlugAndMonth,
    findBaselineBySlug
}

export default BucketRepository;