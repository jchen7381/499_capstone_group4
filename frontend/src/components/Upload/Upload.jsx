import React, {useState, useEffect} from 'react';
import { useWorkspaceContext } from '../../utility/WorkspaceContext';
import './Upload.css'

function Upload({id, setPDF}){    
    const [files, setFiles] = useState([])
    useEffect(() => {
        if (files.length){
        }
    }, [files])
    function getTokens(){
        var result = document.cookie.match(new RegExp('session' + '=([^;]+)'))
        result && (result = JSON.parse(result[1]));
        return result
    }
    async function upload(){
        const tokens = getTokens()
        for (let i = 0; i < files.length; i++){
            const fd = new FormData()
            fd.append('file', files[i])
            fd.append('access_token', tokens.access_token)
            fd.append('refresh_token', tokens.refresh_token)
            fd.append('workspace_id', id.id)
            try{
                const res = await fetch('http://127.0.0.1:5000/upload', {
                    method: 'POST',
                    body: fd
                })
                const pdf_link = await res.json()
                if (res.ok){
                    console.log(setPDF)
                    setPDF(pdf_link.link)
                }
            }
            catch{
    
            }
        }
    }

    const handleChange = async (event) =>{
        setFiles([...files, ...event.target.files])
    }

    const handleDragEvent = async (e) =>{
        e.preventDefault();
        e.stopPropagation();
        if(e.type === 'drop'){
            const dt = e.dataTransfer;
            const droppedFiles = dt.files;
            setFiles([...files, ...droppedFiles])
        }
    }

    return ( 
        <div className='upload-container'>  
            <div id='dropbox'
            onDrop={e => handleDragEvent(e)}
            onDragOver={e => handleDragEvent(e)}
            onDragEnter={e => handleDragEvent(e)}
            onDragLeave={e => handleDragEvent(e)}
            >
                <form id='dropbox' method="POST" encType="multipart/form-data">
                    <label>Drag files here to upload</label>
                    <span>Or<label id='file-btn-label'for='file-chooser'>browse your computer</label></span>
                    <input type='file' id='file-chooser' onChange={handleChange}/>
                    <button type='button' onClick={upload}>Upload</button>
                </form>
            </div>
            <div id='file-list'>
                {files.map((file) =>(
                    <div key={file.name}>{file.name}</div>
                ))}
            </div>
        </div>
    )
}

export default Upload
