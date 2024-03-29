import React, { createContext, ReactNode } from "react";

interface AuthContextType {
  authToken: string;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthContextProviderProps {
  children: ReactNode;
  authToken: string;
}

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
  authToken,
}) => {
  return (
    <AuthContext.Provider value={{ authToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
