import {swagger} from './swagger'
import Hook from '../library/hook'
class manager{
    private hooks: {[name:string]:any};
    constructor(){
        this.hooks={
            timeout3S:new Hook()
        }
    }
    init(){
        this.hooks.timeout3S.tap('swagger',()=>swagger())
    }
    main(){
        setTimeout(()=>{
            this.hooks.timeout3S.emit('swagger')
        },3000)
    }
}

export {manager}