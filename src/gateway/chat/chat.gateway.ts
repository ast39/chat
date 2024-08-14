import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as process from 'process';
import { JwtService } from '@nestjs/jwt';
import { MyLoggerService } from '../../common/logger/my-logger.service';
import { WsChatMessageDto } from './dto/ws-chat-message.dto';
import { WsChatReadDto } from './dto/ws-chat-read.dto';
import { ChatCmsService } from "../../module/chat/chat-cms.service";

@WebSocketGateway(+process.env.SOCKET_PORT, {
	namespace: 'message',
	cors: { origin: '*' }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;

	private clientMap: Map<string, Socket> = new Map();
	private typingUsers: Map<string, Set<string>> = new Map();
	private voiceRecordUsers: Map<string, Set<string>> = new Map();

	constructor(
		private readonly logger: MyLoggerService,
		private readonly jwtService: JwtService,
	) {}

	afterInit() {
		this.logger.log('Info: WebSocket Server Init Successfully');
	}

	handleConnection(@ConnectedSocket() client: Socket): any {
		const accountId = this.validateClient(client);
		if (!accountId) return;
		if (!this.clientMap.has(client.id)) {
			this.clientMap.set(client.id, client);
			this.logger.log(`Info :: Connected: Client - ${client.id}; Account - ${accountId}`);
		}
	}

	handleDisconnect(@ConnectedSocket() client: Socket) {
		const accountId = this.validateClient(client);
		if (!accountId) return;
		this.removeUserFromAllMaps(client.id);
		client.disconnect(true);
		this.logger.log(`Info :: Disconnected: Client - ${client.id}; Account - ${accountId}`);
	}

	// Присоединиться к чату
	@SubscribeMessage('joinChat')
	async handleJoinRoom(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: { chatId: number },
	): Promise<WsResponse<any>> {
		const accountId = this.validateClient(client);
		if (!accountId) return;
		client.join(data.chatId.toString());
		this.logger.log(`Info: Client ${accountId} joined to chat ${data.chatId}`);
		return { event: 'joinChat', data: { socketClient: client.id, accountId: accountId, chatId: data.chatId } };
	}

	// Отключиться от чата
	@SubscribeMessage('leaveChat')
	async handleLeaveRoom(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: { chatId: number },
	): Promise<WsResponse<any>> {
		const accountId = this.validateClient(client);
		if (!accountId) return;
		client.leave(data.chatId.toString());
		this.logger.log(`Info :: Leave The Chat: Client = ${client.id}; Account - ${accountId}`);
		return { event: 'leaveChat', data: { socketClient: client.id, accountId: accountId, chatId: data.chatId } };
	}

	// Пользователь написал сообщение
	@SubscribeMessage('sendMessage')
	handleSyncMessage(@MessageBody() data: WsChatMessageDto) {
		this.server.to(data.chatId.toString()).emit('syncMessage', data);
		this.logger.log(
			`Info :: New Message: Chat - ${data.chatId}; Client - ${data.senderId}; Account - ${data.senderId}`,
		);
		return { event: 'sendMessage', data: data };
	}

	// Пользователь прочитал сообщения
	@SubscribeMessage('readChat')
	handleReadChat(@MessageBody() data: WsChatReadDto) {
		this.server.to(data.chatId.toString()).emit('syncReadStatus', data);
		this.logger.log(`Info :: User Read Message: Chat - ${data.chatId}; Account - ${data.readerId}`);
		return { event: 'syncReadStatus', data: data };
	}

	// Пользователь печатает
	@SubscribeMessage('startTyping')
	handleStartTyping(@MessageBody() data: { chatId: number; userId: string }, @ConnectedSocket() client: Socket) {
		const accountId = this.validateClient(client);
		if (!accountId) return;
		client.join(data.chatId.toString());
		this.updateUserStatus(this.typingUsers, data, 'add');
		this.server.to(data.chatId.toString()).emit('userTyping', data);
		this.logger.log(`Info :: Start Typing: Client = ${client.id}; Account - ${accountId}; Chat - ${data.chatId}`);
		return { event: 'startTyping', data: { socketClient: client.id, accountId: accountId, chatId: data.chatId } };
	}

	// Пользователь перестал печатать
	@SubscribeMessage('stopTyping')
	handleStopTyping(@MessageBody() data: { chatId: number; userId: string }, @ConnectedSocket() client: Socket) {
		const accountId = this.validateClient(client);
		if (!accountId) return;
		this.updateUserStatus(this.typingUsers, data, 'remove');
		this.server.to(data.chatId.toString()).emit('userStopTyping', data);
		this.logger.log(`Info :: Start Typing: Client = ${client.id}; Account - ${accountId}; Chat - ${data.chatId}`);
		return { event: 'stopTyping', data: { socketClient: client.id, accountId: accountId, chatId: data.chatId } };
	}

	// Пользователь записывает голосовуху
	@SubscribeMessage('startVoice')
	handleStartVoice(@MessageBody() data: { chatId: number; userId: string }, @ConnectedSocket() client: Socket) {
		const accountId = this.validateClient(client);
		if (!accountId) return;
		client.join(data.chatId.toString());
		this.updateUserStatus(this.voiceRecordUsers, data, 'add');
		this.server.to(data.chatId.toString()).emit('userStartVoice', data);
		this.logger.log(`Info :: Start Voice Record: Client = ${client.id}; Account - ${accountId}; Chat - ${data.chatId}`);
		return { event: 'startVoice', data: { socketClient: client.id, accountId: accountId, chatId: data.chatId } };
	}

	// Пользователь перестал записывать голосовуху
	@SubscribeMessage('stopVoice')
	handleStopVoice(@MessageBody() data: { chatId: number; userId: string }, @ConnectedSocket() client: Socket) {
		const accountId = this.validateClient(client);
		if (!accountId) return;
		this.updateUserStatus(this.voiceRecordUsers, data, 'remove');
		this.server.to(data.chatId.toString()).emit('userStopVoice', data);
		this.logger.log(`Info :: Stop Voice Record: Client = ${client.id}; Account - ${accountId}; Chat - ${data.chatId}`);
		return { event: 'stopVoice', data: { socketClient: client.id, accountId: accountId, chatId: data.chatId } };
	}

	// Работа с картами
	private updateUserStatus(
		map: Map<string, Set<string>>,
		data: { chatId: number; userId: string },
		action: 'add' | 'remove',
	) {
		const userId = data.userId;
		const chatId = data.chatId.toString();

		if (!map.has(chatId)) {
			map.set(chatId, new Set());
		}

		const userSet = map.get(chatId);
		if (userSet) {
			if (action === 'add') {
				userSet.add(userId);
			} else {
				userSet.delete(userId);
				if (userSet.size === 0) {
					map.delete(chatId);
				}
			}
		}
	}

	// Убрать клиента из всех карт
	private removeUserFromAllMaps(userId: string) {
		const maps = [this.typingUsers, this.voiceRecordUsers];
		const events = ['userStoppedTyping', 'userStoppedRecordVoice'];

		maps.forEach((map, index) => {
			map.forEach((userSet, chatId) => {
				if (userSet.has(userId)) {
					userSet.delete(userId);
					if (userSet.size === 0) {
						map.delete(chatId);
					}
					this.server.to(chatId).emit(events[index], { userId });
				}
			});
		});
	}

	// Гуард доступа к сокетам
	private validateClient(client: Socket): string | null {
		const accountId = this.getAccountIdFromToken(client);
		if (!accountId) {
			client.disconnect();
			this.logger.log('Err: Token not provided');
			return null;
		}
		return accountId;
	}

	// Получить пользователя из токена
	private getAccountIdFromToken(client: Socket): string | null {
		const token = client.handshake.headers['authorization']?.split(' ')[1];

		if (!token) {
			return null;
		}

		try {
			const decoded = this.jwtService.verify(token);
			return decoded.id ?? null;
		} catch (err) {
			return null;
		}
	}
}
