import { TurnContext } from 'botbuilder';

export class ApplicationBot {

	async onTurn(context) {
		if (context.activity.type === 'message') {
			//conversationState.get(context);
			await context.sendActivity(`You Said: ${context.activity.text}`);
		} else {
			await context.sendActivity(`${context.activity.type}`);
		}
	}
}