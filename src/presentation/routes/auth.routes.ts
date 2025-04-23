import { Router } from "express";
import { controllers } from "../../container";
import { AuthMiddleware } from "../middlewares";

export class AuthRoutes {

  public static get routes(): Router {

    const router = Router()

    const { authController } = controllers

    //* PRIVATE ROUTES
    router.get('/renew-token', [ AuthMiddleware.validateJWT ], authController.renewToken )
    router.get('/login-session/:userId', [AuthMiddleware.validateJWT], authController.getUserLoginSessions )
    
    //* PUBLIC ROUTES
    router.post('/login', [ AuthMiddleware.sessionLogger ], authController.login )
    router.post('/validate-account', authController.validateAccount )
    router.post('/resend-verification-code', authController.resendValidationCode )
    router.post('/forgot-password', authController.forgotPassword )
    router.post('/change-password', authController.changePassword )
    

    return router

  }

}