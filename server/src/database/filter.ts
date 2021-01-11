
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import {MongoError} from 'mongodb';
import { UniqueValidationError } from './models/product';

@Catch(UniqueValidationError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: UniqueValidationError, host: ArgumentsHost) {
        //if(exception.code==11000){
            const response = host.switchToHttp().getResponse();
            //const request = ctx.getRequest();
            response.status(200).json({
                status: false,
                //error: exception.error,
                message: exception.error.message
            });
        //}
    }
}