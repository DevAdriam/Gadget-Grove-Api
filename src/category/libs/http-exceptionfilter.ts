import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";




@Catch(HttpException)
export class HTTPExceptionFilter implements ExceptionFilter {

      catch(exception: any, host: ArgumentsHost) {
            
      }



}