'use strict';

import {todo, todoImportanceType} from '../interface'
import TodoData from "../popupApp/todoData";
import React,{PureComponent} from "react";
import ReactDOM from "react-dom/client";
import {Button, Checkbox, Input,EditableArea} from 'shineout'
import style from "./style.css"
// @ts-ignore
class TodoList extends PureComponent{
    private todoImportanceTypes: todoImportanceType[];
    private data: TodoData;
    private state: { list: todo[] };
    constructor(props:any) {
        super(props);
        this.data = new TodoData()
        this.todoImportanceTypes = [todoImportanceType.work
            ,todoImportanceType.unimportant
            ,todoImportanceType.important
            ,todoImportanceType.something]
        this.state={
            list:[]
        }
        this.changeHandle = this.changeHandle.bind(this)
        this.delHandle = this.delHandle.bind(this)
        this.addHandle = this.addHandle.bind(this)
    }
    componentDidMount(){
        this.update()
    }
    async update(){
        await this.data._getSyncFromStorage(true)
        this.setState({list:this.data.list})
    }

    addTypeHandle():void{
        this.data.setOption()
    }
    delTypeHandle(id:string):void{
        const _options = this.data.option.todoDataOptions.filter(ele=>ele.uuid!==id)
        this.data.setOption(_options)
    }
    changeTypeHandle(id:string,text:string):void{

    }

    changeHandle(option:todo){
        this.data.setTodo(option)
        this.update()
    }
    delHandle(option: { id: string } ){
        this.data.delTodo(option.id)
        this.update()
    }
    addHandle(option:{importanceType:todoImportanceType}){
        this.data.addTodo(option)
        this.update()
    }
    render(){
        const {list} = this.state
        return(
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr'}}>
                12
            </div>
        )
    }

    // render(){
    //     const {list} = this.state
    //     return(
    //         <div style={{display:'grid',gridTemplateColumns:'1fr 1fr'}}>
    //             {this.todoImportanceTypes.map(ele=>{
    //                 const _list = list.filter(_ele=>_ele.importanceType===ele)
    //                 return (<div style={{margin:'24px'}}>
    //                     <EditableArea value={_list[0]?.importanceTypeLabel} onChange={text=>this.changeTypeHandle(typeId,text)} />
    //                     {
    //                         list.map((ele: todo )=>{
    //                             return (<div  className={style.todoItem} key={ele.id} >
    //                                 <Checkbox value={ele.checked} onChange={(v)=>{
    //                                     this.changeHandle({id:ele.id,checked:v})
    //                                 }} />
    //                                 <Input value={ele.text} onChange={(v)=>this.changeHandle({id:ele.id,text:v})}/>
    //                                 <Button className={style.todoItemButton} type={'danger'} onClick={()=>this.delHandle({id:ele.id})}>X</Button>
    //                             </div>)
    //                         })
    //                     }
    //                     {/*<Button type={'primary'} onClick={()=>this.addHandle({importanceType})}>新增</Button>*/}
    //                 </div>)
    //             })}
    //             <div>
    //                 <Button onClick={this.addTypeHandle}>新增类型</Button>
    //             </div>
    //         </div>
    //     )
    // }
}





class App {
    constructor() {
        this.init()
    }
    async init():Promise<void>{
        const root = document.getElementById('app')
        // @ts-ignore
        ReactDOM.createRoot(root).render(<TodoList />);
    }
}

export default App
