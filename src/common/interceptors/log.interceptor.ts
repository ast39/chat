import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const wsContext = context.switchToWs();
		const client = wsContext.getClient();
		const data = wsContext.getData();

		console.log(`Client connected: ${client.id}`);
		console.log(`Data: ${JSON.stringify(data)}`);

		return next.handle().pipe(tap(() => console.log(`Response sent to client: ${client.id}`)));
	}
}
