import useSWRMutation from 'swr/mutation';

const useMutation = (key, config) => {
  return useSWRMutation(key, async (key) => {
    // 默认为 POST 请求，由 $.http 处理加载和错误
    const httpConfig = typeof key === 'string' ? { url: key, method: 'POST' } : key;

    const { ret } = await $.http(httpConfig);
    $.ret(ret);

    if (ret.isErr()) {
      let error = new Error(ret.message);
      error.code = ret.code;
      throw error;
    }

    return ret.data;
  }, {
    ...config,
  });
};

export default useMutation;
