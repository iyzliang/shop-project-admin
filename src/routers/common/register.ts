import { Request, Response } from 'express'
import { ILoginParams } from '@/types'
import { success } from '@/app/baseResult'

export function postRegister (req: Request<{}, {}, ILoginParams>, res: Response) {
  const { userName, password } = req.body
  const result = success<ILoginParams>({
    userName,
    password
  })
  res.json(result)
}
