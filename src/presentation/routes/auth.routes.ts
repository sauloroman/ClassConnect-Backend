import { Router } from "express";
import { authController } from "../../container";

export class AuthRoutes {

  public static get routes(): Router {

    const router = Router()

    router.post('/validate-user', authController.validateAccount )
    router.post('/resend-code', authController.resendValidationCode )

    return router

  }

}