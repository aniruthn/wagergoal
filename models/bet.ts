export interface BetModel {
    id?: string;
    approved_users: string[];
    bet_desc: string;
    bet_name: string;
    bet_type: string;
    creator: string;
    date_end: firebase.firestore.Timestamp;
    date_start: firebase.firestore.Timestamp;
    evidence: string[];
    invited_users: string[];
    status: string;
    wager: string;
    wager_quan: string;
}