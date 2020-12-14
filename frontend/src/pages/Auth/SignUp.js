import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import { Spacing, Container } from 'components/Layout';
import { H1, Error } from 'components/Text';
import { InputText, Button } from 'components/Form';
import Head from 'components/Head';

import { SIGN_UP } from 'graphql/user';

import * as Routes from 'routes';

const Root = styled(Container)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 60px;

  @media (min-width: ${(p) => p.theme.screen.md}) {
    justify-content: space-between;
    margin-top: 120px;
  }
`;

const Welcome = styled.div`
  display: none;
  flex-direction: column;
  color: ${(p) => p.theme.colors.white};
  max-width: ${(p) => p.theme.screen.xs};

  @media (min-width: ${(p) => p.theme.screen.md}) {
    display: flex;
  }
`;

const Heading = styled(H1)`
  margin-bottom: ${(p) => p.theme.spacing.sm};
`;

const Form = styled.div`
  padding: ${(p) => p.theme.spacing.md};
  border-radius: ${(p) => p.theme.radius.sm};
  background-color: rgba(255, 255, 255, 0.8);
  width: 100%;

  @media (min-width: ${(p) => p.theme.screen.sm}) {
    width: 450px;
  }
`;

/**
 * Sign Up page
 */
const SignUp = ({ history, refetch }) => {
  const [error, setError] = useState('');
  const [values, setValues] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });
  const [signup, { loading }] = useMutation(SIGN_UP);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const validate = () => {
    if (!fullName || !email || !username || !password) {
      return 'Bạn đang điền thiếu gì đó 😶';
    }

    if (fullName.length > 50) {
      return 'Tên đầy đủ không quá 50 ký tự';
    }

    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(String(email).toLowerCase())) {
      return 'Bạn nhập email sai rồi 📧';
    }

    const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
    if (!usernameRegex.test(username)) {
      return 'Tên đăng nhập là ký tự, số, gạch dưới và chấm';
    } else if (username.length > 20) {
      return 'Tên đăng nhập không quá 20 ký tự';
    }

    if (password.length < 6) {
      return 'Mật khẩu tối thiểu 6 ký tự';
    }

    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      setError(error);
      return false;
    }

    try {
      const response = await signup({
        variables: { input: { fullName, email, password, username } },
      });
      localStorage.setItem('token', response.data.signup.token);
      await refetch();
      history.push(Routes.HOME);
    } catch (error) {
      setError(error.graphQLErrors[0].message);
    }
  };

  const { fullName, email, password, username } = values;
  return (
    <Root maxWidth="lg">
      <Head />

      <Welcome>
        <div>
          <Heading color="white">Kết nối với mọi người xung quanh bạn</Heading>
        </div>

        <p>Cập nhật thông tin về những người bạn</p>
        <p>Theo dõi những điều yêu thích </p>
        <p>Lắng nghe những điều mọi người quan tâm</p>
      </Welcome>

      <Form>
        <Spacing bottom="md">
          <H1>Tạo tài khoản</H1>
        </Spacing>

        <form onSubmit={(e) => handleSubmit(e, signup)}>
          <InputText
            type="text"
            name="fullName"
            values={fullName}
            onChange={handleChange}
            placeholder="Tên đầy đủ"
            borderColor="white"
          />
          <Spacing top="xs" bottom="xs">
            <InputText
              type="text"
              name="email"
              values={email}
              onChange={handleChange}
              placeholder="Email"
              borderColor="white"
            />
          </Spacing>
          <InputText
            type="text"
            name="username"
            values={username}
            onChange={handleChange}
            placeholder="Tên đăng nhập"
            borderColor="white"
          />
          <Spacing top="xs" bottom="xs">
            <InputText
              type="password"
              name="password"
              values={password}
              onChange={handleChange}
              placeholder="Mật khẩu"
              borderColor="white"
            />
          </Spacing>
          {error && (
            <Spacing bottom="sm" top="sm">
              <Error>{error}</Error>
            </Spacing>
          )}
          <Spacing top="sm" />
          <Button size="large" disabled={loading}>
            Đăng ký
          </Button>
        </form>
      </Form>
    </Root>
  );
};

SignUp.propTypes = {
  history: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default withRouter(SignUp);
