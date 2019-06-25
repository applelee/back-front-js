/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { routerRedux } from 'dva/router';
import { extend } from 'umi-request';
import { message } from 'antd';
import { getLocalStorage, setLocalStorage } from '@/utils';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  402: '用户认证异常，请重新登录。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = error => {
  const { response, data } = error;
  
  if (response && response.status) {
    let errorText = codeMessage[response.status] || response.statusText;
    const { status } = response;

    if (response.status === 500 && data.error && data.error.indexOf('Authentication failed') > -1)
      errorText = '管理员认证失败，请输入正确的账号与密码！';

    if (response.status === 402) {
      setTimeout(() => {
        setAuthority('');
        setLocalStorage('token', '');
      }, 2000);
    }

    message.error(`请求错误 ${status}: ${errorText}`);

    // notification.error({
    //   message: `请求错误 ${status}: ${url}`,
    //   description: errorText,
    // });
  }
};

/**
 * 配置request请求时的默认参数
 */
export const request = extend({
  maxCache: 10,
  errorHandler, // 默认错误处理
  prefix: 'http://127.0.0.1:3000/api/v1',
  mode: 'cors',
});

export default () => extend({
  maxCache: 10,
  errorHandler, // 默认错误处理
  prefix: 'http://127.0.0.1:3000/api/v1',
  mode: 'cors',
  headers: {
    Authorization: getLocalStorage('token'),
  },
});
