import { Router } from "express";
import { controllers } from "../../container";
import { AuthMiddleware } from "../middlewares";
import { RolesMiddleware } from "../middlewares/roles.middleware";

export class UserRoutes {

  public static get routes(): Router {

    const router = Router()

    const { userController } = controllers
    
    //* PRIVATE ROUTES
    router.get('/', [ AuthMiddleware.validateJWT, RolesMiddleware.isAdmin ], userController.getAllUsers )
    router.put('/deactivate/:id', [ AuthMiddleware.validateJWT ], userController.deactivateUser )
    router.put('/update/:id', [ AuthMiddleware.validateJWT ], userController.updateUserInfo )

    //* PUBLIC ROUTES
    router.post('/', userController.postUser )

    return router

  }

}