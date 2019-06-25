import { routerRedux } from 'dva/router';
import { message, Modal } from 'antd';

import { setLocalStorage, dataVerify, delayPromise } from '@/utils';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import { userLogin, userAdminList, userDeleteAdmin } from '@/services/user';

const initUserState = () => {
  return {
    adminList: [],
  }
}

const UserModel = {
  namespace: 'user',
  state: initUserState(),

  effects: {
    *adminList({ payload }, { call, put }) {
      const res = yield call(() => userAdminList(payload));

      yield put({
        type: 'saveAdminList',
        payload: res,
      });
    },

    *deleteAdmin({ payload }, { call, put }) {
      const res = yield call(() => userDeleteAdmin(payload));

      yield put({
        type: 'saveAdminList',
        payload: {data: [], code: 200},
      });
    },
  },

  reducers: {
    saveAdminList(state, { payload }) {
      const { code, data } = payload;

      return {
        ...state,
        adminList: data,
      };
    },
  },
};

export default UserModel;
