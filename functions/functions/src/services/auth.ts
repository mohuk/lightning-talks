import * as functions from 'firebase-functions';
import * as constants from '../constants';

export const verifyApikey = (request: functions.Request) => {

    const requestKey = request.header('apikey');
    const apikey: string = functions.config().auth.apikey;

    if (requestKey === undefined || requestKey !== apikey) {
        throw new Error(constants.unauthorizedAccess);
    }
}
