interface callbackFunc{
    (option?:any):void
}
class Hook {
    private _hookMaps:Map<string,Array<callbackFunc>>
    constructor() {
        this._hookMaps=new Map()
    }
    tap(tag:string,callback:callbackFunc):void{
        const {_hookMaps} = this
        const callbackFunc = _hookMaps.get(tag)
        if(callbackFunc){
            _hookMaps.set(tag,callbackFunc.concat(callback))
        }else{
            _hookMaps.set(tag,[callback])
        }
    }
    emit(tag:string,option?:any):void{
        const {_hookMaps} = this
        const callbackFunc = _hookMaps.get(tag)
        if(callbackFunc){
            callbackFunc.forEach((callback:callbackFunc)=>callback(option))
        }else {
            console.log('没有该hook - ',tag)
        }
    }
}
export default Hook