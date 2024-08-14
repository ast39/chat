// интерфейс конфига подключения к S3
export interface IConnectConfig {
	endpoint: string;
	region: string;
	credentials: {
		accessKeyId: string;
		secretAccessKey: string;
	};
	bucket: string;
}
