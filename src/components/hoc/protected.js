
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireUser = false, condition }) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Agent login
    const isUser = useSelector((state) => state.user.isUser); // User login from Redux
    const addresses = useSelector((state) => state.customerAddress.addresses);

    const hasAddresses = addresses && addresses.length > 0;

    // If the agent is not logged in, redirect to the login page
    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    // If user-specific login is required but the user is not logged in, redirect to the login page
    if (requireUser && !isUser) {
        return <Navigate to="/" replace />;
    }

    // If the additional condition is provided and is false, redirect
    // if (!hasAddresses || condition === false) {
    //     return <Navigate to="/" replace />;
    // }

    return children;
};

export default ProtectedRoute;

