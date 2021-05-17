interface ICreateUserTokenDTO {
  user_id: string;
  expires_at: Date;
  token: string;
}
export { ICreateUserTokenDTO };
