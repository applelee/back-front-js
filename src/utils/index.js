// 获取localStorage里的数据
export const getLocalStorage = str => {
  let value = '';

  if (str)
    value = localStorage.getItem(str);

  return value ? value : '';
}

// 设置localStorage里的数据
export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, value);
}

// 数据返回值验证
export const dataVerify = res => {
  if (res) {
    if (!res.code) {
      setLocalStorage('token', null)
      return false;
    }
  }
  else {
    setLocalStorage('token', null)
    return false;
  }

  return true;
}