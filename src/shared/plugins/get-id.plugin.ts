import { envs } from "./envs.plugin"
import { customAlphabet } from "nanoid"
import { v4 as uuidv4 } from 'uuid'

interface IGetClassroomAdapter {
  classroomCode: () => string,
  uuid: () => string,
}

const { CLASSROOM_CODE_LENGTH } = envs

export const getIdAdapter: IGetClassroomAdapter = {

  classroomCode: (): string => {
    const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789'
    const generateClassroomCode = customAlphabet( alphabet, CLASSROOM_CODE_LENGTH )
    return generateClassroomCode()
  },

  uuid: () => uuidv4()
}