import React,{PureComponent} from "react";
import ReactDOM from "react-dom/client";
import {Button, Checkbox, Input,EditableArea} from 'shineout'
import style from "./style.css"
// @ts-ignore
class Info extends PureComponent{
    constructor(props:any) {
        super(props);
    }

    render(){
        const {item} = this.props
        return(
            <div className={style.info}>
                {item.text}
                <Input value={item.text}></Input>
            </div>
        )
    }
}



export {Info}
