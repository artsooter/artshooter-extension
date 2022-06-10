import {copyClip, extensionStorage, readClip, uuid} from "../library/utils";
import {todo,todoImportanceType,todoUrgencyType} from '../interface'
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
    private _list:Map<string,todo>
    private readonly keyInStorage:string
    constructor() {
        this._list=new Map()
        this.keyInStorage = 'todoList'
    }
    // todo[]
    // extensionStorage里实际存储的是list:Array[]
    // class里实际维护的是_list:Map{}
    get list(){
        const arr:todo[] = []
        this._list.forEach((value,key)=>{
            arr.push({...value})
        })
        return arr
    }
    set list(arr){
        this._list.clear()
        arr.forEach(ele=>{
            this._list.set(ele.id,ele)
        })
        this._setToStorage()
    }
    getTodoById (id:string):todo|undefined{
        return this._list.get(id)
    }
    addTodo (option:{}){
        const obj = {...defaultData.todoList,...option}
        obj.id=uuid()
        obj.createTime=Number(new Date())
        this.setTodo(obj)
    }
    setTodo (option:todo){
        this._list.set(option.id,option)
        this._setToStorage()
    }
    delTodo (id:string){
        this._list.delete(id)
        this._setToStorage()
    }
    async _getSyncFromStorage():Promise<void>{
        const arr = (await (extensionStorage.getSync(this.keyInStorage)||[])as [todo]||[])
            .sort((a,b)=>a.createTime-b.createTime)
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