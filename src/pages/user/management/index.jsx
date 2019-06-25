import React, { useState } from 'react';
import { connect } from 'dva';
import { Table, Modal, Button, Form, Input, Icon } from 'antd';

import createRequest from '@/utils/request';
import { dataVerify } from '@/utils';
import { setAuthority } from '@/utils/authority';

import styles from './index.less';

const request = createRequest();
const { Item } = Form;

const UserManagement = ({ dispatch, adminList }) => {
  adminList = adminList.map(v => {
    return {
      ...v,
      ...v.roles[0],
    };
  });

  useState(() => {
    dispatch &&
      dispatch({
        type: 'user/adminList',
        payload: {
          method: 'GET',
        },
      });
  });

  const deleteUser = user => {
    dispatch &&
      dispatch({
        type: 'user/deleteAdmin',
        payload: {
          method: 'POST',
          params: { user },
        },
      });
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'DB',
      dataIndex: 'db',
      key: 'db',
    },
    {
      title: 'Level',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Operation',
      key: 'operation',
      render: o => {
        if (o.role === 'root') return <span>（超级管理员）</span>;

        return (
          // <Popconfirm
          //   title={`是否删除管理员：${o.user}`}
          //   placement='topright'
          //   onConfirm={() => deleteUser(o.user)}
          //   okText='Yes'
          //   cancelText='No'>

          //   <a>删除</a>
          // </Popconfirm>

          <a onClick={() => deleteUser(o.user)}>删除</a>
        );
      },
    },
  ];

  return (
    <>
      {/* <div className={styles.header}>
        <Button type='primary' onClick={() => setIsDraw(true)}>添加管理员</Button>
      </div> */}

      <Table rowKey={'userKey'} columns={columns} dataSource={adminList} pagination={false} />

      {/* <Drawer
        title='添加用户'
        placement='right'
        width={360}
        visible={isDraw}
        onClose={() => setIsDraw(false)}>
        
        <AddUserForm history={history} />
      </Drawer> */}
    </>
  );
};

const AddUser = ({ form, history }) => {
  const { getFieldDecorator } = form;

  const userLogin = e => {
    e.preventDefault();

    form.validateFields((err, values) => {
      if (!err) {
        request('/user/add', {
          method: 'POST',
          data: values,
          requestType: 'form',
        }).then(res => {
          if (!dataVerify(res)) {
            setAuthority('');
            Modal.error({
              title: res.name,
              content: res.message,
              onOk: () => {
                history.push('/user/login');
              },
            });
            return;
          }
        });
      }
    });
  };

  return (
    <Form className={styles.login} onSubmit={userLogin}>
      <Item>
        {getFieldDecorator('user', {
          rules: [{ required: true, message: '管理员账号不能为空！' }],
        })(
          <Input
            placeholder="请输入管理员账户"
            prefix={<Icon type="user" className={styles.input} />}
            size="large"
          />,
        )}
      </Item>

      <Item>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: '管理员密码不能为空！' }],
        })(
          <Input
            placeholder="请输入管理员密码"
            prefix={<Icon type="lock" className={styles.input} />}
            size="large"
            type="password"
          />,
        )}
      </Item>

      <Item>
        <Button size="large" htmlType="submit" type="primary" block onClick={userLogin}>
          添加管理员
        </Button>
      </Item>
    </Form>
  );
};

const AddUserForm = Form.create()(AddUser);

export default connect(({ user }) => ({
  adminList: user.adminList,
}))(UserManagement);
