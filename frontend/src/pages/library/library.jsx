import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './library.css'; 
//@ts-ignore
import Navbar from '../../components/Navbar/Navbar';
import Header from '../../components/Header/Header';
import { useDashboardContext } from '../../utility/DashboardContext';

function Library() {
    const { files, dispatch } = useDashboardContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFiles();
    }, []);

    useEffect(() => {
        const filtered = files.filter(file =>
            file.file_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredFiles(filtered);
    }, [searchTerm, files]);

    async function getFiles() {
        try {
            const res = await fetch('http://127.0.0.1:5000/user/library/get', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });
            if (res.ok) {
                const library = await res.json();
                if (library) {
                    dispatch({ type: 'SET_FILES', payload: library });
                    setLoading(false);
                    return;
                } else {
                    console.log('There are no files');
                }
            } else {
                throw new Error('Failed to fetch files');
            }
        } catch (error) {
            console.error('Error:', error.message);
            setLoading(false);
            // Display error message to the user
        }
    }


    return (
        <div className="website-container">
            <Header />
            <Navbar />
            <div className="main-container">
                <div className="content-container">
                    <h2 className="text-color">Library</h2>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <i className="fa fa-search"></i>
                    </div>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="file-list">
                            {filteredFiles.length ? (
                                filteredFiles.map(file => (
                                    <div key={file.id} className='file-card'>
                                        <p>{file.file_name}</p>
                                        <a href={file.file_url}>{file.file_url}</a>
                                    </div>
                                ))
                            ) : (
                                <h2 className='file-card'>No files found</h2>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Library;
