import * as functions from 'firebase-functions';
import * as auth from './auth';

/** 
 * Posts a reminder to the speakers via emails that the Talk is coming in few days.
 * One reminder 4 working days before the Talk.
 * One reminder 2 working days before the Talk.
 * Slack reminders will be an improvement.
 */
export const send = async (request: functions.Request, response: functions.Response) => {

    try {
        auth.verifyApikey(request);
        response.send("ok"); //TODO: implementation
    }
    catch (err) {
        response.send(err.message);
    }
}
