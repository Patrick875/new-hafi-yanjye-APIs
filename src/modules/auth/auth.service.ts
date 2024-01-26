import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { SignInDto } from './dto/sign-in.dto'
import { SignUpDto } from './dto/sign-up.dto'
import { Role } from '../users/entities/user.entity'
import { UserRepository } from '../users/user.repository'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private userRepsitory: UserRepository,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findByEmail(signInDto.email)
    if (user?.password !== signInDto.password) {
      throw new UnauthorizedException()
    }
    const payload = { id: user.id, email: user.email, role: user.role }
    return {
      token: await this.jwtService.signAsync(payload, { expiresIn: '2d' }),
      user,
    }
  }

  async signUp(signUpto: SignUpDto) {
    const user = await this.usersService.findByEmail(signUpto.email)
    if (user) {
      throw new ConflictException()
    }
    const userEntity = await this.usersService.create({
      ...signUpto,
      role: Role.CUSTOMER,
    })
    const newUser = await this.userRepsitory.save(userEntity)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userPublic } = newUser
    return userPublic
  }
}
