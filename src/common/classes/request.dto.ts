import { toBoolean } from '@common/utils/utils';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';

export enum OrderBy {
  ASC = 'asc',
  DESC = 'desc',
}

export class PageRequestDto {
  @ApiPropertyOptional({
    type: OrderBy,
    enum: OrderBy,
    default: OrderBy.DESC,
  })
  @IsEnum(OrderBy)
  @IsOptional()
  readonly order?: OrderBy = OrderBy.DESC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Transform(({ value }) => +value)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @Transform(({ value }) => +value)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  readonly limit?: number = 10;

  get offset(): number {
    return (this.page - 1) * this.limit;
  }

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  getAll?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly search?: string;
}

export class RangeDateRequestDto extends PageRequestDto {
  @ApiPropertyOptional({
    type: Date,
    required: false,
  })
  @IsNotEmpty()
  @ValidateIf((dto) => dto.getAll)
  readonly fromDate?: Date;

  @ApiPropertyOptional({
    type: Date,
    required: false,
  })
  @IsNotEmpty()
  @ValidateIf((dto) => dto.getAll)
  readonly toDate?: Date;
}
