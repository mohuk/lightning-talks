import * as firestore from './firestore';
import { TeamMember } from '../classes/teamMember';
import * as firconstants from '../constants/firestore';

/** Get all Ligthing Talk current team members. */
export const getAllTeamMembers = async (): Promise<TeamMember[] | undefined> => {

    try {
        const collectionRef = firestore.getCollectionReference(firconstants.collectionTeam);
        const snapshot = await collectionRef.where('isActive', firconstants.queryEquals, true).get();

        if (snapshot.empty) {
            return undefined;
        }

        const teamMembers: TeamMember[] = [];

        snapshot.forEach((document) => {
            const teamMember: TeamMember = TeamMember.snapshotToObject(document);
            teamMembers.push(teamMember);
        });

        return teamMembers;
    }
    catch (err) {
        return err;
    }
}
