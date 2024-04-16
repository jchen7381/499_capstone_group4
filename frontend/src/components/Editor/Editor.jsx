import React, {useEffect, useState} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Editor.css'

function Editor({editor_id}){
    const [value, setValue] = useState('');
    console.log(editor_id)
    useEffect(()=>{
        if (!value){
            editorGet()
        }
    }, [])
    //Change saving method
    useEffect(()=>{
        if (value){
            save()
        }
    }, [value])
    function getTokens() {
        var result = document.cookie.match(new RegExp('session' + '=([^;]+)'));
        result && (result = JSON.parse(result[1]));
        return result;
    }
    async function save(){
        const tokens = getTokens()
        try{    
            const res = await fetch('http://127.0.0.1:5000/editor/save', {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            body: JSON.stringify({'access_token': tokens.access_token, 'refresh_token': tokens.refresh_token, 'editor_id':editor_id, 'data': value})
            })
            const ret = await res.json()
            if (res.ok){
                
                console.log(ret, value)
            }
        }
        catch{

        }
    }
    async function editorGet(){
        const tokens = getTokens()
        try{    
            const res = await fetch('http://127.0.0.1:5000/editor/get', {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            body: JSON.stringify({'access_token': tokens.access_token, 'refresh_token': tokens.refresh_token, 'editor_id':editor_id})
            })
            const ret = await res.json()
            if (res.ok){
                const data = ret[0].data.ops
                console.log("Editor data:" , data)
                setValue(data)
            }
        }
        catch{

        }
    }

    function handleChange(content, delta, source, editor) {
        setValue(editor.getContents())
    }

    const modules = {
        toolbar: [
            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, 
             {'indent': '-1'}, {'indent': '+1'}, 'direction'],
            [{'align': []}],
            ['link', 'image', 'video'],
            ['clean']
        ],
        clipboard: {
            matchVisual: false,
        },
        history: {
            delay: 1000,
            maxStack: 50,
            userOnly: true
        }
    };

    return(
        <div className='text-editor-container'>
            <div className='quill-container'>
                <ReactQuill theme="snow" value={value} onChange={handleChange} modules ={modules}/>
            </div>
        </div>
    )
}

export default Editor