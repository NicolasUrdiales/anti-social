import { useContext } from 'react';
import { Auth } from './AuthContext';

export function useAuth() {
  const context = useContext(Auth);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}