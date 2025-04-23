import { NextFunction, Request, Response } from "express";
import { Roles } from "../../shared/enums";

export class RolesMiddleware {

  public static isAdmin( req: Request, res: Response, next: NextFunction ): any {
    const { user } = req.body
    if ( !user ) return res.status(401).json({ ok: false, error: 'Usuario no autenticado' })
    
    if ( user.role !== Roles.ADMIN ) return res.status(403).json({ ok: false, error: 'Acceso denegado: solo los administradores pueden realizar esta acción.' })

    next()
  }

}