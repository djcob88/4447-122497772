// AuthContext.tsx taken from FYP project with modified user type
import React, { createContext, useContext, useState } from "react";

export type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;  
  logout: () => void; 
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); 

  const logout = () => {setUser(null);};

  return ( 
    <AuthContext.Provider value={{ user, setUser, logout }}> 
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
};
// End