import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('adminToken'));

    const login = (newToken) => {
        setToken(newToken);
        localStorage.setItem('adminToken', newToken);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('adminToken');
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
