import { AuthController, ClassroomController, UserControllers } from "../presentation/controllers";
import { authService, classroomService, userService } from "./services.container";

export const controllers = {
  userController: new UserControllers( userService ),
  authController: new AuthController( authService ),
  classroomController: new ClassroomController( classroomService )
}