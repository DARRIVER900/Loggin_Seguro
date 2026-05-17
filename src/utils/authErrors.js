const LOGIN_ERROR_MESSAGE = "No pudimos iniciar sesión. Revisa tus datos o intenta de nuevo más tarde.";

const REGISTER_ERROR_MESSAGES = {
  "auth/email-already-in-use": "Este correo ya está registrado. Intenta iniciar sesión.",
  "auth/invalid-email": "Ingresa un correo válido.",
  "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
};

export const getSafeAuthErrorMessage = (error, isRegistering = false) => {
  if (error?.code === "auth/too-many-requests") {
    return "Detectamos demasiados intentos. Espera un momento antes de intentar de nuevo.";
  }

  if (!isRegistering) {
    return LOGIN_ERROR_MESSAGE;
  }

  return REGISTER_ERROR_MESSAGES[error?.code] || "No pudimos crear la cuenta. Revisa los datos e intenta de nuevo.";
};
