import { IsString, IsArray, IsBoolean, IsNumber, IsDateString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  public name: string;

  @IsString()
  public description: string;

  @IsString()
  public category: string;

  @IsNumber()
  public expectedFunding: string;

  @IsString()
  public location: string;

  @IsString()
  public meetingURL: string;

  @IsString()
  public meetingPassword?: string;

  @IsDateString()
  public pitchDate: Date;

  @IsString()
  public startDate: string;

  @IsString()
  public detailedInformation: string;

  @IsString()
  public highlightingImageVideoURL: string;

  @IsString()
  public status: string;

  @IsString()
  public creatorId: string;

  @IsString()
  public creatorName: string;

  @IsBoolean()
  public isEventPublished: boolean;

  @IsArray()
  public subscribers: Array<string>;

  @IsArray()
  public backers: Array<string>;

  @IsNumber()
  public viewCount: number;
}
