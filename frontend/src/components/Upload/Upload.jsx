import React, {useState, useEffect} from 'react';
import { useWorkspaceContext } from '../../utility/WorkspaceContext';
import './Upload.css'
import { Oval } from 'react-loader-spinner';

function Upload({id, setFile, showFileCard}){    
    const [files, setFiles] = useState([])
    const [loading, setLoading] = useState(false);
    const allowedTypes = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'application/vnd.ms-powerpoint', // .ppt
    'image/png', // .png
    'image/jpeg' // .jpg, .jpeg
    ]; 

    async function upload(){
        for (let i = 0; i < files.length; i++){
            const file = files[i];
            try {
                setLoading(true)
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
                        fd.append('workspace_id', id.id)
            
                        uploadResponse = await fetch('http://127.0.0.1:5000/upload', {
                            method: 'POST',
                            credentials:'include',
                            body: fd
                        });
                    } catch (error) {
                        console.error('Error occurred during conversion:', error);
                    }
                } else if (file.type == 'application/pdf') {
                    const fd = new FormData()
                    fd.append('file', file)
                    fd.append('workspace_id', id.id)
        
                    uploadResponse = await fetch('http://127.0.0.1:5000/upload', {
                        method: 'POST',
                        credentials:'include',
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
                    setFile(pdf_link);
                    setFiles([]);
                } else {
                    console.error('Failed to upload file');
                }
            } catch (error) {
                console.error('Error processing file:', error);
            } finally {
                setLoading(false);
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
            const fileInput = document.getElementById('file-chooser');
            fileInput.files = droppedFiles;
        }
    }

    return ( 
        <div className='upload-container'>  
            <div
            onDrop={e => handleDragEvent(e)}
            onDragOver={e => handleDragEvent(e)}
            onDragEnter={e => handleDragEvent(e)}
            onDragLeave={e => handleDragEvent(e)}
            >
                <form id='dropbox' method="POST" encType="multipart/form-data">
                    <span className='upload-text'>Drag files here to upload or&nbsp;<label id='file-btn-label'for='file-chooser'>browse your computer&nbsp;</label></span>
                    <br></br>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input type='file' id='file-chooser' onChange={handleChange}/>
                        <button type='button' id='upload-button' onClick={upload}>Upload</button>
                        <span>&nbsp;&nbsp;</span>
                        {loading && <Oval color='#000000' secondaryColor='#808080' height={30} width={30} />} {/* Conditional rendering of spinner */}
                    </div>
                    <br></br>
                    <span className='upload-text'>Allowed file types: .pdf, .jpg, .jpeg, .png, .doc, .docx, .ppt, .pptx</span>
                    <br></br>
                    <span>Uploaded files:&nbsp;<button id='file-card-button' onClick={showFileCard}>View files</button></span>
                </form>
            </div>
        </div>
    )
}

export default Upload