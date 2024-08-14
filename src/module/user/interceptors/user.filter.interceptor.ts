import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserFilterInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest();
		const query = request.query;

		if (query.status != undefined) {
			request.query.status = query.status.split(',');
		}

		return next.handle();
	}
}
