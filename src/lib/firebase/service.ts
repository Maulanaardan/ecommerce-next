import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { app } from "./init";

const firestore = getFirestore(app);

export async function retrieveData(collectionName: string) {
  const querySnapshot = await getDocs(collection(firestore, collectionName));
  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return data;
}

export async function retrieveDataById(collectionName: string, id: string) {
  const snapshotById = await getDoc(doc(firestore, collectionName, id));
  const dataById = snapshotById.data();
  return dataById;
}

export async function signUp(
  userData: { email: string; name?: string; password?: string },
  callback: (result: { status: boolean; error?: string }) => void
) {
  const q = query(
    collection(firestore, "users"),
    where("email", "==", userData.email) // Hapus koma di akhir
  );

  const snapshotSignUp = await getDocs(q);
  const dataSignUp = snapshotSignUp.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (dataSignUp.length > 0) {
    callback({ status: false });
  } else {
    await addDoc(collection(firestore, "users"), userData)
      .then(() => {
        callback({ status: true });
      })
      .catch((error) => {
        callback({ status: false });
        console.log(error);
      });
  }
}
