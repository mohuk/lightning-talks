import * as functions from 'firebase-functions';
import * as slack from './notifier-slack'
import * as talks from './collection-talks';
import * as gifstore from './collection-gifstore';
import * as datetime from './datetime';
import * as auth from './auth';
import { Talk } from '../classes/talk';
import { AttachmentField } from '../interfaces/slack-message';
import { IncomingWebhookSendArguments, MessageAttachment, AttachmentAction } from '@slack/client';
import * as constants from '../constants/';
import * as annconstants from '../constants/announcements';

const createAttachmentMessage = (upcomingTalk: Talk, gifLink: string): IncomingWebhookSendArguments => {

    let speakerNames: string;

    switch (upcomingTalk.speakerNameList.length) {
        case 0: speakerNames = 'Undisclosed yet'; break;
        case 1: speakerNames = upcomingTalk.speakerNameList[0]; break;
        case 2: speakerNames = upcomingTalk.speakerNameList.join(' and '); break;
        default: speakerNames = upcomingTalk.speakerNameList.join(', '); break;
    }

    const talkDateTime = upcomingTalk.dateScheduled;
    const dayOfWeek = datetime.getDayOfWeek(talkDateTime);
    const dayOfMonth = datetime.getDayOfMonth(talkDateTime);
    const month = datetime.getMonth(talkDateTime);

    const announcementMessage: IncomingWebhookSendArguments = {

        attachments: []
    };

    const mainAttachment: MessageAttachment = {

        fallback: annconstants.header + dayOfWeek +
            '\n*' + annconstants.titleHeader + ':* ' + upcomingTalk.talkTitle +
            '\n*' + annconstants.descriptionHeader + ':* ' + upcomingTalk.talkExcerpt +
            '\n*' + annconstants.speakersHeader + ':* ' + speakerNames +
            '\n*' + annconstants.dateHeader + ':* ' + dayOfWeek + ' ' + dayOfMonth + ' ' + month +
            '\n*' + annconstants.timeHeader + ':* ' + (talkDateTime.getHours() + 5) + ':' + talkDateTime.getMinutes() + annconstants.timeSuffix +
            '\n*' + annconstants.venueHeader + ':* ' + annconstants.venueValue,
        color: annconstants.attachmentColor,
        fields: []
    };

    let mainAttachmentField: AttachmentField = {

        title: '',
        value: annconstants.header + dayOfWeek,
        short: false
    };

    mainAttachment.fields = [mainAttachmentField];

    mainAttachmentField = {

        title: annconstants.titleHeader,
        value: upcomingTalk.talkTitle,
        short: false
    };

    mainAttachment.fields.push(mainAttachmentField);

    mainAttachmentField = {

        title: annconstants.descriptionHeader,
        value: upcomingTalk.talkExcerpt,
        short: false
    };

    mainAttachment.fields.push(mainAttachmentField);

    mainAttachmentField = {

        title: annconstants.speakersHeader,
        value: speakerNames,
        short: true
    };

    mainAttachment.fields.push(mainAttachmentField);

    mainAttachmentField = {

        title: annconstants.dateHeader,
        value: dayOfWeek + ', ' + dayOfMonth + ' ' + month,
        short: true
    };

    mainAttachment.fields.push(mainAttachmentField);

    mainAttachmentField = {

        title: annconstants.venueHeader,
        value: annconstants.venueValue,
        short: true
    };

    mainAttachment.fields.push(mainAttachmentField);

    mainAttachmentField = {

        title: annconstants.timeHeader,
        value: (talkDateTime.getHours() + 5) + ':' + talkDateTime.getMinutes() + annconstants.timeSuffix,
        short: true
    };

    mainAttachment.fields.push(mainAttachmentField);

    announcementMessage.attachments = [mainAttachment];

    const gifAttachment: MessageAttachment = {

        fallback: gifLink,
        color: annconstants.attachmentColor,
        image_url: gifLink
    };

    announcementMessage.attachments.push(gifAttachment);

    const actionAttachment: MessageAttachment = {

        fallback: annconstants.footer + ' at ' + constants.url,
        color: annconstants.attachmentColor,
        fields: [],
        actions: []
    };

    const actionAttachmentField: AttachmentField = {

        title: annconstants.footer,
        value: '',
        short: false
    };

    actionAttachment.fields = [actionAttachmentField];

    let actionAttachmentAction: AttachmentAction = {

        type: annconstants.actionType,
        style: annconstants.actionStylePrimary,
        text: annconstants.signupHeader,
        url: annconstants.signupUrl
    }

    actionAttachment.actions = [actionAttachmentAction];

    actionAttachmentAction = {

        type: annconstants.actionType,
        style: annconstants.actionStyleDefault,
        text: annconstants.calendarHeader,
        url: annconstants.calendarUrl
    }

    actionAttachment.actions.push(actionAttachmentAction);

    actionAttachmentAction = {

        type: annconstants.actionType,
        style: annconstants.actionStyleDanger,
        text: annconstants.feedbackHeader,
        url: annconstants.feedbackUrl
    }

    actionAttachment.actions.push(actionAttachmentAction);

    announcementMessage.attachments.push(actionAttachment);

    return announcementMessage;
}

/** 
 * Posts annoucement to Slack General about the Talk 1 working day before.
 * Personal subscriptions of 10P employees will be an improvement.
 */
export const send = async (request: functions.Request, response: functions.Response) => {

    try {
        auth.verifyApikey(request);

        const upcomingTalk = await talks.getNextDayTalk();
        const gif = await gifstore.getBygoneGif();

        if (upcomingTalk !== undefined && gif !== undefined) {
            const announcementMessage = createAttachmentMessage(upcomingTalk, gif.link);
            const slackWebhooktoken = functions.config().slack.webhooktoken.general;
            const result = await slack.postAnnoucement(slackWebhooktoken, announcementMessage);

            if (result.text === 'ok') {
                await gifstore.setGifUsed(gif.id);
            }

            response.send(result.text);
        }

        response.send(constants.messageNoRecords);
    }
    catch (err) {
        response.send(err.message);
    }
}
