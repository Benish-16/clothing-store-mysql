export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 6) errors.push("Password must be at least 6 characters");
  if (!/[A-Z]/.test(password)) errors.push("Password must contain an uppercase letter");
  if (!/[0-9]/.test(password)) errors.push("Password must contain a number");
  if (!/[^a-zA-Z0-9]/.test(password)) errors.push("Password must contain a special character");

  return errors;
};