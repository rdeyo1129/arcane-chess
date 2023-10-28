import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// import { TextField } from '@mui/material';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { useNavigate } from 'react-router-dom';

import 'src/pages/loginRegister/Login.scss';

import Button from 'src/components/Button/Button';

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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const auth = useSelector((state: RootState) => state.auth);

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

    loginUser(
      guest
        ? userData
        : username !== '' && password !== ''
        ? userData
        : testUser
    );

    if (auth.isAuthenticated) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-page fade">
      <div className="hero-background">{/* <Hero /> */}</div>

      <div className="login-col2">
        <div className="panel login-panel">
          <img className="logo" src={'/assets/logoblue.png'} alt="" />
          <form noValidate>
            <div className="login-buttons">
              <div className="buttons">
                <Button
                  className="primary"
                  text={'LOGIN'}
                  color={'G'}
                  width={120}
                  height={60}
                  onClick={(e) => {
                    return onSubmitLogin(e, false);
                  }}
                  disabled={false}
                />
                <div className="other-buttons">
                  <Link to={'/register'}>
                    <Button
                      className="secondary"
                      text={'TO REGISTER'}
                      color={'G'}
                      width={120}
                      height={60}
                    />
                  </Link>
                  {/* <button onClick={(e) => onSubmitLogin(e, true)}>
                    ENTER AS GUEST
                  </button> */}
                  <Link to={'/'}>
                    <button className="back">HOME</button>
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// UnwrappedLogin.propTypes = {
//   loginUser: PropTypes.func.isRequired,
//   auth: PropTypes.object.isRequired,
//   errors: PropTypes.object.isRequired,
// };

export const Login = UnwrappedLogin;
