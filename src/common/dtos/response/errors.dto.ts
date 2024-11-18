export class InternalServerErrorExceptionDto {
  message: string;
  appCode: string;
  args: Record<string, any>;
}
