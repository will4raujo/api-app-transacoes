import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { ZodSchema, ZodError } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) { }

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      return this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          statusCode: 400,
          error: error.format(),
        })
      }
      throw new BadRequestException("Validation failed")
    }

    return value
  }
}