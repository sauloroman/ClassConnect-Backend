import { Request, Router } from "express";
import { AuthMiddleware, FileUploadMiddleware, RolesMiddleware } from "../middlewares";
import { Roles } from "../../shared/enums";
import { controllers } from "../../container";

export class ClassroomRoutes {

  public static get routes(): Router {
    const router = Router() 

    const { classroomController } = controllers

    router.post('/join-classroom/code',
      [
        AuthMiddleware.validateJWT,
        RolesMiddleware.allowRoles([ Roles.TEACHER, Roles.STUDENT ])
      ],
      classroomController.joinStudent
    )

    router.put('/upload/image/:classroomId', 
      [ 
        FileUploadMiddleware.validateContainFiles,
        AuthMiddleware.validateJWT,
        RolesMiddleware.allowRoles([ Roles.TEACHER ])
      ], 
      classroomController.uploadImageForClassroom 
    )

    router.post('/', 
      [
        AuthMiddleware.validateJWT, 
        RolesMiddleware.allowRoles([ Roles.TEACHER ])
      ],
      classroomController.postClassroom 
    )

    router.get('/instructor/:instructorId', 
      [ 
        AuthMiddleware.validateJWT ,
        RolesMiddleware.allowRoles([ Roles.TEACHER, Roles.ADMIN ]),
        RolesMiddleware.isTeacherAuthorized,
      ], 
      classroomController.getClassroomsOfInstructor 
    )

    router.put('/create-qrcode/:classroomId', 
      [
        AuthMiddleware.validateJWT, 
        RolesMiddleware.allowRoles([ Roles.TEACHER ])
      ],
      classroomController.getQrCodeForClassroom 
    )

    return router
  }

}