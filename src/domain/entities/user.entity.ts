import { Roles } from "../../shared/enums";
import { CustomError } from "../../shared/errors";

export class UserEntity {

  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public password: string,
    public role: Roles,
    public createdAt: Date,
    public isActive: boolean,
    public isAccountVerified: boolean,
    public lastLogin?: Date,
    public phoneNumber?: string,
    public updatedAt?: Date,
    public avatarUrl?: string,
    public bio?: string,
  ){}

  private static sendErrorForStringTypes = ( prop: string ): CustomError => {
    throw CustomError.badRequest(`No existe ${prop}`)
  }

  public static fromObject( obj: {[key: string]: any}): UserEntity {

    const {
      id, _id,
      firstName, lastName,
      email, password, role, 
      createdAt, lastLogin, isActive,
      isAccountVerified, phoneNumber,
      updatedAt, avatarUrl, bio
    } = obj

    for( const [key, value] of Object.entries( obj ) ) {
      if ( typeof key === 'string' && value === undefined ) {
        this.sendErrorForStringTypes( key )
      }
    }

    return new UserEntity( 
      id, 
      firstName, 
      lastName, 
      email, 
      password, 
      role, 
      createdAt, 
      isActive, 
      isAccountVerified, 
      lastLogin, 
      phoneNumber,
      updatedAt,
      avatarUrl,
      bio
    )

  }

}