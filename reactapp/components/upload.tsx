'use client';
import React, {useState, useEffect} from "react";
export default function Upload(){
    const [uploadedFiles, setUploadedFiles] = useState([])
    const [files, setFiles] = useState([])
    useEffect(() => {
        if (uploadedFiles.length){
            console.log('Uploaded files:' + uploadedFiles)
        }
    }, [uploadedFiles]) 
    useEffect(() => {
        if (files.length){
            console.log('Files:' + files)
        }
    }, [files])
}