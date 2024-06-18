import { Body, Controller, HttpCode, Post, UnauthorizedException, UsePipes } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { z } from 'zod'
import { PrismaService } from '../prisma/prisma.service'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBody = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBody) {

    const { email, password } = authenticateBodySchema.parse(body)
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      console.log('Invalid credentials')
      throw new UnauthorizedException('Invalid credentials')
    }

    const token = this.jwt.sign({ userId: user.id })

    return { token }

  }
}