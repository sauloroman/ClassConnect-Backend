import { Router } from "express";
import { controllers } from "../../container";

export class AuthRoutes {

  public static get routes(): Router {

    const router = Router()

    const { authController } = controllers

    router.post('/login', authController.login )
    router.post('/validate-account', authController.validateAccount )
    router.post('/resend-verification-code', authController.resendValidationCode )

    return router

  }

}