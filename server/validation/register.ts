import Validator from 'validator';
import isEmpty from 'is-empty';

export default function validateRegisterInput(data: any) {
  const loginRegisterErrors: Record<string, string> = {};
  // let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.username = !isEmpty(data.username) ? data.username : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  // Name checks
  if (Validator.isEmpty(data.username)) {
    loginRegisterErrors.username = 'Username field is required';
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    loginRegisterErrors.email = 'Email field is required';
  } else if (!Validator.isEmail(data.email)) {
    loginRegisterErrors.email = 'Email is invalid';
  }

  // Password checks
  if (Validator.isEmpty(data.password)) {
    loginRegisterErrors.password = 'Password field is required';
  }
  if (Validator.isEmpty(data.password2)) {
    loginRegisterErrors.password2 = 'Confirm password field is required';
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    loginRegisterErrors.password = 'Password must be at least 6 characters';
  }
  if (!Validator.equals(data.password, data.password2)) {
    loginRegisterErrors.password2 = 'Passwords must match';
  }

  return {
    loginRegisterErrors,
    isValid: isEmpty(loginRegisterErrors),
  };
}
