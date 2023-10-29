import Validator from 'validator';
import isEmpty from 'is-empty';

export default function validateLoginInput(data: any) {
  const loginRegisterErrors: Record<string, string> = {};
  // let loginRegisterErrors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.username = !isEmpty(data.username) ? data.username : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  // Username checks
  if (Validator.isEmpty(data.username)) {
    loginRegisterErrors.username = 'Username field is required';
  }
  // else if (!Validator.isEmail(data.username)) {
  //   loginRegisterErrors.username = "Username is invalid";
  // }

  // Password checks
  if (Validator.isEmpty(data.password)) {
    loginRegisterErrors.password = 'Password field is required';
  }

  return {
    loginRegisterErrors,
    isValid: isEmpty(loginRegisterErrors),
  };
}
