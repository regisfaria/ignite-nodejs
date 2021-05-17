interface IAuth {
  expiresInToken: string;
  expiresInRefreshToken: string;
  secretToken: string;
  secretRefreshToken: string;
}

export default {
  expiresInToken: '1d',
  expiresInRefreshToken: '30d',
  secretToken: '15b1c269e2207484d60e5f460eb76119',
  secretRefreshToken: '0235d7f7e8125ffdcf76663e6ec37c04',
} as IAuth;
