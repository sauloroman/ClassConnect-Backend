import { envs } from './envs.plugin'
import jwt from 'jsonwebtoken'

const {JWT_SEED} = envs

export const jwtAdapter = {

  generateJWT: async ( payload: any ) => new Promise(( res ) => {
    
    jwt.sign( payload, JWT_SEED, { expiresIn: '3h' }, ( err, token ) => {
      if ( err ) return res( null )
      res( token )
    })

  }),

  validateToken: async <T>( token: string ): Promise<T | null> => new Promise( res => {

    jwt.verify( token, JWT_SEED, ( err, decode ) => {
      if ( err ) return res( null )
      res( decode as T )
    })

  })

} 