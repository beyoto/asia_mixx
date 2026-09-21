import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { FavoritesProvider } from './components/FavoritesContext.jsx';

import ProtectedRoute from './components/ProtectedRoute.jsx';



import HomePage from './pages/home/HomePage'
import AddProduct from './pages/addProduct/AddProduct.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import SplashScreen from './components/SplashScreen.jsx';
import AdminLogin from './pages/adminLogin/AdminLogin.jsx';
import AdminPanel from './pages/adminPanel/AdminPanel.jsx';
import ProductPage from './pages/ProductPage/ProductPage.jsx';
import FavoritesPage from './pages/favoritesPage/FavoritesPage.jsx';
import ContactsPage from './pages/contactPage/ContactsPage.jsx';
import EditProduct from './pages/editProduct/EditProduct.jsx';
import AdminAnalytics from './pages/adminAnalytics/AdminAnalytics.jsx';


const App = () => {
  return (
    <div>
      <AuthProvider>
        <SplashScreen>
          <BrowserRouter>
            <FavoritesProvider>
              <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path='/favorites' element={<FavoritesPage />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path='/contacts' element={<ContactsPage />} />

                <Route
                  path="/admin/add"
                  element={
                    <ProtectedRoute>
                      <AddProduct />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/edit/:id"
                  element={
                    <ProtectedRoute>
                      <EditProduct />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <ProtectedRoute>
                      <AdminAnalytics />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </FavoritesProvider>

          </BrowserRouter>
        </SplashScreen>
      </AuthProvider>
    </div>
  )
}

export default App
