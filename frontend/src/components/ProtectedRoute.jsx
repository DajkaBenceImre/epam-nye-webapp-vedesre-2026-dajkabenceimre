import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        // Ha nincs belépve, azonnal visszadobjuk a login oldalra (SPA navigáciooval)
        return <Navigate to="/login" replace />;
    }

    // Ha be van lépve, megjelenítjük a kért komponenst (childrennel)
    return children;
};

export default ProtectedRoute;
