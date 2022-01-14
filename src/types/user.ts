export interface IRefreshToken {
  token: string,
  expiresIn: number
}

export interface IUserSchema {
  userId: number;
  userName: string;
  password: string;
  phone?: string;
  /**
   * 添加时间
   */
  addTime?: string;
  /**
   * 修改时间
   */
  upTime?: string;
  /**
   * 刷新token
   */
  refreshToken?: IRefreshToken;
}

export interface IParamsRegister {
  userName: string;
  password: string;
  passwordAgain: string;
  phone?: string;
}

export interface IResponseRegister {
  userName: string;
  userId: number;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface IParamsLogin {
  userName: string;
  password: string;
}

export interface IParamsRefreshToken {
  refreshToken: string;
}
