import { initializeApp } from "firebase/app"; // Importamos la funcion para inicializar firebase
import { getAuth } from "firebase/auth" // Trae las herramientas para manejar usuarios (login, registro, cerrar sesión).
import { getFirestore } from "firebase/firestore"; // Trae las herramientas para usar la base de datos


// firebaseConfig es el objeto donde guardamos nuestras api keys
// Cuando tu código intenta registrar a alguien, Firebase lee estos datos para saber en qué base de datos guardar la información.

const firebaseConfig = {

  apiKey: "AIzaSyAZA5OAqfs2M_qAsWSWn2_l6q2y5CTiPyU",
  authDomain: "loggin-62bc0.firebaseapp.com",
  projectId: "loggin-62bc0",
  storageBucket: "loggin-62bc0.firebasestorage.app",
  messagingSenderId: "219823677461",
  appId: "1:219823677461:web:d596711e31e45701716e1c"

};

const app = initializeApp(firebaseConfig); // Se pasan las api keys (firebaseConfig) a la función initializeApp. El resultado se guarda en una constante llamada app. Esta variable app ahora representa tu conexión activa con Google
export const db = getFirestore(app); // Es la conexión a tu base de datos Firestore. Se usa cuando haces getDoc o setDoc para leer o guardar el rol.
export const auth = getAuth(app); // Es la conexión al sistema de Autenticación. Se usa para saber si hay un usuario logueado en el main.jsx o para cerrar sesión en el Home.jsx.
 