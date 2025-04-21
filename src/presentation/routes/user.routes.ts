import { Router } from "express";
import { controllers } from "../../container";

export class UserRoutes {

  public static get routes(): Router {

    const router = Router()

    const { userController } = controllers

    router.post('/', userController.postUser )

    return router

  }

}