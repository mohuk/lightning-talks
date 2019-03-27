import * as functions from 'firebase-functions';
import * as talks from './collection-talks';
import * as auth from './auth';
import { Talk } from '../classes/talk';

/** 
 * Post a Talk submission.
 */
export const post = async (request: functions.Request, response: functions.Response) => {

    try {
        auth.verifyApikey(request);

        const newTalk: Talk = request.body;
        newTalk.dateModified = new Date();
        const submittedDate = new Date(newTalk.dateSubmitted);
        let talkTitle = newTalk.talkTitle.replace('.', '').replace(' &', '').replace('?', '').toLowerCase();
        const talkTitleWords = talkTitle.split(' ');
        talkTitle = '';
        let index;

        for (index = 0; (index < talkTitleWords.length) && (index < 4); index++) {
            talkTitle += '_' + talkTitleWords[index];
        }

        newTalk.id = submittedDate.getFullYear() + ('0' + (submittedDate.getMonth() + 1)).slice(-2) + ('0' + submittedDate.getDate()).slice(-2) + talkTitle;
        await talks.postTalk(newTalk);
        response.send(newTalk.id);
    }
    catch (err) {
        response.send(err.message);
    }
}
