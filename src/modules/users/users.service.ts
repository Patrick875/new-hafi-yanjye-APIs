import { ConflictException, Inject, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRepository } from './user.repository'
import { generateRandomPassword } from 'src/utils/generate-password'
import { EmailOption, MailService } from 'src/utils/emails'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @Inject(MailService) private mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.findByEmail(createUserDto.email)
    if (user) {
      throw new ConflictException('User with the same Email already exists')
    }
    const password = generateRandomPassword()

    const userEntity = this.userRepository.create({
      ...createUserDto,
      password,
    })

    const emailOption: EmailOption = {
      to: userEntity.email,
      subject: 'HafiYanjye - New Account Creation',
      text: `Hello ${userEntity.fullName}, <br> Your new account has been created as ${userEntity.role}, <br> use the generated creadentials to access the application or change your password
      <br>
      <br>
      <b>Email: </b> ${userEntity.email} <br>
      <b>Password: </b> ${password} <br>
      `,
    }

    this.mailService.sendResetEmail(emailOption)
    return this.userRepository.save(userEntity)
  }

  findAll() {
    return this.userRepository.find()
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({ where: { id } })
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto)
  }

  remove(id: number) {
    return this.userRepository.delete(id)
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.getUserByEmail(email)
    return user
  }
}
