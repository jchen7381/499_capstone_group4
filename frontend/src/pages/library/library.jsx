import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './library.css';
//@ts-ignore
import Navbar from '../../components/Navbar/Navbar';
import Header from '../../components/Header/Header';
import { useDashboardContext } from '../../utility/DashboardContext';
function Library() {
    const {files, dispatch} = useDashboardContext()
    useEffect(() =>{
    }, [])
    async function getFiles(){
        try{
            const res = await fetch('http://127.0.0.1:5000/user/library/get', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });
          if (res.ok) {
          const library = await res.json()
          if (library){
            console.log('library')
            setFiles(library)
            return
          }
          else{
            console.log('There are no files')
            return
          }
        } else {
            alert('fail!');
        }
    } catch (error) {
        console.log('Error:', error);
    }
    }
    return (
        <div className="website-container">
            <Header />
            <Navbar />
            <div className="main-container">
                <div className="content-container">
                    <h2 className="text-color">Library</h2>
                    <div>{files.length ? 
                        <div>{files.map(file =>(
                            <div key={file.id} className='file-card'>
                                {file.file_name}
                                <a href={file.file_url}>{file.file_url}</a>
                            </div>
                        ))}</div>   
                        :
                        <div>{files.length}</div>
                    }</div>
                </div>
            </div>
        </div>
    );
}

export default Library;
