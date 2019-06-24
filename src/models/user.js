import { routerRedux } from 'dva/router';
import { message, Modal } from 'antd';

import { setLocalStorage, dataVerify } from '@/utils';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { userLogin, userAdminList } from '@/services/user';

const initUserState = () => {
  return {
    currentUser: {},
    adminList: [],
  }
}

const UserModel = {
  namespace: 'user',
  state: initUserState(),

  effects: {
    *login({ payload }, { call, put }) {
      const res = yield call(() => userLogin(payload));

      if (!res || res.code !== 200) return;

      setLocalStorage('token', res.token);
      setAuthority(res.userType);
      reloadAuthorized();
      message.success('恭喜，登陆成功！');

      yield put(routerRedux.push('/'));
    },

    *adminList({ payload }, { call, put }) {
      const res = yield call(() => userAdminList(payload));

      if (dataVerify(res)) {
        setAuthority('');
        message.error(`${res.name}：${res.message}`);

        yield new Promise((resolve) => {
          setTimeout(() => resolve(), 2000)
        })
        yield put(routerRedux.push('/user/login'));

        return;
      }

      console.log(res)

    }
  },

  reducers: {
    saveAdminList(state) {
      return state;
    },
  },
};

export default UserModel;
