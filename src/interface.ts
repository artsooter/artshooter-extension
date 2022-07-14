interface voidFunc {
    (): void;
}

export interface todo{
    id:string,
    text?:string,
    checked?:boolean,
    createTime?:number,
    importanceType?:string,
    importanceTypeLabel?:string,
    urgencyType?:todoUrgencyType,
    endTime?:number,
}
export interface todoDataOption{
    uuid:string,
    importanceTypeLabel?:string
}
export enum todoImportanceType {
    'work'='work','unimportant'='unimportant','important'='important','something'='something'
}
export enum todoUrgencyType{
    'day'='day','week'='week','month'='month'
}
