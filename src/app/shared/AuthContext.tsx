import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextType {
    isLoggedIn: boolean;
    login: (userId: string, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const hasStoredCredentials = () => Boolean(
    localStorage.getItem('userId') && localStorage.getItem('token')
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(hasStoredCredentials);

    const syncAuthState = useCallback(() => {
        setIsLoggedIn(hasStoredCredentials());
    }, []);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) syncAuthState();
        };

        window.addEventListener('storage', syncAuthState);
        window.addEventListener('focus', syncAuthState);
        window.addEventListener('pageshow', syncAuthState);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('storage', syncAuthState);
            window.removeEventListener('focus', syncAuthState);
            window.removeEventListener('pageshow', syncAuthState);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [syncAuthState]);

    const login = useCallback((userId:string, token:string) => {
        localStorage.setItem('userId', userId);
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
