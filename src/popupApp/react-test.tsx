'use strict';

import {todo, todoImportanceType} from '../interface'
import TodoData from "../popupApp/todoData";
import React, {PureComponent} from "react";
import ReactDOM from "react-dom/client";
import {Button, Checkbox, Input, EditableArea, Popover, Tag, DatePicker} from 'shineout'
import style from "./style.css"
import {HeaderTitle, Info} from "./components-raect";
import dayjs from 'dayjs'

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
            curItem: null
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
        const _list = this.data.list.sort((a, b) => {
            const A = this.countdown(a).countdownValue
            const B = this.countdown(b).countdownValue
            return A - B
        })
        console.log()
        this.setState({list: _list, curItem: null})
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

    countdown(item: todo) {
        let type: string
        let time: string
        let value: number = 0
        const {createTime, endTime} = item
        if (endTime) {
            const countdown = dayjs(endTime).diff(dayjs(), "days")
            if (countdown < 0) time = '??????'
            else time = countdown + '???'
            value = countdown
            type = 'danger'
        } else {
            type = 'default'
            time = ''
            value = Infinity
        }
        return {countdownType: type, countdownTime: time, countdownValue: value}
    }

    render() {
        const {list, curItem} = this.state
        return (
            <div>
                <HeaderTitle addTypeHandle={this.addTypeHandle}/>
                <div className={style.container}>
                    {this.data.option.todoDataOptions.map(ele => {
                        const _list = list.filter(_ele => _ele.importanceType === ele.uuid)
                        return (<div style={{margin: '24px'}} key={ele.uuid}>
                            <EditableArea value={ele.importanceTypeLabel}
                                          onChange={text => this.changeTypeHandle(ele.uuid, text)}/>
                            {
                                _list.map((item: todo) => {
                                    const {countdownType, countdownTime} = this.countdown(item)
                                    return (<div className={style.todoItem} key={item.id}>
                                        <Checkbox value={item.checked} onChange={(v) => {
                                            this.changeHandle({id: item.id, checked: v})
                                        }}/>
                                        <Input value={item.text} onClick={() => {
                                            this.setState({curItem: item})
                                        }} onChange={(v) => this.changeHandle({id: item.id, text: v})}/>
                                        {/*@ts-ignore*/}
                                        {countdownTime ? <Tag type={countdownType}>{countdownTime}</Tag> : null}
                                    </div>)
                                })
                            }
                            <Button type={'primary'}
                                    onClick={() => this.addHandle({importanceType: ele.uuid})}>??????</Button>
                            <Button type={'default'}>
                                <Popover.Confirm onOk={() => this.delTypeHandle(ele.uuid)}>
                                    ???????????? ?
                                </Popover.Confirm>
                                ????????????</Button>
                        </div>)
                    })}
                </div>
                {this.state.curItem ? <Info item={this.state.curItem} delHandle={this.delHandle}
                                            changeHandle={this.changeHandle}/> : null}
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
