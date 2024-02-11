import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { SignInDto } from './dto/sign-in.dto'
import { SignUpDto } from './dto/sign-up.dto'
import { Role } from '../users/entities/user.entity'
import { UserRepository } from '../users/user.repository'
import { BcryptService } from './bcrypt.service'
import { PasswordResetDto } from './dto/password-reset.dto'
import { MailService } from 'src/utils/emails'
import { UpdatepasswordDto } from './dto/updatate-password.dto'
import { ConfigService } from '@nestjs/config'
import { ChangePasswordDto } from './dto/change-password.dto'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private userRepsitory: UserRepository,
    private readonly bcryptService: BcryptService,
    private mailService: MailService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findByEmail(signInDto.email)

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }
    if (
      !(await this.bcryptService.compare(signInDto.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid credentials')
    }
    const payload = { id: user.id, email: user.email, role: user.role }
    return {
      token: await this.jwtService.signAsync(payload, { expiresIn: '2d' }),
      user,
    }
  }

  async signUp(signUpto: SignUpDto) {
    const userEntity = this.userRepsitory.create({
      ...signUpto,
      role: Role.CUSTOMER,
      password: await this.bcryptService.hash(signUpto.password),
    })
    const newUser = await this.userRepsitory.save(userEntity)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userPublic } = newUser
    return userPublic
  }

  async resetPassword(passwordResetDto: PasswordResetDto) {
    const user = await this.usersService.findByEmail(passwordResetDto.email)

    if (!user) {
      throw new NotFoundException('User not found')
    }
    const payload = { id: user.id, email: user.email, role: user.role }

    const token = await this.jwtService.signAsync(payload, { expiresIn: '30m' })

    const emailOption = {
      to: user.email,
      subject: `Reset password`,
      text: `Click the following <a href=' ${this.configService
        .get<string>}/password/reset/${token}' > Link  <a> to reset your password: `,
    }

    return this.mailService.sendResetEmail(emailOption)
  }

  async updatePassword(token: string, updatePasswordDto: UpdatepasswordDto) {
    const updatePasswordPayload = await this.jwtService
      .verifyAsync(token)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((err) => {
        throw new BadRequestException('Invalid token ')
      })

    const user = await this.usersService.findByEmail(
      updatePasswordPayload.email,
    )
    if (!user) {
      throw new NotFoundException('User not found')
    }
    const userEntity = this.userRepsitory.create({
      ...user,
      password: await this.bcryptService.hash(updatePasswordDto.newPassword),
    })
    return this.userRepsitory.save(userEntity)
  }

  async changePassword(token: string, changePasswordDto: ChangePasswordDto) {
    const userPayload = await this.jwtService
      .verifyAsync(token)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((err) => {
        throw new BadRequestException('Invalid token ')
      })

    const user = await this.userRepsitory.findOne({
      where: { email: userPayload.email },
    })
    if (
      !(await this.bcryptService.compare(
        changePasswordDto.password,
        user.password,
      ))
    ) {
      throw new UnauthorizedException('Old password is incorrect')
    }

    const newHasedPassword = await this.bcryptService.hash(
      changePasswordDto.newPassword,
    )

    const userEntity = this.userRepsitory.create({
      ...user,
      password: newHasedPassword,
    })

    return this.userRepsitory.save(userEntity)
  }
}
