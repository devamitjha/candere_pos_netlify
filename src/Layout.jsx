import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';

const Layout = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/';
    const successPage = location.pathname === '/success';
  return (
    <div className="main">
        {!isLoginPage && <Header />}
        <div className="section-outlet">           
            <Outlet />
            {!isLoginPage && !successPage && <Footer />}
        </div>  
    </div>
  )
}

export default Layout
