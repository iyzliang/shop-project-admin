export interface IPictureSchema {
  id: number;
  name: string;
  /**
   * 文件后缀
   */
  extension: string;
  /**
   * MIME 类型
   */
  mimetype: string | null;
  addTime: string;
  upTime: string;
  createUserId: number;
}
