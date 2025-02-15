import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateVehicleDto {
  @ApiProperty()
  @IsString()
  brand: string;

  @ApiProperty()
  @IsString()
  model: string;

  @ApiProperty()
  @IsString()
  plate: string;

  @ApiProperty()
  @IsString()
  year: string;

  @ApiProperty({ type: User })
  @IsOptional()
  @ValidateNested()
  @Type(() => User)
  user?: User;
}
