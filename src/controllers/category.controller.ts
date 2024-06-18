import { Body, ConflictException, Delete, Get, HttpCode, Param, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { PrismaService } from 'src/prisma/prisma.service'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { Controller } from '@nestjs/common'

const categoryBodySchema = z.object({
  name: z.string(),
  type: z.string(), 
})

type CategoryBody = z.infer<typeof categoryBodySchema>

@Controller('/categories')
export class CategoryController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(categoryBodySchema))
  async handle(@Body() body: CategoryBody) {

    const { name, type } = categoryBodySchema.parse(body)

    await this.prisma.category.create({
      data: {
        name,
        type,
      },
    })
  }
  
  @Get()
  async list() {
    return this.prisma.category.findMany()
  }

  @Delete('/:id')
  async deleteCategory(@Param('id') id: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        id: id,
      },
    })

    if (!category) {
      throw new ConflictException('Category not found')
    }

    await this.prisma.category.delete({
      where: {
        id: id,
      },
    })
  }

}