import React, {useEffect, useState} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Editor.css'
import { saveAs } from 'file-saver';
import { pdfExporter } from 'quill-to-pdf';

function Editor({editor_id, workspace_id, title}){
    const [value, setValue] = useState('');
    const [workspaceTitle, setWorkspaceTitle] = useState(title);

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

    useEffect(() => {
        workspaceSave();
    }, [workspaceTitle]);


    async function save(){
        try{    
            const res = await fetch('http://127.0.0.1:5000/editor/save', {
                method: 'POST',
                credentials:'include',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            body: JSON.stringify({'editor_id': editor_id, 'data': value})
            })
            const ret = await res.json()
        }
        catch{

        }
    }

    async function workspaceSave(){
        try{    
            const res = await fetch('http://127.0.0.1:5000/workspace/save', {
                method: 'POST',
                credentials:'include',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            body: JSON.stringify({'workspace_id': workspace_id, 'workspace_title': workspaceTitle})
            })
            const ret = await res.json()
        }
        catch{

        }
    }

    async function editorGet(){
        try{    
            const res = await fetch('http://127.0.0.1:5000/editor/get', {
                method: 'POST',
                credentials:'include',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
            body: JSON.stringify({'editor_id':editor_id})
            })
            const ret = await res.json()
            if (res.ok){
                const data = ret[0].data.ops
                setValue(data)
            }
        }
        catch{

        }
    }

    function handleChange(content, delta, source, editor) {
        setValue(editor.getContents())
    }

    async function downloadPdf() {
        try {
            if (!value || typeof value !== 'object' || !Array.isArray(value.ops)) {
              throw new Error('Invalid value format');
            }
            const pdf = await pdfExporter.generatePdf({ ops: value.ops });
            saveAs(pdf, `${workspaceTitle}.pdf`);
          } catch (error) {
            alert('Error downloading file: No text on editor');
          }
    }
    
    const changeWorkspaceTitle = (newWorkspaceTitle) => {
        setWorkspaceTitle(newWorkspaceTitle);
    }
    
    const modules = {
        toolbar: [
            [{ 'font': [] }, { 'size': []}],
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
            <div id = 'text-editor-navbar'>
                <input className='input-box' id='input-box-editor' type="text" placeholder="Enter file name" value={workspaceTitle} onChange={(e) => changeWorkspaceTitle(e.target.value)} />
                <button onClick={downloadPdf}>Download File</button>
            </div>
            <div className='quill-container'>
                <ReactQuill theme="snow" value={value} onChange={handleChange} modules ={modules}/>
            </div>
        </div>
    )
}

export default Editor