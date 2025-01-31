import React, { useState } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import 'src/pages/loginRegister/LoginRegister.scss';

import Button from 'src/components/Button/Button';
import Input from 'src/components/Input/Input';
import Hero from 'src/components/hero2/Hero';

import {
  loginUser,
  getGuestUserFromLocalStorage,
} from '../../actions/authActions';

interface UserData {
  username: string;
  password: string;
  guest: boolean;
}

const UnwrappedLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const auth = useSelector((state: RootState) => state.auth);
  const loginRegisterErrors = useSelector(
    (state: any) => state.loginRegisterErrors || {}
  );

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
    // if (name === 'password') setPassword(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const onSubmitLogin = (
    e: React.MouseEvent<HTMLButtonElement>,
    guest: boolean
  ) => {
    e.preventDefault();

    const userData: UserData = {
      username,
      password,
      guest,
    };

    let guestUserData: UserData | null = null;

    if (guest) {
      const existingGuestUser = getGuestUserFromLocalStorage();
      if (existingGuestUser) {
        guestUserData = {
          username: existingGuestUser.key,
          password: '123456',
          guest: true,
        };
      } else {
        guestUserData = {
          username: `guest_${Math.random().toString(36).substring(2)}`,
          password: '123456',
          guest: true,
        };
      }
    }

    dispatch(loginUser(guest ? guestUserData : userData, navigate));
  };

  return (
    <div className="login-page">
      <Hero />
      <form className="view" noValidate>
        <img className="logo" src={'/assets/logoblue.png'} alt="" />
        <div className="login-info">
          Create an account if you want to place on the leaderboard. Otherwise,
          click AS GUEST to enter anonymously.
        </div>
        <div></div>
        <div className="inputs">
          <div className="input-top">
            <div className="text-inputs">
              <Input
                color={'B'}
                width={220}
                height={40}
                placeholder={'Username'}
                value={username}
                onChange={(value) => onChange('username', value)}
                styles={{ margin: '2px' }}
                password={false}
              />
              <Input
                color={'B'}
                width={220}
                height={40}
                placeholder={'Password'}
                value={password}
                onChange={(value) => handlePasswordChange(value)}
                styles={{ margin: '2px' }}
                password={true}
              />
            </div>
            <div className="top-buttons">
              {/* <div style={{ height: '44px' }}></div> */}
              <Button
                className="secondary"
                text={'AS GUEST'}
                color={'B'}
                width={140}
                onClick={(e) => onSubmitLogin(e, true)}
                styles={{ margin: '2px' }}
              />
              <Button
                className="primary"
                text={'LOGIN'}
                color={'B'}
                width={140}
                onClick={(e) => {
                  return onSubmitLogin(e, false);
                }}
                disabled={false}
                styles={{ margin: '2px' }}
              />
            </div>
          </div>
          <div className="mini-buttons">
            <Link to={'/register'}>
              <Button
                className="tertiary"
                text={'REGISTER'}
                color={'B'}
                width={80}
                height={30}
                fontSize={12}
                backgroundColorOverride="#111111"
              />
            </Link>
            {/* <Link to="/">
              <Button
                className="tertiary"
                text={'FORGOT'}
                color={'B'}
                width={80}
                height={30}
                fontSize={12}
                backgroundColorOverride="#111111"
              />
            </Link> */}
            <Link to="/">
              <Button
                className="tertiary"
                text={'HOME'}
                color={'B'}
                width={80}
                height={30}
                fontSize={12}
                backgroundColorOverride="#111111"
              />
            </Link>
          </div>
          <div className="login-errors">
            {_.map(loginRegisterErrors, (value, i) => {
              return (
                <span className="login-error" key={i}>
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

// UnwrappedLogin.propTypes = {
//   loginUser: PropTypes.func.isRequired,
//   auth: PropTypes.object.isRequired,
//   errors: PropTypes.object.isRequired,
// };

export const Login = UnwrappedLogin;
