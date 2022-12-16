import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional } from "class-validator"

export class BuildCampDto {
  @ApiProperty({
    description: '营地名称',
  })
  @IsNotEmpty()
  camp_name: string

  @ApiProperty({
    description: '营地描述',
  })
  @IsOptional()
  camp_desc: string

  @ApiProperty({
    description: '营地容纳人数',
    default: 32
  })
  @IsOptional()
  camp_capacity: number

  @ApiProperty({
    description: '是否私人',
    default: false,
  })
  @IsOptional()
  personal: boolean
}

export class JoinCampDto {
  @ApiProperty({
    description: '营地id',
  })
  @IsNotEmpty()
  camp_id: string
}
