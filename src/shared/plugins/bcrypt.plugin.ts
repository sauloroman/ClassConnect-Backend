import { compareSync, genSaltSync, hashSync } from 'bcryptjs'

interface IBcruptAdapter {
  hash: ( password: string ) => string,
  compare: ( password: string, hashPassword: string ) => boolean
}

export const bcryptAdapter: IBcruptAdapter = {
  hash: ( password: string ) => {
    const salt = genSaltSync()
    return hashSync(password, salt)
  },

  compare: ( password: string, hashPassword: string ): boolean => {
    return compareSync( password, hashPassword )
  }
}