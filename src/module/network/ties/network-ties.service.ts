import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import * as process from 'process';

@Injectable()
export class NetworkTiesService {
	// Команда удаления парт. связей в сервисе TIES
	async detachPartner(jwtToken: string, partnerId: string): Promise<any> {
		console.log('jwtToken: ' + jwtToken);
		console.log('partnerId: ' + partnerId);
		console.log('url: ' + `${process.env.TIES_SERVICE}network/partners/detach/${partnerId}`);
		console.log('Service-Auth: ' + process.env.TIES_SERVICE_ACCESS_TOKEN);
		try {
			const serviceAuthToken = 'fiAsmGMhnDSfg?YkA?2QRUdO=a215cp0!ZgX?ijUslA?j!zXcEvXQgZnHkmxf1v9uQF1CyjPYJNPNKeVYZhXTOJG-v8dY=IgTc6u-ZbSEa0WM3n1yo2aRuKMDe?AKyxe';
			const response: AxiosResponse = await axios.delete(
				`${process.env.TIES_SERVICE}network/partners/detach/${partnerId}`,
				{
					headers: {
						'Authorization': `${jwtToken}`,
						'Service-Auth': serviceAuthToken,
						// 'Service-Auth': process.env.TIES_SERVICE_ACCESS_TOKEN,
						'Content-Type': 'application/json',
						'Accept': 'application/json',
					},
				},
			);
			console.log('response.data: ' + JSON.stringify(response.data, null, 2));
			return response.data;
		} catch (error) {
			console.log('error: ' + error);
			return null;
		}
	}
}
