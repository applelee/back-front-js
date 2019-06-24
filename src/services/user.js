import request from '@/utils/request';

export const userLogin = async options => {
  return request()('/user/login', options);
}

export const userAdminList = async options => {
  return request()('/user/adminList', options);
}
