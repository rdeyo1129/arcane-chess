import React, { useState } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Button from 'src/components/Button/Button';
import Input from 'src/components/Input/Input';
import Hero from 'src/components/hero2/Hero';

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

    // and navigate to the login page
    dispatch(registerUser(newUser, navigate));
  };

  return (
    <div className="register-page">
      <Hero />
      <form noValidate onSubmit={onSubmitReg} className="view">
        <img className="logo" src={'/assets/logogold.png'} alt="" />
        <div></div>
        <div></div>
        <div className="reg-input-top">
          <div className="reg-inputs">
            <Input
              className="primary"
              color={'Y'}
              width={180}
              height={40}
              placeholder={'Username'}
              value={username} // Changed to use the value prop
              onChange={(value) => onChange('username', value)}
              password={false}
              styles={{ margin: '2px' }}
            />
            <Input
              className="primary"
              color={'Y'}
              width={180}
              height={40}
              placeholder={'Email'}
              value={email} // Changed to use the value prop
              onChange={(value) => onChange('email', value)}
              password={false}
              styles={{ margin: '2px' }}
            />
            <Input
              className="primary"
              color={'Y'}
              width={180}
              height={40}
              placeholder={'Password'}
              value={password} // Changed to use the value prop
              onChange={(value) => onChange('password', value)}
              password={true}
              styles={{ margin: '2px' }}
            />
            <Input
              className="primary"
              color={'Y'}
              width={180}
              height={40}
              placeholder={'Confirm Password'}
              value={password2} // Changed to use the value prop
              onChange={(value) => onChange('password2', value)}
              password={true}
              styles={{ margin: '2px' }}
            />
          </div>
          <div className="reg-buttons">
            <div className="mini-buttons">
              <Link to={'/login'}>
                <Button
                  className="tertiary"
                  text={'LOGIN'}
                  color={'Y'}
                  width={80}
                  height={30}
                  fontSize={12}
                  backgroundColorOverride="#111111"
                />
              </Link>
              <Link to={'/'}>
                <Button
                  className="tertiary"
                  text={'HOME'}
                  color={'Y'}
                  width={80}
                  height={30}
                  fontSize={12}
                  backgroundColorOverride="#111111"
                />
              </Link>
            </div>
            <Button
              className="primary"
              text={'REGISTER'}
              color={'Y'}
              width={140}
              // onClick={() => {}}
              disabled={false}
              submit={true}
              styles={{ margin: '2px' }}
            />
          </div>
          <div className="reg-errors">
            {_.map(loginRegisterErrors, (value, i) => {
              return (
                <span className="reg-error" key={i}>
                  {value}
                </span>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
};

export const Register = UnwrappedRegister;
