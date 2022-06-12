import {copyClip, extensionStorage, readClip, uuid} from "../library/utils";
import {todo,todoImportanceType,todoDataClassInterface,todoUrgencyType} from '../interface'
/**
 * TodoList 数据维护
 * @function get set clear copy paste
 */
const defaultData= {
    todoList:{
        id:'',
        text:'',
        checked:false,
        createTime:+new Date(),
        importanceType:todoImportanceType.something,
    }
}
class TodoData{
    public _list:Array<todo>
    private option:todoDataClassInterface
    private readonly keyInStorage:string
    constructor(_option:todoDataClassInterface) {
        this._list=[]
        this.option=_option
        this.keyInStorage = 'todoList'
    }
    // todo[]
    // extensionStorage里实际存储的是list:Array[]
    get list(){
        return this._list
    }
    set list(value){
        this._list=value
        this.option.setListCallback()
    }
    addTodo (option:{}){
        const obj = {...defaultData.todoList,...option}
        obj.id=uuid()
        obj.createTime=Number(new Date())
        this.setTodo(obj)
    }
    setTodo (option:todo){
        const {list} = this
        if(list.find(ele=>ele.id===option.id)){
            // 修改todolist的内容的时候，不走 set list的逻辑。不刷新页面元素。
            this._list = list.map(ele=>{
                if(ele.id===option.id){
                    return ({...ele,...option})
                }return ele
            })
        }else{
            this.list = list.concat(option)
        }
        this._setToStorage()
    }
    delTodo (id:string){
        this.list = this.list.filter(ele=>ele.id!==id)
        this._setToStorage()
    }
    async _getSyncFromStorage():Promise<void>{
        const arr = (await (extensionStorage.getSync(this.keyInStorage)||[])as [todo]||[])
            .sort((a,b)=>(a.createTime||0)-(b.createTime||0))
        this.list=arr
    }
    _setToStorage(){
        extensionStorage.set(this.keyInStorage,this.list)
    }
    async clear (){
        await extensionStorage.clear()
        await this._getSyncFromStorage()
    }
    copyAndPaste(){
        const clipData = readClip()
        try {
            const newList = JSON.parse(clipData)
            this.list=(newList as todo[])
            return true
        }catch (e){
            copyClip(JSON.stringify(this.list))
        }
    }
}

export default TodoData