import React, { useState } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Button from 'src/components/Button/Button';
import Input from 'src/components/Input/Input';

import { registerUser } from '../../actions/authActions';

import { useNavigate } from 'react-router-dom';

const UnwrappedRegister = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const loginRegisterErrors = useSelector(
    (state: any) => state.loginRegisterErrors
  );

  // Adjusted the onChange function to fit the new Input component
  const onChange = (name: string, value: string) => {
    if (name === 'username') setUsername(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'password2') setPassword2(value);
  };

  const onSubmitReg = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newUser = {
      username: username,
      email: email,
      password: password,
      password2: password2,
    };

    console.log(newUser);

    // and navigate to the login page
    dispatch(registerUser(newUser, navigate));
  };

  return (
    <>
      <h2>Register</h2>
      <form noValidate onSubmit={onSubmitReg}>
        <Input
          // className="primary"
          color={'G'}
          width={120}
          height={40}
          placeholder={'Username'}
          value={username} // Changed to use the value prop
          onChange={(value) => onChange('username', value)}
        />
        <Input
          // className="primary"
          color={'G'}
          width={120}
          height={40}
          placeholder={'Email'}
          value={email} // Changed to use the value prop
          onChange={(value) => onChange('email', value)}
        />
        <Input
          // className="primary"
          color={'G'}
          width={120}
          height={40}
          placeholder={'Password'}
          value={password} // Changed to use the value prop
          onChange={(value) => onChange('password', value)}
        />
        <Input
          // className="primary"
          color={'G'}
          width={120}
          height={40}
          placeholder={'Confirm Password'}
          value={password2} // Changed to use the value prop
          onChange={(value) => onChange('password2', value)}
        />
        <Button
          className="primary"
          text={'REGISTER'}
          color={'G'}
          width={120}
          height={60}
          // onClick={() => {}}
          disabled={false}
          submit={true}
        />
        <Link to={'/login'}>
          <Button
            className="secondary"
            text={'TO LOGIN'}
            color={'G'}
            width={120}
            height={60}
          />
        </Link>
        <Link to={'/'}>
          <Button
            className="secondary"
            text={'TO HOME'}
            color={'G'}
            width={120}
            height={60}
          />
        </Link>
        {_.map(loginRegisterErrors, (value, i) => {
          return <span key={i}>{value}</span>;
        })}
      </form>
    </>
  );
};

export const Register = UnwrappedRegister;
