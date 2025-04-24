import { regularExp } from "./reg-exp.util"

export const extractClassroomUUIDFromUrl = ( url: string ): string | null => {
  const match = url.match( regularExp.qrCodeID )
  return match ? match[1] : null
}