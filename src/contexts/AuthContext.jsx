import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { AuthContext } from "./AuthContext.js";
import { auth, db } from "../firebase/credenciales";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setError(null);

      try {
        if (firebaseUser) {
          const docRef = doc(db, "usuarios", firebaseUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserRole(docSnap.data().rol);
          } else {
            console.warn("No se encontró el documento del usuario en Firestore");
            setUserRole(null);
          }

          setUser(firebaseUser);
        } else {
          setUser(null);
          setUserRole(null);
        }
      } catch (authError) {
        console.error("Error al cargar la sesión:", authError);
        setError(authError);
        setUser(null);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      user,
      userRole,
      loading,
      error,
      isAuthenticated: Boolean(user),
    }),
    [user, userRole, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
