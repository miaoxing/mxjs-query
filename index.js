import useSWR from 'swr';
import $ from 'miaoxing';
import useMutation from './use-mutation';
import { useRef } from 'react';

const useQuery = (key, config) => {
  const result = useSWR(key, async () => {
    // 默认由 $.http 处理加载和错误
    const httpConfig = typeof key === 'string' ? { url: key } : key;
    if (httpConfig.suspense !== false && config?.suspense !== true) {
      httpConfig.suspense = true;
    }

    const res = await $.http(httpConfig);

    const ret = res.ret;
    if (ret.isErr()) {
      let error = new Error(ret.message);
      error.code = ret.code;
      throw error;
    }

    // 允许每次请求后对数据进行处理，可以减少重复渲染
    config?.onLoad && await config.onLoad(ret);

    return ret;
  }, {
    revalidateOnFocus: false,
    ...config
  });

  // 增加 ret 键名，方便调用
  result.ret = result.data;
  const data = result.ret?.data;

  if (config?.promise) {
    const ref = useRef();
    if (!ref.current) {
      ref.current = Promise.withResolvers();
    }
    result.promise = ref.current.promise;

    if (result.error) {
      ref.current.reject(result.error);
    } else if (result.data) {
      ref.current.resolve(data);
    }
  }

  // 更换 data 为接口的 data
  return { ...result, data };
};

export { useQuery, useMutation };
