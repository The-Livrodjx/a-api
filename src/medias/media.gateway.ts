
import { Logger } from '@nestjs/common';
import 
{ 
    MessageBody, 
    SubscribeMessage, 
    WebSocketGateway, 
    WebSocketServer, 
    OnGatewayConnection, 
    OnGatewayDisconnect, 
    OnGatewayInit 
} from '@nestjs/websockets';

const logger: Logger = new Logger('MediaGateway');

@WebSocketGateway(80, { namespace: 'media' })
export class MediaGateway implements OnGatewayConnection, 
OnGatewayDisconnect, OnGatewayInit {

    @WebSocketServer()
    server: any;

    @SubscribeMessage('stream')
    handleEvent(@MessageBody() data: string) {
        this.server.emit('events', data);
    }

    handleConnection(client: any, ...args: any[]) {
        logger.log('User connected');
    }

    handleDisconnect(client: any) {
        logger.log('User disconnected');
    }

    afterInit(server: any) {
        logger.log('Socket is live')
    }
}
