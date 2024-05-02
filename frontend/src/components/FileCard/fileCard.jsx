import './fileCard.css'
import { IoChevronDownOutline } from "react-icons/io5";
import { IoChevronUpOutline } from "react-icons/io5";

const FileCard = ({fileName, fileUrl}) =>{
    function onClickEvent(e){
        e.stopPropagation()
        const element = e.target.parentElement
        console.log(element)
        const sibling = element.nextElementSibling;
        sibling.style.maxHeight ? sibling.style.maxHeight = null : sibling.style.maxHeight = sibling.scrollHeight + "px"
    }
    return (
        <div className="fileCard">
            <div className='fileCard-content'>
                <h3>{fileName}</h3>
                <button className='accordion' onClick={onClickEvent}><IoChevronDownOutline size={30}/></button>
                <div className='panel'>
                    <iframe className='custom-iframe' src={fileUrl} />
                </div>
            </div>
        </div>
    )
}

export default FileCard;