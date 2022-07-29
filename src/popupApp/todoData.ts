import {copyClip, extensionStorage, readClip, uuid} from "../library/utils";
import {
    todo,
    todoImportanceType,
    todoDataClassInterface,
    todoUrgencyType,
    todoOption,
    todoDataOption
} from '../interface'

/**
 * TodoList 数据维护
 * @function get set clear copy paste
 */
const defaultData = {
    todoList: {
        id: '',
        text: '',
        checked: false,
        createTime: +new Date(),
        importanceType: todoImportanceType.something,
        importanceTypeLabel: '',
    }
}

interface option {
    todoDataOptions: Array<todoDataOption>,
    revokeData: {
        list: Array<todo>,
        option?: Pick<option, 'todoDataOptions'>
    }
}

class TodoData {
    private _list: Array<todo>
    public option: option
    private readonly dataStorageKey: string
    private readonly optionStorageKey: string

    constructor() {
        this._list = []
        this.option = {
            todoDataOptions: [],
            revokeData: {list: []}
        }
        this.dataStorageKey = 'todoList'
        this.optionStorageKey = 'todoListOption'
    }

    // extensionStorage里实际存储的是list:Array[]
    get list() {
        return this._list
    }

    set list(value) {
        // debugger;
        this.option.revokeData.list = JSON.parse(JSON.stringify(this._list))
        this._list = JSON.parse(JSON.stringify(value))
    }

    addTodo(option: {}) {
        const obj = {...defaultData.todoList, ...option}
        obj.id = uuid()
        obj.createTime = Number(new Date())
        this.setTodo(obj)
    }

    setTodo(option: todo) {
        const {list} = this
        if (list.find(ele => ele.id === option.id)) {
            this.list = list.map(ele => {
                if (ele.id === option.id) {
                    return ({...ele, ...option})
                }
                return ele
            })
        } else {
            this.list = list.concat(option)
        }
        this._setToStorage()
    }

    delTodo(id: string) {
        this.list = this.list.filter(ele => ele.id !== id)
        this._setToStorage()
    }

    setOption(option?: todoDataOption | Array<todoDataOption>) {
        const {todoDataOptions} = this.option
        let _todoDataOptions
        if (!option) {
            _todoDataOptions = todoDataOptions.concat({uuid: uuid(), importanceTypeLabel: '类型名称'})
        } else {
            if (Array.isArray(option)) {
                _todoDataOptions = option
            } else {
                _todoDataOptions = todoDataOptions.map(ele => {
                    if (ele.uuid === option.uuid) {
                        return ({...ele, ...option})
                    }
                    return ele
                })
            }
        }
        this.option.todoDataOptions = _todoDataOptions
        this._setToStorage()
    }

    revoke() {
        console.log(JSON.parse(JSON.stringify(this.option.revokeData.list)))
        console.log(JSON.parse(JSON.stringify(this.list)))
        this.list = this.option.revokeData.list
        this._setToStorage()
    }

    async _getSyncFromStorage(initFlag: Boolean | undefined): Promise<void> {
        const arr = (await (extensionStorage.getSync(this.dataStorageKey) || []) as [todo] || [])
            .sort((a, b) => ((a.createTime) || 0) - (b.createTime || 0))
            .filter(ele => initFlag ? (!ele.checked || (+new Date() - ele.createTime) < 86400000) : true)
        this._list = arr
        const option = await extensionStorage.getSync(this.optionStorageKey) as option
        this.option.todoDataOptions = option ? option.todoDataOptions : []
    }

    _setToStorage() {
        extensionStorage.set(this.dataStorageKey, this.list)
        extensionStorage.set(this.optionStorageKey, this.option)
    }

    async clear() {
        await extensionStorage.clear()
        await this._getSyncFromStorage(false)
    }

    copyAndPaste() {
        const clipData = readClip()
        try {
            const newList = JSON.parse(clipData)
            this.list = (newList as todo[])
            return true
        } catch (e) {
            copyClip(JSON.stringify(this.list))
        }
    }
}

export default TodoData
