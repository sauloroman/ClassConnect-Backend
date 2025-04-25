import { NextFunction, Request, Response } from "express";
import { Roles } from "../../shared/enums";
import { RepositoriesContainer } from "../../container/repositories.container";

const { classroomRepo, enrollmentRepo } = RepositoriesContainer.getInstance()

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

  public static isTeacherAuthorized( req: Request, res: Response, next: NextFunction ): any {
    const { user } = req.body 
    
    if ( user.role === Roles.ADMIN ) {
      return next()
    }

    const { instructorId } = req.params

    if ( user.role === Roles.TEACHER && user.id !== instructorId ) {
      return res.status(401).json({ ok: false, error: 'No estas autorizado para realizar esta accion'})
    }

    next()
  }

  public static async canAccessToStudentsOfClassroom( req: Request, res: Response, next: NextFunction ): Promise<any> {

    const { classroomId } = req.params
    const { user } = req.body

    if ( !classroomId ) return res.status(400).json({ ok: false, error: 'El classroom id es necesario' })

    if ( user.role === Roles.ADMIN ) return next()

    if ( user.role === Roles.TEACHER ) {
      const classroom = await classroomRepo.getClassroomById( classroomId )
      if ( classroom?.instructorId !== user.id ) {
        return res.status(401).json({ ok: false, error: 'No eres el instructor de esta aula'})
      }
      return next()
    }

    if ( user.role === Roles.STUDENT ) {
      const isEnrolled = await enrollmentRepo.isStudentInClassroom( user.id, classroomId )
      if ( !isEnrolled ) {
        return res.status(401).json({ ok: false, error: 'No estás inscrito en el classroom'})
      }
      return next()
    }

    next()
  }

  public static validateUserDesactivation ( req: Request, res: Response, next: NextFunction ): any {

    const { user } = req.body
    const { id: userIdToDeactivate } = req.params

    if ( user.role === Roles.ADMIN ) return next()

    if ( user.id !== userIdToDeactivate ) {
      return res.status(401).json({ ok: false, error: 'No tienes permitido eliminar a este usuario' })
    }

    next()
  } 

}