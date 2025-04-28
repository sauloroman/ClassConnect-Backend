import { NextFunction, Request, Response } from "express";
import { jwtAdapter, uaParserAdapter } from "../../shared/plugins";
import { Roles } from "../../shared/enums";
import { RepositoriesContainer } from "../../container/repositories.container";
import { SessionInfo } from "../../domain/interfaces";

const { userRepo } = RepositoriesContainer.getInstance()

export class AuthMiddleware {

  public static sessionLogger( req: Request, _: Response, next: NextFunction ): any {
    const sessionInformation = uaParserAdapter.getParserInfoUA( req )
    const { browserName, deviceModel, ip, osName } = sessionInformation

    req.body.sessionInfo = {
      ip: typeof ip === 'string' ? ip : 'Unknown',
      browser: browserName,
      device: deviceModel,
      os: osName
    } as SessionInfo

    next()
  }

  public static async validateJWT( req: Request, res: Response, next: NextFunction ): Promise<any> {
    req.body = {}
    const authorization = req.header('Authorization')
    if ( !authorization ) return res.status(401).json({ ok: false, error: 'Inicia sesión primero' })
    if ( !authorization.startsWith('Bearer ') ) return res.status(401).json({ ok: false, error: 'No hay token'})
  
    const token = authorization.split(' ').at(1) || ''
    try {
      const payload = await jwtAdapter.validateToken<{ id: string, email: string, role: Roles }>( token )
      if ( !payload ) return res.status(401).json({ ok: false, error: 'El token es invalido'})
      
      const user = await userRepo.findById( payload.id )
      
      if ( !user ) return res.status(401).json({ ok: false, error: 'Token Invalido - Usuario no existente'})
      if ( !user.isActive ) return res.status(401).json({ ok: false, error: 'Token Invalido - Usuarion no activo'})

      const { password, ...restUserEntity } = user
      req.body.user = restUserEntity
      next()
    } catch (error) {
      console.log(`${error}`)
      res.status(500).json({ ok: false, error: 'Internal Server Error'})
    }
  }
}