import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Input, Button, Form, Icon, message } from 'antd';

import createRquest from '@/utils/request';
import { getLocalStorage } from '@/utils';
import { getAuthority } from '@/utils/authority';

import styles from './index.less';

const request = createRquest();
const { Item } = Form;

const UserLogin = ({ form, dispatch, isLogin }) => {
  const { getFieldDecorator } = form;

  const userLogin = e => {
    e.preventDefault();

    form.validateFields((err, values) => {
      if (isLogin) {
        message.warning('不要重复登录！');
        return;
      }

      !err && dispatch &&
      dispatch({
        type: 'login/submit',
        payload: {
          method: 'POST',
          requestType: 'form',
          data: values,
        },
      });
    });
  };

  return (
    <Form className={styles.login} onSubmit={userLogin}>
      <Item>
        {getFieldDecorator('user', {
          rules: [{ required: true, message: '管理员账号不能为空！' }],
        })(
          <Input
            className={styles.input}
            placeholder="请输入管理员账户"
            prefix={<Icon type="user" className={styles.input} />}
            size="large"
          />
        )}
      </Item>

      <Item>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: '管理员密码不能为空！' }],
        })(
          <Input
            className={styles.input}
            placeholder="请输入管理员密码"
            prefix={<Icon type="lock" className={styles.input} />}
            size="large"
            type="password"
          />
        )}
      </Item>

      {/* <Item>
        {getFieldDecorator('admin')(
          <>
            <Switch />
            <span>管理员登录</span>
          </>
        )}
      </Item> */}

      <Item>
        <Button size="large" type="primary" block onClick={userLogin}>
          登录后台系统
        </Button>
      </Item>
    </Form>
  );
};

const UserLoginForm = Form.create()(UserLogin);

export default connect(({ login: { isLogin } }) => ({
  isLogin,
}))(UserLoginForm);
