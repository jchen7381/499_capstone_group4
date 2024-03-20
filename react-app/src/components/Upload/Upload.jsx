import React, {useState, useEffect} from 'react';
import './Upload.css'

function Upload(){    
    const [files, setFiles] = useState([])
    useEffect(() => {
        if (files.length){
            console.log(files)
        }
    }, [files])
    async function upload(){
        const {data, error} = await supabase.auth.getUser()
        const path = "/" + data.user.id + "/"
        for (let i = 0; i < files.length; i++){
            const {data, error} = await supabase.storage.from('test').upload(path + files[i].name, files[i])
            if (error){
                console.log('Error:' + error)
            }
            else{
                console.log('File uploaded:' + data)
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
                    <input type='file' id='file-chooser' onChange={handleChange} multiple hidden/>
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