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
        const allowedTypes = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
                         'application/msword', // .doc
                         'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
                         'application/vnd.ms-powerpoint', // .ppt
                         'image/png', // .png
                         'image/jpeg' // .jpg, .jpeg
        ]; 
        for (let i = 0; i < files.length; i++){
            const file = files[i];
            try {
                let uploadResponse;
                if (file.type !== 'application/pdf' && allowedTypes.includes(file.type)) {
                    const formData = new FormData();
                    formData.append('file', file);
                
                    try {
                        const convertResponse = await fetch('http://127.0.0.1:5000/convert', {
                            method: 'POST',
                            body: formData
                        });
                
                        if (!convertResponse.ok) {
                            console.error('Failed to convert file to PDF');
                            return;
                        }
                
                        const pdfBlob = await convertResponse.blob();
                        const convertedFile = new File([pdfBlob], file.name.replace(/\.[^/.]+$/, ".pdf"), { type: 'application/pdf' });
                
                        const fd = new FormData()
                        fd.append('file', convertedFile)
                        fd.append('access_token', tokens.access_token)
                        fd.append('refresh_token', tokens.refresh_token)
                        fd.append('workspace_id', id.id)
            
                        uploadResponse = await fetch('http://127.0.0.1:5000/upload', {
                            method: 'POST',
                            body: fd
                        });
                    } catch (error) {
                        console.error('Error occurred during conversion:', error);
                    }
                } else if (file.type == 'application/pdf') {
                    const fd = new FormData()
                    fd.append('file', file)
                    fd.append('access_token', tokens.access_token)
                    fd.append('refresh_token', tokens.refresh_token)
                    fd.append('workspace_id', id.id)
        
                    uploadResponse = await fetch('http://127.0.0.1:5000/upload', {
                        method: 'POST',
                        body: fd
                    });
                }
                else {
                    setFiles([]);
                    alert('Unsupported file type: ' + file.type);
                    console.error('Unsupported file type:', file.type);
                }
        
                if (uploadResponse.ok) {
                    const pdf_link = await uploadResponse.json();
                    setPDF(pdf_link.link);
                    setFiles([]);
                } else {
                    console.error('Failed to upload file');
                }
            } catch (error) {
                console.error('Error processing file:', error);
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
                    <span>Drag files here to upload or&nbsp;<label id='file-btn-label'for='file-chooser'>browse your computer&nbsp;</label></span>
                    <br></br>
                    <input type='file' id='file-chooser' onChange={handleChange}/>
                    <button type='button' id='upload-button' onClick={upload}>Upload</button>
                    <br></br>
                    <span>Allowed file types: .pdf, .jpg, .jpeg, .png, .doc, .docx, .ppt, .pptx</span>
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
