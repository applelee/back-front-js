import { userAdminList, userDeleteAdmin } from '@/services/user';

const initUserState = () => {
  return {
    adminList: [],
  };
};

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
      yield call(() => userDeleteAdmin(payload));
      const res = yield call(() => userAdminList({ method: 'GET' }));

      yield put({
        type: 'saveAdminList',
        payload: res,
      });
    },
  },

  reducers: {
    saveAdminList(state, { payload }) {
      const { data } = payload;

      return {
        ...state,
        adminList: data,
      };
    },
  },
};

export default UserModel;
