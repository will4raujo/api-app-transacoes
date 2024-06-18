import { z } from 'zod'
import { PrismaService } from 'src/prisma/prisma.service'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { Body, ConflictException, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes } from '@nestjs/common'

const transactionBodySchema = z.object({
    value: z.number(),
    description: z.string(),
    categoryId: z.string(),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format"
  }),
})

type TransactionBody = z.infer<typeof transactionBodySchema>

@Controller('/transactions')
export class TransactionsController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(transactionBodySchema))
  async handle(@Body() body: TransactionBody) {
    const { value, description, categoryId, date } = transactionBodySchema.parse(body)

    await this.prisma.transaction.create({
      data: {
        value,
        description,
        categoryId,
        date,
      },
    })
  }

  @Get()
  async list() {
    return this.prisma.transaction.findMany()
  }

  @Put('/:id')
  async updateTransaction(@Param('id') id: string, @Body() body: TransactionBody) {
    const { value, description, categoryId, date } = transactionBodySchema.parse(body)

    await this.prisma.transaction.update({
      where: {
        id: id,
      },
      data: {
        value,
        description,
        categoryId,
        date,
      },
    })
  }

  @Delete('/:id')
  async deleteTransaction(@Param('id') id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: {
        id: id,
      },
    })

    if (!transaction) {
      throw new ConflictException('Transaction not found')
    }

    await this.prisma.transaction.delete({
      where: {
        id: id,
      },
    })
  }

  @Get('/summary')
  async getExpenseSummaryByCategory() {
    const summary = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      _sum: {
        value: true,
      },
      _count: {
        _all: true,
      },
    })

    return summary.map(item => ({
      categoryId: item.categoryId,
      totalValue: item._sum.value,
      transactionCount: item._count._all,
    }))
  }
}