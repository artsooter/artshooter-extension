/**
 * 复制文字到剪切板
 * @function copyClip
 * @param text {String} - e.g "要复制到剪切板的文字"
 */
const copyClip = (text:string):void =>{
    let textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.style.position = 'fixed';
    textarea.style.clip = 'rect(0 0 0 0)';
    textarea.style.top = '10px';
    textarea.value = text;
    textarea.select();
    document.execCommand('copy', true);
    document.body.removeChild(textarea);
}
/**
 * 获取剪切板文字
 * @function readClip
 * @param (void)=>string
 */
const readClip = ():string =>{
    let text = ''
    let textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.style.position = 'fixed';
    textarea.style.clip = 'rect(0 0 0 0)';
    textarea.focus();
    document.execCommand('paste');
    text = textarea.value
    document.body.removeChild(textarea);
    return text
}

/**
 * extension存储空间
 * get方法 & set方法
 */
const extensionStorage = {
    get: (key: any, callback?: (value: any) => void) => {
        chrome.storage.local.get([key], result => {
            callback&&callback(result[key])
        });
    },
    set: (key: any, value: any, callback?: () => void) => {
        chrome.storage.local.set(
            {
                [key]: value,
            },
            () => {
                callback&&callback();
            }
        );
    },
    clear:(callback?: () => void)=>{
        chrome.storage.local.clear(()=>{
            callback&&callback()
        })
    },
    getSync:async function(key:any){
        return new Promise(resolve => {
            chrome.storage.local.get([key],result=>{
                resolve(result[key])
            })
        })
    },
    clearSync:async function(){
        return new Promise<void>(resolve => {
            chrome.storage.local.clear(()=>{
                resolve()
            })
        })
    }
};

/**
 * 唯一uuid
 * @function 生成唯一的uuid ， 格式为GUID格式
 */
function uuid():string{
    let str = '0123456789abcdef'
    let arr = []
    for(let i = 0; i < 36; i++){
        arr.push(str.substr(Math.floor(Math.random() * 0x10), 1))
    }
    arr[14] = 4;
    // @ts-ignore
    arr[19] = str.substr(arr[19] & 0x3 | 0x8, 1)
    arr[8] = arr[13] = arr[18] = arr[23] = '-'
    return arr.join('')
}
export {copyClip,readClip,extensionStorage,uuid}