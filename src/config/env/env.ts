export const isDev = () => {
  return (
    process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
  );
};

export const isProd = () => {
  return process.env.NODE_ENV === 'production';
};
