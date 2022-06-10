'use strict';

import './popup.css';
import {todo, todoImportanceType} from './interface'
import TodoData from "./popupApp/todoData";

(function() {
  class Todo {
    public data :TodoData
    constructor() {
      this.data = new TodoData()
      this.init()
    }
    // 初始化
    async init(){
      //操作按钮监听初始化
      (document.getElementById('clearTodoBtn') as HTMLButtonElement).onclick=async ()=>{
        await this.data.clear()
        this._reset()
      }
      (document.getElementById('copyAndPasteClip') as HTMLButtonElement).onclick= ()=>{
        if(this.data.copyAndPaste()){
          this._reset()
        }
      }
      await this.data._getSyncFromStorage()
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
          this._reset()
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
          ...(this.data.getTodoById(id) as todo),
          checked:(e.target as HTMLInputElement).checked})
      }
      // input
      const input = document.createElement('input')
      input.setAttribute('name',id)
      input.setAttribute('style','width: 230px;')
      if(text)input.value=text
      input.oninput = (e)=>{
        this.data.setTodo({
          ...(this.data.getTodoById(id) as todo),
          text:(e.target as HTMLInputElement).value})
      }
      // button
      const button = document.createElement('button')
      button.innerHTML = 'X'
      button.onclick=(e)=>{
        this.data.delTodo(id)
        this._reset()
      }
      div.appendChild(checkbox)
      div.appendChild(input)
      div.appendChild(button)
      return div
    }
  }

  function init() {
    const todo = new Todo()
  }

  document.addEventListener('DOMContentLoaded', init);
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
