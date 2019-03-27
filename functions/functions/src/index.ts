import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as submissionConfirmations from './services/function-submission-confimations'
import * as speakerReminders from './services/function-speaker-reminders'
import * as talkAnnoucements from './services/function-talk-annoucements'
import * as slackbot from './services/function-slackbot'
import * as talkSubmission from './services/function-submit-talk';
import * as firconstants from './constants/firestore';

admin.initializeApp({ credential: admin.credential.applicationDefault() });

export const postSubmissionConfirmation = functions.firestore.document(firconstants.collectionTalks + '/{' + firconstants.documentTalk + '}').onCreate(submissionConfirmations.send);

export const postSpeakerReminder = functions.https.onRequest(speakerReminders.send);

export const postTalkAnnoucement = functions.https.onRequest(talkAnnoucements.send);

export const submitTalk = functions.https.onRequest(talkSubmission.post);

export const slackBot = functions.https.onRequest(slackbot.eventListener);
