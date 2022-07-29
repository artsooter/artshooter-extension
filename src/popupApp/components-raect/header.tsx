import React, {PureComponent} from "react";
import ReactDOM from "react-dom/client";
import {Button, Checkbox, Input, EditableArea} from 'shineout'
import style from "./style.css"

// @ts-ignore
class HeaderTitle extends PureComponent {
    private state: {};

    constructor(props: any) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className={style.header}>
                <div>
                    todoList
                </div>
                <div>
                    <Button type={'default'} text onClick={this.props.revokeHandle}>撤销</Button>
                    <Button type={'primary'} onClick={this.props.addTypeHandle}>新增</Button>
                </div>
            </div>
        )
    }
}


export {HeaderTitle}
