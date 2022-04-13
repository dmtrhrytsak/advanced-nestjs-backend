import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ValidationException } from 'src/exceptions/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const obj = plainToClass(metadata.metatype, value);
    const errors = await validate(obj);

    if (errors.length) {
      console.log(errors);

      const messages = errors.map(
        (error) =>
          `${error.property} - ${Object.values(error.constraints).join(', ')}`
      );

      throw new ValidationException(messages);
    }

    return value;
  }
}
