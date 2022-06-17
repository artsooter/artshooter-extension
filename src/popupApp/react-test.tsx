'use strict';

import {todo, todoImportanceType} from '../interface'
import TodoData from "../popupApp/todoData";
import React,{PureComponent} from "react";
import ReactDOM from "react-dom/client";


class App extends PureComponent{
    constructor(props) {
        super(props);
    }

    render(props){
        return(
            <div>12试试3</div>
        )
    }
}

class Todo {
    constructor() {
        // this.data = new TodoData({setListCallback:this._reset.bind(this)})
        this.init()
    }
    // 初始化
    async init():Promise<void>{
        const root = document.getElementById('app')
        ReactDOM.createRoot(root).render(<App />);
        // await this.data._getSyncFromStorage(true)
    }

}

export default Todo
