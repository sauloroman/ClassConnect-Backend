import { Router } from "express";
import { AuthMiddleware, RolesMiddleware } from "../middlewares";
import { Roles } from "../../shared/enums";
import { controllers } from "../../container";

export class ClassroomRoutes {

  public static get routes(): Router {
    const router = Router() 

    const { classroomController } = controllers

    router.post('/', [ 
      AuthMiddleware.validateJWT, 
      RolesMiddleware.allowRoles([ Roles.TEACHER ]) 
    ], classroomController.postClassroom )

    return router
  }

}