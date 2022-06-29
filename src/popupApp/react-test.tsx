'use strict';

import {todo, todoImportanceType} from '../interface'
import TodoData from "../popupApp/todoData";
import React,{PureComponent} from "react";
import ReactDOM from "react-dom/client";
import {Button, Checkbox, Input} from 'shineout'
import style from "./style.css"
const Todo = ({list,importanceType,changeHandle,titleChangeHandle,addHandle,delHandle})=>{
    return ( <div style={{margin:'24px'}}>
        <Input value={list[0]?.importanceTypeLabel||importanceType} onChange={text=>titleChangeHandle(text,list)} />
        {
            list.map((ele: todo )=>{
                return (<div  className={style.todoItem} key={ele.id} >
                    <Checkbox value={ele.checked} onChange={(v)=>{
                        changeHandle({id:ele.id,checked:v})
                    }} />
                    <Input value={ele.text} onChange={(v)=>changeHandle({id:ele.id,text:v})}/>
                    <Button className={style.todoItemButton} type={'danger'} onClick={()=>delHandle({id:ele.id})}>X</Button>
                </div>)
            })
        }
        <Button type={'primary'} onClick={()=>addHandle({importanceType})}>新增</Button>
    </div>)
}
// @ts-ignore
class TodoList extends PureComponent{
    private todoImportanceTypes: todoImportanceType[];
    private data: TodoData;
    private state: { list: todo[] };
    constructor(props:any) {
        super(props);
        this.data = new TodoData({setListCallback:()=>{}})
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
    titleChangeHandle(text:string,list:todo[]){
        list.forEach(ele=>this.data.setTodo({...ele,importanceTypeLabel:text}))
        this.update()
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
        const {changeHandle,titleChangeHandle,delHandle,addHandle} = this
        return(
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',width:'700px'}}>
                {this.todoImportanceTypes.map(ele=>{
                    const _list = list.filter(_ele=>_ele.importanceType===ele)
                    return (<Todo list={_list} importanceType={ele} key={ele}
                                  changeHandle={changeHandle}
                                  delHandle={delHandle}
                                  addHandle={addHandle}
                                  titleChangeHandle={titleChangeHandle}
                    />)
                })}
            </div>
        )
    }
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
