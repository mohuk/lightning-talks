import * as functions from 'firebase-functions';
import { IncomingWebhook, IncomingWebhookSendArguments, IncomingWebhookResult } from '@slack/client';

/** Post to a slack channel via an Incoming Webhook. */
export const postAnnoucement = async (channelToken: string, message: IncomingWebhookSendArguments): Promise<IncomingWebhookResult> => {

    try {
        const webhookUrl = functions.config().slack.webhookurl + channelToken;
        const webhook = new IncomingWebhook(webhookUrl);
        const result = await webhook.send(message);
        return result;
    }
    catch (err) {
        return err.message;
    }
}
