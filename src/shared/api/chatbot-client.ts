import AbstractRestApiClient from '@/app/utils/api/base-api-client';

export class ChatBotAPI extends AbstractRestApiClient {
    protected protectedResource = true;
    private base = 'consumer/api/chat-bot/ask';
    async askQuestion(question: string): Promise<void> {
        await this.post<void>(this.base, undefined, {
            Question: question
        });
    }
}

export const chatBotAPI = new ChatBotAPI();