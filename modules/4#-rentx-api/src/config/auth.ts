interface IAuth {
  expireIn: string;
  secret: string;
}

export default {
  expireIn: '1d',
  secret: '15b1c269e2207484d60e5f460eb76119',
} as IAuth;
