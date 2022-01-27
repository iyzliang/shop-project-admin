export interface IUserSchema {
  userId: number;
  userName: string;
  password: string;
  phone: string;
  /**
   * 添加时间
   */
  addTime: string;
  /**
   * 修改时间
   */
  upTime: string;
}

export interface IBodyRegister {
  userName: string;
  password: string;
  passwordAgain: string;
  phone?: string;
}

export interface IBodyLogin {
  userName: string;
  password: string;
}
export interface IResponseRegister {
  userName: string;
  userId: number;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface IBodyRefreshToken {
  refreshToken: string;
}

export interface IResponseRefreshToken {
  accessToken: string;
  expiresIn: number;
}

export interface ITokenModel {
  token: string,
  expiresIn: number
}
