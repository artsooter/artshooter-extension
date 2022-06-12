interface voidFunc {
    (): void;
}

export interface todo{
    id:string,
    text?:string,
    checked?:boolean,
    createTime?:number,
    importanceType?:todoImportanceType,
    urgencyType?:todoUrgencyType,
}
export interface todoDataClassInterface{
    setListCallback: voidFunc;
}
export enum todoImportanceType {
    'work'='work','unimportant'='unimportant','important'='important','something'='something'
}
export enum todoUrgencyType{
    'day'='day','week'='week','month'='month'
}
