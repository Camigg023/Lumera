import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Example Service to interact with a 'users' collection in Firestore
 */

const collectionName = 'users';

// Get all documents
export const getUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
};

// Add a new document
export const addUser = async (userData: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), userData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

// Update an existing document
export const updateUser = async (id: string, updatedData: any) => {
  try {
    const userRef = doc(db, collectionName, id);
    await updateDoc(userRef, updatedData);
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

// Delete a document
export const deleteUser = async (id: string) => {
  try {
    const userRef = doc(db, collectionName, id);
    await deleteDoc(userRef);
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};
