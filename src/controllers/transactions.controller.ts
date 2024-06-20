import { z } from 'zod'
import { PrismaService } from 'src/prisma/prisma.service'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { Body, ConflictException, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes } from '@nestjs/common'

const transactionBodySchema = z.object({
    value: z.number(),
    description: z.string(),
    categoryId: z.number(),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format"
    }).transform((date) => new Date(date).toISOString()),
})

type TransactionBody = z.infer<typeof transactionBodySchema>

@Controller('/transactions')
export class TransactionsController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(transactionBodySchema))
  async handle(@Body() body: TransactionBody) {
    const { description, value, date, categoryId } = transactionBodySchema.parse(body)
    console.log('passou aqui')
    await this.prisma.transaction.create({
      data: {
        description,
        value,
        date,
        categoryId,
      },
    })
  }

  @Get()
  async list() {
    return this.prisma.transaction.findMany({
      include: {
        category: {
          select: {
            name: true,
          }
        }
      }
    })
  }

  @Get('/:id')
  async getTransactionById(@Param('id') id: string) {
    return this.prisma.transaction.findUnique({
      where: {
        id: id,
      },
    })
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

  @Post('/summary')
  async getExpenseSummaryByCategory() {
    const summary = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      _sum: {
        value: true,
      },
      _count: {
        _all: true,
      },
    });
  
    const categoryIds = summary.map(item => item.categoryId);
    const categories = await this.prisma.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
  
    const categoryMap = categories.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});
  
    return summary.map(item => ({
      categoryName: categoryMap[item.categoryId],
      totalValue: item._sum.value,
      transactionCount: item._count._all,
    }));
  }
}