import React, {PureComponent} from "react";
import ReactDOM from "react-dom/client";
import {Button, Checkbox, Input, DatePicker} from 'shineout'
import style from "./style.css"

// @ts-ignore
class Info extends PureComponent {
    constructor(props: any) {
        super(props);
    }

    render() {
        const {item, changeHandle} = this.props
        return (
            <div className={style.info}>
                <div className={style.info_item}>
                    <label>内容</label>
                    <Input value={item.text} onChange={v=>changeHandle({id: item.id, text: v})}></Input>
                </div>
                <div className={style.info_item}>
                    <label>创建时间</label>
                    <DatePicker key={item.createTime} value={item.createTime} disabled ></DatePicker>
                </div>
                <div className={style.info_item}>
                    <label>截止时间</label>
                    <DatePicker value={item.endTime} onChange={v=>changeHandle({id: item.id, endTime: v})}></DatePicker>
                </div>
            </div>
        )
    }
}


export {Info}
