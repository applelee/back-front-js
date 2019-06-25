import { routerRedux } from 'dva/router';
import { message, Modal } from 'antd';

import { setLocalStorage, dataVerify, delayPromise } from '@/utils';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { userLogin, userAdminList } from '@/services/user';

const initUserState = () => {
  return {
    isLogin: false,
  }
}

const UserModel = {
  namespace: 'login',
  state: initUserState(),

  effects: {
    *submit({ payload }, { call, put }) {
      const res = yield call(() => userLogin(payload));

      if (!res || res.code !== 200) return;

      setLocalStorage('token', res.token);
      setAuthority(res.userType);
      reloadAuthorized();
      message.success('恭喜，登陆成功！');

      yield put({
        type: 'login',
      })
      yield delayPromise(2000);
      yield put(routerRedux.push('/'));
    },
  },

  reducers: {
    login(state) {
      return {
        ...state,
        isLogin: true,
      };
    },

    logout(state) {
      return {
        ...state,
        isLogin: false,
      };
    },
  },
};

export default UserModel;
