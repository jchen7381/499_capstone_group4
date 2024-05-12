import './workspace.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import Upload from '../../components/Upload/Upload';
import Editor from '../../components/Editor/Editor';
import PdfViewer from '../../components/PdfViewer/PdfViewer';
import FileCard from '../../components/FileCard/fileCard';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

function Workspace({onFavorite}) {
  const location = useLocation();
  const workspaceID = useParams();
  const [workspace, setWorkspace] = useState(location.state);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPDF, setCurrentPDF] = useState(null);
  const [showUpload, setShowUpload] = useState(true); 
  useEffect(() => {
    getFile();
  }, []);

  async function getFile() {
    try {
      const res = await fetch('http://127.0.0.1:5000/get-file', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "workspace_id": workspace.workspace_id })
      });
      const file_list = await res.json();
      setFiles(file_list);
      console.log(file_list);
      setLoading(false);
    } catch (error) {
      console.log('Error:', error);
    }
  }

  useEffect(() => {
    if (files.length > 0) {
      setCurrentPDF(files[files.length-1]?.url);
      setShowUpload(false);
    }
  }, [files]);

  function resetInterface() {
    setCurrentPDF('');
  }

  function showFileCard() {
    setShowUpload(false);
  }

  function showUploadForm() {
    setShowUpload(true);
  }
  async function handleUploadComplete() {
    await getFile();
  }

  return (
    <div className="app-container">
      {loading ?
        <div>Loading...</div>
        :
        <div className="workspace-container">
          <Sidebar />
          <div className="content">
            <div className="content-left gray-bg">
              {currentPDF ? (
                <PdfViewer url={currentPDF} resetInterface={resetInterface} />
              ) : (
                <div className="files">
                  {showUpload ? (
                    <Upload
                      id={workspaceID}
                      setFile={setFiles}
                      showFileCard={showFileCard}
                      onUploadComplete={handleUploadComplete}
                    />
                  ) : (
                    <div className="filecards-container">
                      Workspace Files:
                      <div>
                        {files.map((file, index) => (
                          <div key={index} onClick={() => setCurrentPDF(file.url)}>
                            <FileCard fileUrl={file.url} fileName={file.filename} />
                          </div>
                        ))}
                      </div>
                      <span>
                        Not what you're looking for? <button id='return-button' onClick={showUploadForm}>Upload Another File</button>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="content-right white-bg">
              <div className="text-editor">
                <Editor editor_id={workspace.editor_id} workspace_id={workspaceID.id} title={workspace.title} />
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default Workspace;