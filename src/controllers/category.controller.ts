import { Body, ConflictException, Delete, Get, HttpCode, Param, Post, UsePipes, Query } from '@nestjs/common'
import { z } from 'zod'
import { PrismaService } from 'src/prisma/prisma.service'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { Controller } from '@nestjs/common'

const categoryBodySchema = z.object({
  id: z.number().optional(),
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

    const existingCategory = await this.prisma.category.findFirst({
      where: {
        name: name,
      },
    })

    if (existingCategory) {
      throw new ConflictException('Categoria já existe')
    }

    await this.prisma.category.create({
      data: {
        name,
        type,
      },
    })
  }
  
  @Get('/:type')
  async listCategories(@Param('type') type: string) {
    const categories = await this.prisma.category.findMany({
      where: {
        type: type,
      },
    })

    return categories
  }

  @Get()
  async listAllCategories() {
    const categories = await this.prisma.category.findMany()

    return categories
  }
  
  @Delete('/:id')
  async deleteCategory(@Param('id') id: string) {

    const category = await this.prisma.category.findUnique({
      where: {
        id: Number(id),
      },
    })

    const transactions = await this.prisma.transaction.findMany({
      where: {
        categoryId: Number(id),
      },
    })

    if (transactions.length > 0) {
      throw new ConflictException('Não é possível deletar uma categoria com transações associadas')
    }

    if (!category) {
      throw new ConflictException('Categoria não encontrada')
    }

    await this.prisma.category.delete({
      where: {
        id: Number(id),
      },
    })
  }
}