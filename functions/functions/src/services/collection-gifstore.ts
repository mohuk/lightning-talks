import * as firestore from './firestore';
import { Gif } from '../classes/gif';
import * as firconstants from '../constants/firestore';
import { Timestamp } from '@google-cloud/firestore';

/** Obtain a gif that hasn't been used recently (bygone: in the past). */
export const getBygoneGif = async (): Promise<Gif | undefined> => {

    try {
        const collectionRef = firestore.getCollectionReference(firconstants.collectionTalksGifstore);
        const snapshot = await collectionRef.where('isActive', firconstants.queryEquals, true)
            .orderBy('lastUsed')
            .limit(1)
            .get();

        if (snapshot.empty) {
            return undefined;
        }

        const document = snapshot.docs[0];
        const gif: Gif = Gif.snapshotToObject(document);
        return gif;
    }
    catch (err) {
        return err;
    }
}

/** Update Last Used field against a gif */
export const setGifUsed = async (id: string): Promise<boolean> => {

    try {
        const collectionRef = firestore.getCollectionReference(firconstants.collectionTalksGifstore);
        const gifRef = await collectionRef.doc(id);
        const gif = await gifRef.get();

        if (gif.exists) {
            await gifRef.update({ lastUsed: Timestamp.fromDate(new Date()) });
            return true;
        }
        else {
            return false;
        }
    }
    catch (err) {
        return err;
    }
}
