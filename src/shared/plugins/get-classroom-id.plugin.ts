import { customAlphabet } from "nanoid"
import { envs } from "./envs.plugin"

interface IGetClassroomAdapter {
  generateCode: () => string
}

const { CLASSROOM_CODE_LENGTH } = envs

export const getClassroomIdAdapter: IGetClassroomAdapter = {

  generateCode: (): string => {
    const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789'
    const generateClassroomCode = customAlphabet( alphabet, CLASSROOM_CODE_LENGTH )
    return generateClassroomCode()
  }

}