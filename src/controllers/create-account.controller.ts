import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ConflictException } from '@nestjs/common'
import { hash } from 'bcrypt'
import { z } from 'zod'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateAccountBody = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreateAccountBody) {

    const { name, email, password } = createAccountBodySchema.parse(body)

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })
    
    if (userWithSameEmail) {
      throw new ConflictException('User with this email already exists')
    }

    const hashedPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
  }
}