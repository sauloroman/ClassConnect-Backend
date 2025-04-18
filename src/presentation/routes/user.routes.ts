import { Router } from "express";
import { userController } from "../../container/user.container";

export class UserRoutes {

  public static get routes(): Router {

    const router = Router()

    router.post('/', userController.postUser )

    return router

  }

}