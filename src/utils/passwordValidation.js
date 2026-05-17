export const getPasswordChecks = (password) => [
  {
    id: "length",
    label: "At least 8 characters",
    isValid: password.length >= 8,
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    isValid: /[A-Z]/.test(password),
  },
  {
    id: "lowercase",
    label: "One lowercase letter",
    isValid: /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "One number",
    isValid: /\d/.test(password),
  },
  {
    id: "special",
    label: "One special character",
    isValid: /[^A-Za-z0-9]/.test(password),
  },
];

export const isStrongPassword = (password) => {
  return getPasswordChecks(password).every((check) => check.isValid);
};
