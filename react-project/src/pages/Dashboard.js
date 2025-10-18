import React, { useState } from 'react';
import { useFirebase } from '../contexts/FirebaseContext';
import { useFirestore } from '../hooks/useFirestore';
import { productService } from '../services/productService';
import LoadingSpinner from '../components/LoadingSpinner';
import styles from '../styles/Dashboard.module.css';

const Dashboard = () => {
  const { user, loadingAuth } = useFirebase();
  // Fetch products using the useFirestore hook
  const { data: products, loading: loadingProducts, error: productsError } = useFirestore('products', []);

  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [addProductLoading, setAddProductLoading] = useState(false);
  const [addProductError, setAddProductError] = useState(null);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) {
      setAddProductError('الرجاء إدخال اسم وسعر المنتج.');
      return;
    }
    setAddProductLoading(true);
    setAddProductError(null);
    try {
      await productService.addProduct({
        name: newProductName,
        price: parseFloat(newProductPrice),
        createdBy: user.uid,
        createdByName: user.email // Or user.displayName
      });
      setNewProductName('');
      setNewProductPrice('');
      alert('تم إضافة المنتج بنجاح!');
    } catch (error) {
      console.error('Error adding product:', error);
      setAddProductError('فشل إضافة المنتج: ' + error.message);
    } finally {
      setAddProductLoading(false);
    }
  };

  if (loadingAuth) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <div className={styles.dashboardContainer}><p>الرجاء تسجيل الدخول للوصول إلى لوحة التحكم.</p></div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <h1>لوحة تحكم المشرف</h1>
      <p>مرحباً بك، {user.email}!</p>

      <section className={styles.addProductSection}>
        <h3>إضافة منتج جديد</h3>
        <form onSubmit={handleAddProduct} className={styles.addProductForm}>
          <div className={styles.formGroup}>
            <label htmlFor="productName">اسم المنتج:</label>
            <input
              type="text"
              id="productName"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="productPrice">السعر:</label>
            <input
              type="number"
              id="productPrice"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
              required
              step="0.01"
            />
          </div>
          {addProductError && <p className={styles.errorText}>{addProductError}</p>}
          <button type="submit" disabled={addProductLoading} className={styles.submitButton}>
            {addProductLoading ? 'جاري الإضافة...' : 'أضف المنتج'}
          </button>
        </form>
      </section>

      <section className={styles.productsSection}>
        <h3>المنتجات المتوفرة</h3>
        {loadingProducts ? (
          <LoadingSpinner />
        ) : productsError ? (
          <p className={styles.errorText}>خطأ: {productsError}</p>
        ) : products.length === 0 ? (
          <p>لا توجد منتجات حالياً. أضف منتجاً لتبدأ.</p>
        ) : (
          <ul className={styles.productList}>
            {products.map((product) => (
              <li key={product.id} className={styles.productItem}>
                <span>{product.name}</span>
                <span>{product.price} ر.س</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
