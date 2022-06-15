'use strict';

import './popup.css';
import {todo, todoImportanceType} from './interface'
import TodoData from "./popupApp/todoData";

(function() {
  class Todo {
    public data :TodoData
    constructor() {
      this.data = new TodoData({setListCallback:this._reset.bind(this)})
      this.init()
    }
    // 初始化
    async init():Promise<void>{
      //页面html基本按钮初始化
      // @ts-ignore
      this._createButton();
      //操作按钮监听初始化
      (document.getElementById('clearTodoBtn') as HTMLButtonElement).onclick= ()=>{
         this.data.clear()
      }
      (document.getElementById('copyAndPasteClip') as HTMLButtonElement).onclick= ()=>{
        if(this.data.copyAndPaste()){
          this._reset()
        }
      }
      (document.getElementById('showAllBtn') as HTMLButtonElement).onclick= async ()=>{
        this.data._getSyncFromStorage(false)
      }
      await this.data._getSyncFromStorage(true)
      this._reset()
    }
    // 初始化 todoList ==> view
    _reset(){
      const container = document.getElementById('app') as HTMLElement
      container.innerHTML=""
      container.setAttribute('style','display: grid; grid-template-columns: 1fr 1fr;')
      for (let i in todoImportanceType){
        const nodes: HTMLElement[] = []
        const div = document.createElement('div')
        const button = document.createElement('button')
        button.innerHTML='新增'
        button.onclick=()=>{
          this.data.addTodo({importanceType:i})
        }
        this.data.list.forEach((ele)=>{
          if(ele.importanceType===i){
            nodes.push(this._createLabel(ele))
          }
        })
        nodes.forEach(node=>{
          div.appendChild(node)
        })
        if(nodes.length)div.appendChild(button)
        container.appendChild(div)
      }
    }
    // 生成基本按钮
    _createButton():void{
      const body = document.body
      const footer = document.createElement('footer')
      const clearButton = document.createElement('button')
      const copyButton = document.createElement('button')
      const showAllButton = document.createElement('button')
      clearButton.setAttribute('id','clearTodoBtn')
      clearButton.innerHTML="清空"
      copyButton.setAttribute('id','copyAndPasteClip')
      copyButton.innerHTML="复制/粘贴"
      showAllButton.setAttribute('id','showAllBtn')
      showAllButton.innerHTML="展示所有"
      footer.appendChild(clearButton)
      footer.appendChild(copyButton)
      footer.appendChild(showAllButton)
      body.appendChild(footer)
    }
    // 根据「label内容，checked状态」生成todoList Label
    _createLabel(option:todo):HTMLElement{
      const {id,text,checked} = option
      const div = document.createElement('div')
      div.setAttribute('style','display:flex;align-items: center')
      // checkbox
      const checkbox = document.createElement('input')
      checkbox.setAttribute('type','checkbox')
      checkbox.setAttribute('name',id)
      checkbox.setAttribute('style','margin: 0px 5px;')
      if(checked)checkbox.setAttribute('checked',(checked||false)+'')
      checkbox.onclick = (e)=>{
        this.data.setTodo({
          id,
          checked:(e.target as HTMLInputElement).checked})
      }
      // input
      const input = document.createElement('input')
      input.setAttribute('name',id)
      input.setAttribute('style','width: 230px;')
      if(text)input.value=text
      input.oninput = (e)=>{
        this.data.setTodo({
          id,
          text:(e.target as HTMLInputElement).value})
      }
      // button
      const button = document.createElement('button')
      button.innerHTML = 'X'
      button.onclick=(e)=>{
        this.data.delTodo(id)
      }
      div.appendChild(checkbox)
      div.appendChild(input)
      div.appendChild(button)
      return div
    }
  }


  document.addEventListener('DOMContentLoaded', ()=>{
    const todo = new Todo()
  });
})();
// Communicate with background file by sending a message
// chrome.runtime.sendMessage(
//   {
//     type: 'GREETINGS',
//     payload: {
//       message: 'Hello, my name is Pop. I am from Popup.',
//     },
//   },
//   response => {
//     console.log(response.message,'response');
//   }
// );
