import { copyClip } from '../library/utils'
const swagger = ()=>{
    const doms = document.getElementsByClassName('opblock')
    for(let i=0;i<doms.length;i++){
        const dom = doms[i]
        let newBtn = document.createElement("button");
        newBtn.innerText='复制链接'
        newBtn.style.float = 'right'
        newBtn.onclick=(e:any)=>{
            copyClip(e.target.parentNode.previousElementSibling?.childNodes[0].childNodes[0].innerHTML)
            e.stopPropagation()
        }
        try {
            if(dom.childNodes[0].childNodes[2]){
                dom.childNodes[0].childNodes[2].appendChild(newBtn)
            }else{
                dom.childNodes[0].childNodes[0].childNodes[2].appendChild(newBtn)
            }
        }catch (e){
            console.log(e)
        }
    }
    console.log('success 接口数==> ',doms.length)
}
export {swagger}