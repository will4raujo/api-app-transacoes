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
    console.log(name, type)

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
  async deleteCategory(@Param('id') id: number) {
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