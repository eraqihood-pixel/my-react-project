import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, projectId } from './firebase'; // Import db and projectId

const getProductCollectionRef = () => collection(db, `projects/${projectId}/products`);

export const productService = {
  // Get all products for the current project
  getProducts: async () => {
    try {
      const snapshot = await getDocs(getProductCollectionRef());
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error getting products:", error);
      throw error;
    }
  },

  // Get a single product by ID for the current project
  getProduct: async (id) => {
    try {
      const productDocRef = doc(db, `projects/${projectId}/products/${id}`);
      const productDoc = await getDoc(productDocRef);
      if (productDoc.exists()) {
        return { id: productDoc.id, ...productDoc.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error getting product ${id}:`, error);
      throw error;
    }
  },

  // Add a new product to the current project
  addProduct: async (productData) => {
    try {
      const docRef = await addDoc(getProductCollectionRef(), {
        ...productData,
        createdAt: new Date(),
        projectId: projectId // Redundant but good for explicit filtering
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  },

  // Update an existing product in the current project
  updateProduct: async (id, productData) => {
    try {
      const productDocRef = doc(db, `projects/${projectId}/products/${id}`);
      await updateDoc(productDocRef, productData);
      return true;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  // Delete a product from the current project
  deleteProduct: async (id) => {
    try {
      const productDocRef = doc(db, `projects/${projectId}/products/${id}`);
      await deleteDoc(productDocRef);
      return true;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  }
};
