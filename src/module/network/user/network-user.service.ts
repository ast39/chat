import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import * as process from 'process';

@Injectable()
export class NetworkUserService {
	ROOT_TOKEN =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluMTExLW93bnItYWRtbi1yb290LWFkbWluaXN0cmF0ciIsIm5hbWUiOiJSb290IFVzZXIiLCJhdmF0YXIiOm51bGwsImlhdCI6MTcyMDA0NDAwNSwiZXhwIjoxODc3NzI0MDA1fQ.LsX6aZ3Zg4LS-saqLjQrYenMTP4JFPt9kaq_h4sMdPY';

	// Инфа о пользлователе с серввиса юзеров
	async getUser(userId: string): Promise<any> {
		try {
			const response: AxiosResponse = await axios.get(`${process.env.USER_SERVICE}sync/${userId}`, {
				headers: {
					'Authorization': `${this.ROOT_TOKEN}`,
					'Service-Auth': process.env.USERS_SERVICE_ACCESS_TOKEN,
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
			});
			return response.data;
		} catch (error) {
			return null;
		}
	}
}
