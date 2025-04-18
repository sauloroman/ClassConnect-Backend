import { Roles } from "../../../shared/enums";

export class UpdateUserDto {

  private constructor(
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly password?: string,
    public readonly phoneNumber?: string,
    public readonly bio?: string,
    public readonly avatarUrl?: string,
    public readonly lastLogin?: Date,
    public readonly updatedAt?: Date,
    public readonly isActive?: boolean,
    public readonly isAccountVerified?: boolean,
    public readonly role?: Roles
  ) {}

  public static create( obj: {[key: string]: any} ): UpdateUserDto {

    const {
      firstName,
      lastName,
      password,
      phoneNumber,
      bio,
      avatarUrl,
      lastLogin,
      updateAt,
      isActive,
      isAccountVerified,
      role
    } = obj

    return new UpdateUserDto(
      firstName,
      lastName,
      password,
      phoneNumber,
      bio,
      avatarUrl,
      lastLogin,
      updateAt,
      isActive,
      isAccountVerified,
      role
    )

  } 

}