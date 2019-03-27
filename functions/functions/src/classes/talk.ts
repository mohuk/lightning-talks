import { Timestamp } from "@google-cloud/firestore";
import { TalkDocument } from "../interfaces/talk-document";

export class Talk {

    id: string;
    talkTitle: string;
    speakerNameList: string[];
    speakerEmailList: string[];
    speakerSlackList: string[];
    talkExcerpt: string;
    dateSubmitted: Date;
    dateScheduled: Date;
    dateModified: Date;
    urlPresentation: string;
    urlVideo: string;
    dislikeCount: number;
    dislikeList: string[];
    likeCount: number;
    likeList: string[];
    isSpecialTalk: boolean;
    isActive: boolean;

    constructor(id: string, talkTitle: string, speakerNameList: string[], speakerEmailList: string[], speakerSlackList: string[],
        talkExcerpt: string, dateSubmitted: Timestamp, dateScheduled: Timestamp, dateModified: Timestamp,
        urlPresentation: string, urlVideo: string, dislikeCount: number, dislikeList: string[], likeCount: number,
        likeList: string[], isSpecialTalk: boolean, isActive: boolean) {

        this.id = id;
        this.talkTitle = talkTitle;
        this.speakerNameList = speakerNameList;
        this.speakerEmailList = speakerEmailList;
        this.speakerSlackList = speakerSlackList;
        this.talkExcerpt = talkExcerpt;
        this.dateSubmitted = dateSubmitted.toDate();
        this.dateScheduled = dateScheduled.toDate();
        this.dateModified = dateModified.toDate();
        this.urlPresentation = urlPresentation;
        this.urlVideo = urlVideo;
        this.dislikeCount = dislikeCount;
        this.dislikeList = dislikeList;
        this.likeCount = likeCount;
        this.likeList = likeList;
        this.isSpecialTalk = isSpecialTalk;
        this.isActive = isActive;
    }

    static snapshotToObject(document: FirebaseFirestore.QueryDocumentSnapshot): Talk {

        return new Talk(document.id, document.get('talkTitle'), document.get('speakerNameList'), document.get('speakerEmailList'), document.get('speakerSlackList'),
            document.get('talkExcerpt'), document.get('dateSubmitted'), document.get('dateScheduled'), document.get('dateModified'),
            document.get('urlPresentation'), document.get('urlVideo'), document.get('dislikeCount'), document.get('dislikeList'),
            document.get('likeCount'), document.get('likeList'), document.get('isSpecialTalk'), document.get('isActive'));
    }

    static objectToDocument(object: Talk): TalkDocument {

        return {
            talkTitle: object.talkTitle,
            speakerNameList: object.speakerNameList,
            speakerEmailList: object.speakerEmailList,
            speakerSlackList: object.speakerSlackList,
            talkExcerpt: object.talkExcerpt,
            dateSubmitted: Timestamp.fromDate(new Date(object.dateSubmitted)),
            dateScheduled: Timestamp.fromDate(new Date(object.dateScheduled)),
            dateModified: Timestamp.fromDate(new Date(object.dateModified)),
            urlPresentation: object.urlPresentation,
            urlVideo: object.urlVideo,
            dislikeCount: object.dislikeCount,
            dislikeList: object.dislikeList,
            likeCount: object.likeCount,
            likeList: object.likeList,
            isSpecialTalk: object.isSpecialTalk,
            isActive: object.isActive
        }
    }
}
