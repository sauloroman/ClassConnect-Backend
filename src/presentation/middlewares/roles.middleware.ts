import { NextFunction, Request, Response } from "express";
import { Roles } from "../../shared/enums";

export class RolesMiddleware {

  public static allowRoles = ( roles: Roles[] ) => {
    return ( req: Request, res: Response, next: NextFunction ): any => {

      const { user } = req.body

      if ( !user ) return res.status(401).json({ ok: false, error: 'Usuario no autenticado' })
      
      if ( !roles.includes( user.role ) ) {
        return res.status(403).json({ 
          ok: false, 
          error: `Acceso denegado: para realizar esta accion se require uno de los siguintes roles: ${roles.join(', ')}` 
        })
      }
  
      next()
    }  
  }


}