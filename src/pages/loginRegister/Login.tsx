import React, { useState } from 'react';
import _ from 'lodash';
import { Link, useLocation } from 'react-router-dom';
// import { TextField } from '@mui/material';
import { connect, useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { useNavigate } from 'react-router-dom';

import 'src/pages/loginRegister/Login.scss';

import Button from 'src/components/Button/Button';
import Input from 'src/components/Input/Input';
import Hero from 'src/components/Hero/Hero';

// import Hero from '../components/Hero';

// import { loginUser } from '../actions/authActions';

import { loginUser } from '../../actions/authActions';

interface AuthState {
  isAuthenticated: boolean;
  // add other properties of auth state
}

interface UserData {
  username: string;
  password: string;
  guest: boolean;
}

interface RootState {
  auth: AuthState;
  // add other properties of your root state
}

const UnwrappedLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const auth = useSelector((state: RootState) => state.auth);
  const loginRegisterErrors = useSelector(
    (state: any) => state.loginRegisterErrors
  );
  const auth = useSelector((state: any) => state.auth);

  // const router = useRoutes();
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     username: '',
  //     password: '',
  //     errors: {},
  //     panelType: this.router.location || 'login',
  //   };
  // }

  // const [panel, setPanel] = useState(useLocation() || 'login');

  // componentDidUpdate(nextProps) {
  //   if (nextProps.errors) {
  //     this.setState({
  //       errors: nextProps.errors,
  //     });
  //   }
  // }

  // const onChange = (e) => {
  //   e.preventDefault();
  //   this.setState({ [e.target.name]: e.target.value });
  // };

  const onChange = (name: string, value: string) => {
    if (name === 'username') setUsername(value);
    if (name === 'password') setPassword(value);
  };

  const onSubmitLogin = (
    e: React.MouseEvent<HTMLButtonElement>,
    guest: boolean,
    testName?: string
  ) => {
    e.preventDefault();

    const userData: UserData = {
      username: guest
        ? `guest_user_${Math.random().toString(36).substring(2)}`
        : username,
      password: '123456',
      guest,
    };

    const testUser: UserData = {
      username: testName ?? '',
      password: '123456',
      guest,
    };

    dispatch(
      loginUser(
        guest
          ? userData
          : username !== '' && password !== ''
          ? userData
          : testUser,
        navigate
      )
    );
  };

  return (
    <div className="login-page">
      <form className="view" noValidate>
        <img className="logo" src={'/assets/logoblue.png'} alt="" />
        <div></div>
        <div></div>
        <div className="inputs">
          <div className="input-top">
            <div className="text-inputs">
              <Input
                color={'B'}
                width={200}
                height={40}
                placeholder={'Username'}
                value={username}
                onChange={(value) => onChange('username', value)}
                styles={{ margin: '2px' }}
              />
              <Input
                color={'B'}
                width={200}
                height={40}
                placeholder={'Password'}
                value={password}
                onChange={(value) => onChange('password', value)}
                styles={{ margin: '2px' }}
              />
            </div>
            <Button
              className="primary"
              text={'LOGIN'}
              color={'B'}
              width={160}
              height={84}
              onClick={(e) => {
                return onSubmitLogin(e, false);
              }}
              disabled={false}
              styles={{ margin: '2px' }}
            />
          </div>
          <div className="buttons">
            <Link to={'/register'}>
              <Button
                className="tertiary"
                text={'REGISTER'}
                color={'B'}
                width={80}
                height={30}
                fontSize={12}
                backgroundColorOverride="#333333"
              />
            </Link>
            <Button
              className="tertiary"
              text={'GUEST'}
              color={'B'}
              width={80}
              height={30}
              fontSize={12}
              backgroundColorOverride="#333333"
              onClick={(e) => onSubmitLogin(e, true, 'test_user')}
            />
            <Link to={'/'}>
              <Button
                className="tertiary"
                text={'FORGOT'}
                color={'B'}
                width={80}
                height={30}
                fontSize={12}
                backgroundColorOverride="#333333"
                // onClick={(e) => onSubmitLogin(e, true, 'test_user')}
              />
            </Link>
            {_.map(loginRegisterErrors, (value, i) => {
              return <span key={i}>{value}</span>;
            })}
          </div>
        </div>
      </form>
    </div>
  );
};

// UnwrappedLogin.propTypes = {
//   loginUser: PropTypes.func.isRequired,
//   auth: PropTypes.object.isRequired,
//   errors: PropTypes.object.isRequired,
// };

export const Login = UnwrappedLogin;
