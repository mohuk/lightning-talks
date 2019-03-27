export class TeamMember {

    id: string;
    name: string;
    emailPrimary: string;
    emailSecondary: string;
    isActive: boolean;

    constructor(id: string, name: string, emailPrimary: string, emailSecondary: string, isActive: boolean) {

        this.id = id;
        this.name = name;
        this.emailPrimary = emailPrimary;
        this.emailSecondary = emailSecondary;
        this.isActive = isActive;
    }

    static snapshotToObject (document: FirebaseFirestore.QueryDocumentSnapshot) : TeamMember {
    
        return new TeamMember(document.id, document.get('name'), document.get('emailPrimary'), document.get('emailSecondary'), document.get('isActive'));
    }
}
