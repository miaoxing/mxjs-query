import useSWR from 'swr';
import $ from 'miaoxing';
import useMutation from './use-mutation';

const useQuery = (key, config) => {
  const result = useSWR(key, async () => {
    const res = await $.http(key);

    const ret = res.ret;
    if (ret.isErr()) {
      let error = new Error(ret.message);
      error.code = ret.code;
      throw error;
    }

    // 允许每次请求后对数据进行处理，可以减少重复渲染
    config?.onLoad && await config.onLoad(ret);

    return ret;
  }, config);

  // 增加 ret 键名，方便调用
  result.ret = result.data;
  const data = result.ret?.data;

  // 更换 data 为接口的 data
  return { ...result, data };
};

export { useQuery, useMutation };
