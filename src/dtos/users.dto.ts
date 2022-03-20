import { IsEmail, IsString, IsArray, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public firstname: string;

  @IsString()
  public lastname: string;

  @IsEmail()
  public email: string;

  @IsString()
  public password?: string;

  @IsString()
  public contactNumber?: string;

  @IsString()
  public type?: string;

  @IsArray()
  public portfolio?: Array<any>;

  @IsArray()
  public eventsCreated?: Array<any>;

  @IsString()
  public company?: string;

  @IsString()
  public companyType?: string;

  @IsString()
  public pan?: string;

  @IsString()
  public street?: string;

  @IsString()
  public city?: string;

  @IsString()
  public state?: string;

  @IsString()
  public zipCode?: string;

  @IsString()
  public country?: string;

  @IsString()
  public picture?: string;

  @IsString()
  public googleId?: string;

  @IsBoolean()
  public verified?: boolean;
}
