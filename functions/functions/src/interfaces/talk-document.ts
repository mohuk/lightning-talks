import { Timestamp } from "@google-cloud/firestore";

export interface TalkDocument {

    talkTitle: string;
    speakerNameList: string[];
    speakerEmailList: string[];
    speakerSlackList: string[];
    talkExcerpt: string;
    dateSubmitted: Timestamp;
    dateScheduled: Timestamp;
    dateModified: Timestamp;
    urlPresentation: string;
    urlVideo: string;
    dislikeCount: number;
    dislikeList: string[];
    likeCount: number;
    likeList: string[];
    isSpecialTalk: boolean;
    isActive: boolean;
}
