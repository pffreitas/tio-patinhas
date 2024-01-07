import { Bucket } from "../models";
// import { getFirestore, collection, addDoc } from "firebase/firestore";



const put = async (bucket: Bucket) => {
    // let db = getFirestore();

    // try {
    //     const docRef = await addDoc(collection(db, "buckets"), bucket);
    //     console.log("Document written with ID: ", docRef.id);
    // } catch (e) {
    //     console.error("Error adding document: ", e);
    // }

}

const BucketRepository = {
    put
}

export default BucketRepository;