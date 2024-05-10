import moment from "moment";
import { Transaction } from "../models";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, setDoc, query, where, DocumentData, deleteDoc } from "firebase/firestore";

const COLLECTION_NAME = "transactions";

const mapData = (doc: DocumentData) : Transaction => {
    const data = doc.data();
   return  {
        id: doc.id,
        date: data.date,
        month: data.month || moment(data.date).format("YYYY-MM"),
        description: data.description,
        amount: data.amount,
        deleted: data.deleted,
        hashcode: data.hashcode,
        bucketId: data.bucketId,
        bucketSlug: data.bucketSlug,
        bucketName: data.bucketName
    }
}

const put = async (transaction: Transaction) => {
    let db = getFirestore();

    try {
        await setDoc(doc(db, COLLECTION_NAME, transaction.id!), transaction);
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
}

const update = async (id: string, transaction: Transaction) => {
    let db = getFirestore();

    try {
        await updateDoc(doc(db, COLLECTION_NAME, id), transaction);
    } catch (e) {
        console.error("Error updating document: ", e);
        throw e;
    }
}

const deleteTransaction = async (id: string) => {
    let db = getFirestore();

    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (e) {
        console.error("Error updating document: ", e);
        throw e;
    }
}

const getById = async (id: string): Promise<Transaction | null> => {
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

const findAll = async (): Promise<Transaction[]> => {
    let db = getFirestore();

    try {
        const snapshot = await getDocs(collection(db, COLLECTION_NAME));
        return snapshot.docs.map(doc =>  mapData(doc));
    } catch (e) {
        console.error("Error adding document: ", e);
    }
    return [];
}

const findAllByMonth = async (month: string): Promise<Transaction[]> => {
    const db = getFirestore();
    const q = query(collection(db, COLLECTION_NAME), where("month", "==", month));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => mapData(doc));
}


const TransactionRepository = {
    put,
    update,
    deleteTransaction,
    getById,
    findAll,
    findAllByMonth,
    
}

export default TransactionRepository;