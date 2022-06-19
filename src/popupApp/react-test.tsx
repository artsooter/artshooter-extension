'use strict';

import {todo, todoImportanceType} from '../interface'
import TodoData from "../popupApp/todoData";
import React,{PureComponent} from "react";
import ReactDOM from "react-dom/client";
import {Checkbox, Input} from 'shineout'

class Todo extends PureComponent{
    constructor(props) {
        super(props);
        this.changeHandle=this.changeHandle.bind(this)
    }
    changeHandle(props){

    }

    render(){
        const {changeHandle} = this
        return <div style={{margin:'24px'}}>
            {
                this.props.list.map((ele: todo )=>{
                    return (<div  key={ele.id} style={{display:'flex'}}>
                        <Checkbox value={ele.checked} onChange={(v)=>changeHandle({checked:v})} />
                        <Input value={ele.text} onChange={(v)=>changeHandle({text:v})}/>
                    </div>)
                })
            }
        </div>
    }
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
    }
    async componentDidMount(){
        await this.data._getSyncFromStorage(true)
        this.setState({list:this.data.list})
    }

    render(){
        const {list} = this.state
        return(
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr'}}>
                {this.todoImportanceTypes.map(ele=>{
                    const _list = list.filter(_ele=>_ele.importanceType===ele)
                    return (<Todo list={_list} importanceType={ele} key={ele}/>)
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
