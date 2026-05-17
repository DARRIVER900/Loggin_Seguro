import { useCallback, useEffect, useState } from "react"; // 1. Importamos useState
import PasswordRequirements from "./components/auth/PasswordRequirements";
import RecaptchaCheckbox from "./components/auth/RecaptchaCheckbox";
import InputField from "./components/InputField";
import { getSafeAuthErrorMessage } from "./utils/authErrors";
import {
  clearLoginFailures,
  getLoginRateLimitStatus,
  recordLoginFailure,
} from "./utils/authRateLimit";
import { isStrongPassword } from "./utils/passwordValidation";


import { auth, db } from './firebase/credenciales';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
// serverTimestamp añade la fecha de creación
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';

const Loggin = () => {
  // 2. Creamos el "interruptor"
  // estaRegistrandose: Es una variable booleana (true o false)
  // false: El formulario muestra "Sign In"
  // true: El formulario muestra "Create your Account" y activa el campo de selección de rol
  // .setEstaRegistrandose: Es la función que usamos para cambiar ese valor cuando alguien hace clic en "SignUp now" o "Login now".
  
  const [estaRegistrandose, setEstaRegistrandose] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [passwordValue, setPasswordValue] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [recaptchaResetKey, setRecaptchaResetKey] = useState(0);

  const handleRecaptchaVerify = useCallback((token) => {
    setRecaptchaToken(token);
  }, []);

  const handleRecaptchaExpire = useCallback(() => {
    setRecaptchaToken("");
  }, []);

  const resetRecaptcha = () => {
    setRecaptchaToken("");
    setRecaptchaResetKey((currentKey) => currentKey + 1);
  };

  useEffect(() => {
    if (cooldownRemaining <= 0) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setCooldownRemaining((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [cooldownRemaining]);

  //Handle submit es la funcion que se dispara cuando el usuario presiona el boton de log in o registar, 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }

    // Const email y password capturan los datos que el usuario escribio en los inputs 
    const email = e.target.email.value.trim().toLowerCase();
    const password = e.target.password.value;
    const role = estaRegistrandose ? "user" : null;

    if (!recaptchaToken) {
      setAuthMessage("Completa la verificación reCAPTCHA antes de continuar.");
      return;
    }

    if (estaRegistrandose && !isStrongPassword(password)) {
      setAuthMessage("Tu contraseña aún no cumple todos los requisitos de seguridad.");
      return;
    }

    if (!estaRegistrandose) {
      const rateLimitStatus = getLoginRateLimitStatus(email);

      if (rateLimitStatus.blocked) {
        setCooldownRemaining(rateLimitStatus.remainingSeconds);
        setAuthMessage(`Demasiados intentos. Espera ${rateLimitStatus.remainingSeconds} segundos antes de intentar de nuevo.`);
        return;
      }
    }

    setIsSubmitting(true);
    setAuthMessage("");

    // El try catch conecta a la base de datos que usamos en firestore 
    try {
      if (estaRegistrandose) {
        // createUserWithEmailAndPassword: Le pide a Firebase Auth que cree el usuario
        const infoUsuario = await createUserWithEmailAndPassword(auth, email, password);
        // setDoc: Como Auth solo guarda email/password, nosotros usamos Firestore (db)para crear un documento extra 
        // donde guardamos el rol (admin/user) usando el ID único del usuario.
        await setDoc(doc(db, "usuarios", infoUsuario.user.uid), {
          correo: email,
          rol: role,
          fechaCreacion: serverTimestamp(), // Requisito de horario
          estado: "activo"
        });
      } else {
        // Simplemente le pregunta a Firebase: "¿Existe este usuario con esta clave?". Si sí, Firebase avisa al main.jsx y te deja pasar al Home
        await signInWithEmailAndPassword(auth, email, password);
        clearLoginFailures(email);
      }
    } catch (error) {
      console.error("Error de autentificación", error.code || error.message);
      resetRecaptcha();

      if (!estaRegistrandose) {
        const failureStatus = recordLoginFailure(email);

        if (failureStatus.blocked) {
          setCooldownRemaining(failureStatus.remainingSeconds);
          setAuthMessage(`Demasiados intentos. Espera ${failureStatus.remainingSeconds} segundos antes de intentar de nuevo.`);
        } else {
          setAuthMessage(`${getSafeAuthErrorMessage(error, estaRegistrandose)} Intentos restantes: ${failureStatus.attemptsRemaining}.`);
        }
      } else {
        setAuthMessage(getSafeAuthErrorMessage(error, estaRegistrandose));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Interfaz cambiante, puede pasar de un login a un registro ( esta condicionada )
  return (
    <div className="loggin-container">
      {/* 3. El título cambia según el estado */}
      <h2 className="form-title">
        {/* El selector de rol solo aparece si estaRegistrandose es verdadero. Si es falso, el componente simplemente no existe en la pantalla. */}
        {estaRegistrandose ? "Create your Account" : "Sign In "}
      </h2>
      <form onSubmit={handleSubmit} className="loggin-form">
        {/* el id="email" e id="password" para que handleSubmit los encuentre */}
        <InputField id="email" type="email" placeholder="Email address" icon="mail"/>
        <InputField
          id="password"
          type="password"
          placeholder="Password"
          icon="lock"
          onChange={(event) => setPasswordValue(event.target.value)}
        />

        {estaRegistrandose && <PasswordRequirements password={passwordValue} />}

        <RecaptchaCheckbox
          onVerify={handleRecaptchaVerify}
          onExpire={handleRecaptchaExpire}
          resetKey={recaptchaResetKey}
        />
        {!recaptchaToken && (
          <p className="auth-helper">Complete reCAPTCHA to continue.</p>
        )}
        
        <a href="#" className="forgot-pass-link">Forgot Password?</a>
        
        {authMessage && <p role="alert" className="auth-message">{authMessage}</p>}

        <button
          type="submit"
          className="loggin-button"
          disabled={
            isSubmitting ||
            cooldownRemaining > 0 ||
            !recaptchaToken ||
            (estaRegistrandose && !isStrongPassword(passwordValue))
          }
        >
          {cooldownRemaining > 0
            ? `Try again in ${cooldownRemaining}s`
            : isSubmitting
              ? "Please wait..."
              : estaRegistrandose ? "Register" : "Log In"}
        </button>
      </form>

    
      <p className="signup-text">
        {estaRegistrandose ? "¿You have an account? " : "Don't have an account? "} 
        {/* Si es true lo vuelve false, y viceversa. El enlace cambia el estado al hacer clic lo que permite que la pantalla pase de una vista a otra sin recargar la página */}
        <a href="#" onClick={() => {
          setEstaRegistrandose(!estaRegistrandose);
          setAuthMessage("");
          setCooldownRemaining(0);
          resetRecaptcha();
        }}>
          {estaRegistrandose ? "Login now" : "SignUp now"}
        </a>
      </p>

    </div>
  );
}

export default Loggin;
