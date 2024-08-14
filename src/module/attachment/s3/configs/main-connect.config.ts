import { IConnectConfig } from '../interfaces/connect-config.interface';
import * as process from 'process';

// основной коннект подключения у S3
// export const MainConnectConfig: IConnectConfig = {
// 	endpoint: process.env.AWS_ENDPOINT,
// 	region: process.env.AWS_REGION,
// 	credentials: {
// 		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
// 		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// 	},
// 	bucket: process.env.AWS_BUCKET,
// };

export const MainConnectConfig: IConnectConfig = {
	endpoint: 'https://s3.storage.selcloud.ru',
	region: 'ru-1',
	credentials: {
		accessKeyId: 'c07b10a5c552493bb5b1dbdbc21720de',
		secretAccessKey: '8571e1a6e34b4d1792a9b7f917a1bd49',
	},
	bucket: 'dev-iwm',
};
