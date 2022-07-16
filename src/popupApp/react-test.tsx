'use strict';

import {todo, todoImportanceType} from '../interface'
import TodoData from "../popupApp/todoData";
import React, {PureComponent} from "react";
import ReactDOM from "react-dom/client";
import {Button, Checkbox, Input, EditableArea, Popover, DatePicker} from 'shineout'
import style from "./style.css"
import {Header, Info} from "./components-raect";

// @ts-ignore
class TodoList extends PureComponent {
    private todoImportanceTypes: todoImportanceType[];
    private data: TodoData;
    private state: { list: todo[], curItem: any };

    constructor(props: any) {
        super(props);
        this.data = new TodoData()
        this.todoImportanceTypes = [todoImportanceType.work
            , todoImportanceType.unimportant
            , todoImportanceType.important
            , todoImportanceType.something]
        this.state = {
            list: [],
            curItem: {}
        }
        this.changeHandle = this.changeHandle.bind(this)
        this.delHandle = this.delHandle.bind(this)
        this.addHandle = this.addHandle.bind(this)
        this.addTypeHandle = this.addTypeHandle.bind(this)
        this.delTypeHandle = this.delTypeHandle.bind(this)
        this.changeTypeHandle = this.changeTypeHandle.bind(this)
        this.clearHandle = this.clearHandle.bind(this)
    }

    componentDidMount() {
        this.update()
    }

    async update() {
        await this.data._getSyncFromStorage(true)
        this.setState({list: this.data.list})
    }

    addTypeHandle(): void {
        this.data.setOption()
        this.update()
    }

    delTypeHandle(id: string): void {
        const _options = this.data.option.todoDataOptions.filter(ele => ele.uuid !== id)
        this.data.setOption(_options)
        this.update()
    }

    changeTypeHandle(id: string, text: string): void {
        this.data.setOption({uuid: id, importanceTypeLabel: text})
        this.update()
    }

    changeHandle(option: todo) {
        this.data.setTodo(option)
        this.update()
    }

    delHandle(option: { id: string }) {
        this.data.delTodo(option.id)
        this.update()
    }

    addHandle(option: { importanceType: string }) {
        this.data.addTodo(option)
        this.update()
    }

    * clearHandle() {
        yield this.data.clear()
        this.update()
    }

    render() {
        const {list, curItem} = this.state
        console.log('curItem =>', curItem)
        return (
            <div>
                <Header addTypeHandle={this.addTypeHandle}/>
                <div className={style.container}>
                    {this.data.option.todoDataOptions.map(ele => {
                        const _list = list.filter(_ele => _ele.importanceType === ele.uuid)
                        return (<div style={{margin: '24px'}} key={ele.uuid}>
                            <EditableArea value={ele.importanceTypeLabel}
                                          onChange={text => this.changeTypeHandle(ele.uuid, text)}/>
                            {
                                _list.map((item: todo) => {
                                    return (<div className={style.todoItem} key={item.id}>
                                        <Checkbox value={item.checked} onChange={(v) => {
                                            this.changeHandle({id: item.id, checked: v})
                                        }}/>
                                        <Input value={item.text} onClick={() => {this.setState({curItem: item})}}
                                               onChange={(v) => this.changeHandle({id: item.id, text: v})}/>
                                        <Button className={style.todoItemButton} type={'danger'}
                                                onClick={() => this.delHandle({id: item.id})}>X</Button>
                                    </div>)
                                })
                            }
                            <Button type={'primary'}
                                    onClick={() => this.addHandle({importanceType: ele.uuid})}>新增</Button>
                            <Button type={'default'} onClick={() => this.delTypeHandle(ele.uuid)}>删除项目</Button>
                        </div>)
                    })}
                </div>
                {this.state.curItem ? <Info item={this.state.curItem} changeHandle={this.changeHandle}/> : null}
            </div>
        )
    }
}


class App {
    constructor() {
        this.init()
    }

    async init(): Promise<void> {
        const root = document.getElementById('app')
        // @ts-ignore
        ReactDOM.createRoot(root).render(<TodoList/>);
    }
}

export default App
