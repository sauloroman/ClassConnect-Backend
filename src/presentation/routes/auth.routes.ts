import { Router } from "express";
import { controllers } from "../../container";
import { LoginSessionMiddleware } from "../middlewares";

export class AuthRoutes {

  public static get routes(): Router {

    const router = Router()

    const { authController } = controllers

    //* PRIVATE ROUTES
    // TODO: Realizar middlerawe de autenticacion
    router.get('/login-session/:userId', authController.getUserLoginSessions )
    
    //* PUBLIC ROUTES
    router.post('/login', [ LoginSessionMiddleware.sessionLogger ], authController.login )
    router.post('/validate-account', authController.validateAccount )
    router.post('/resend-verification-code', authController.resendValidationCode )
    router.post('/forgot-password', authController.forgotPassword )
    router.post('/change-password', authController.changePassword )
    

    return router

  }

}