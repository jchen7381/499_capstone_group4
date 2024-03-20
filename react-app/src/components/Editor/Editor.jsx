import React, {useEffect, useState} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Editor.css'

const Editor = () =>{
    const [value, setValue] = useState('');
    const [document, setDocument] = useState({data:''})
    useEffect(()=>{
        async function save(){
            
        }
        if (value){
            console.log(value)
            save()
        }
    }, [value])
    function handleChange(content, delta, source, editor) {
        setValue(editor.getContents())
    }

    return(
        <div className='text-editor-container'>
            <div className='quill-container'>
                <ReactQuill theme="snow" value={value} onChange={handleChange}/>
            </div>
        </div>
    )
}

export default Editor