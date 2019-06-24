import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Table, Modal, Button, Drawer, Form, Input, Icon } from 'antd';

import createRequest from '@/utils/request';
import { setLocalStorage, dataVerify } from '@/utils';
import { setAuthority } from '@/utils/authority';

import styles from './index.less';

const request = createRequest();
const { Item } = Form;

const UserManagement = ({ dispatch, history, adminList }) => {
  const [data, setData] = useState([])
  const [isDraw, setIsDraw] = useState(false)

  useEffect(() => {
    if (dispatch)
      dispatch({
        type: 'user/adminList',
        payload: {
          method: 'GET',
        },
      });

    // request('/user/list', {
    //   method: 'GET',
    // })
    // .then(res => {
    //   if (!dataVerify(res)) {
    //     setAuthority('');
    //     Modal.error({
    //       title: res.name,
    //       content: res.message,
    //       onOk: () => {
    //         history.push('/user/login');
    //       },
    //     });
    //     return;
    //   }

    //   setData(res.data.map(v => {
    //     return {
    //       ...v,
    //       dbName: v.roles ? v.roles[0].db : '',
    //       role: v.roles ? v.roles[0].role : '',
    //     }
    //   }));
    // })
  }, [adminList]);

  const columns = [{
    title: 'User',
    dataIndex: 'user',
    key: 'user',
  }, {
    title: 'DB',
    dataIndex: 'db',
    key: 'db',
  }, {
    title: 'Level',
    dataIndex: 'role',
    key: 'role',
  }, {
    title: 'Operation',
    key: 'operation',
    render: o => {
      return (
        <>
          {
            o.role !== 'root' && 
            <a onClick={deleteUser}>删除</a>
            ||
            <span>（超级管理员）</span>
          }
        </>
      )
    }
  }];

  const deleteUser = () => {
    
  }

  return (
    <>
      {/* <div className={styles.header}>
        <Button type='primary' onClick={() => setIsDraw(true)}>添加管理员</Button>
      </div> */}
      
      <Table rowKey={'userKey'} columns={columns} dataSource={data} />

      {/* <Drawer
        title='添加用户'
        placement='right'
        width={360}
        visible={isDraw}
        onClose={() => setIsDraw(false)}>
        
        <AddUserForm history={history} />
      </Drawer> */}
    </>
  )
}

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
        })
        .then(res => {
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
        })
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
          />
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
          />
        )}
      </Item>

      <Item>
        <Button size="large" type="primary" block onClick={userLogin}>
          添加管理员
        </Button>
      </Item>
    </Form>
  );
};

const AddUserForm = Form.create()(AddUser);

export default connect(({ user }) => ({
  adminList: user.adminList,
}))(UserManagement)
