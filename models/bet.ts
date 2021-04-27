export interface BetModel {
    // add stuff here like
    id?: string;
    bet_name: string;
    bet_desc: string;
    bet_type: string;
    creator: string;
    date_end: string;
    date_start: string;
    evidence: string[];
    invited_users: string[];
    status: string;
    wager: string;
    quantity: string;
}