import * as firestore from './firestore';
import * as datetime from './datetime';
import { Talk } from '../classes/talk';
import { Timestamp } from '@google-cloud/firestore';
import * as firconstants from '../constants/firestore';

/** Get a Lightning Talks that is upcoming in 1 working day. */
export const getNextDayTalk = async (): Promise<Talk | undefined> => {

    try {
        const currentWorkingTimeStamp: Timestamp = Timestamp.fromDate(new Date());
        const twoDaysLaterWorkingTimestamp: Timestamp = Timestamp.fromDate(datetime.getNextWork(new Date()));
        const collectionRef = firestore.getCollectionReference(firconstants.collectionTalks);
        const snapshot = await collectionRef.where('dateSchedule', firconstants.queryGreater, currentWorkingTimeStamp)
            .where('dateSchedule', firconstants.queryLesser, twoDaysLaterWorkingTimestamp)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return undefined;
        }

        const document = snapshot.docs[0];
        const talk: Talk = Talk.snapshotToObject(document);

        return talk;
    }
    catch (err) {
        return err;
    }
}

/** Get all active Lightning Talks. */
export const getAllActiveTalks = async (): Promise<Talk[] | undefined> => {

    try {
        const collectionRef = firestore.getCollectionReference(firconstants.collectionTalks);
        const snapshot = await collectionRef.where('isActive', firconstants.queryEquals, true).get();

        if (snapshot.empty) {
            return undefined;
        }

        const talks: Talk[] = [];

        snapshot.forEach((document) => {
            const talk: Talk = Talk.snapshotToObject(document);
            talks.push(talk);
        });

        return talks;
    }
    catch (err) {
        return err;
    }
}

/** Submit a Lightning Talk. */
export const postTalk = async (newTalk: Talk): Promise<FirebaseFirestore.WriteResult> => {

    const collectionRef = firestore.getCollectionReference(firconstants.collectionTalks);
    return collectionRef.doc(newTalk.id).set(Talk.objectToDocument(newTalk));
}
