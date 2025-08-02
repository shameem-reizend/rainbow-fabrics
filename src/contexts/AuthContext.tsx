import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType } from '../types';

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would be an API call
    const users: User[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const foundUser = users.find((u) => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = { id: foundUser.id, name: foundUser.name, email: foundUser.email, password: foundUser.password  };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Mock registration - check if user already exists
    const users: User[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const existingUser = users.find((u) => u.email === email);
    
    if (existingUser) {
      return false; 
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password
    };

    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    const userData = { id: newUser.id, name: newUser.name, email: newUser.email, password: newUser.password };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};