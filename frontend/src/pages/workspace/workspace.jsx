import './workspace.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import Upload from '../../components/Upload/Upload';
import Editor from '../../components/Editor/Editor';
import PdfViewer from '../../components/PdfViewer/PdfViewer'
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import FileCard from '../../components/FileCard/fileCard';
function Workspace() {
  const location = useLocation()
  const workspaceID = useParams()
  const [workspace, setWorkspace ] = useState(location.state)
  const [files, setFile] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPDF, setCurrentPDF] = useState(null)
  useEffect(() =>{
    getFile()
  }, [])

  async function getFile(){
    try {
        const res = await fetch('http://127.0.0.1:5000/get-file', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"workspace_id": workspace.workspace_id})
        });
          const file_list = await res.json()
          setFile(file_list)
          console.log(file_list)
          setLoading(false)
    } catch (error) {
        console.log('Error:', error);
    }
  }

  function resetInterface() {
    setCurrentPDF('');
  }

  return (
    <div className="app-container">
      {loading ? 
        <div></div>//add loading animation
        :
        <div className="workspace-container">
        <Sidebar />
        <div className="content">
          <div className="content-left gray-bg">
            <div>
              {currentPDF ? <PdfViewer url={currentPDF} resetInterface={resetInterface}/> : 
              <div className='files'>
                <Upload id={workspaceID} setFile={setFile} />
                Workspace Files:
                {files.map((file) =>(
                  <div onClick={(e) => {setCurrentPDF(file.url)}}>
                    <FileCard fileUrl={file.url} fileName={file.filename} />
                  </div>
                ))}
              </div>
              }
            </div>
          </div>
          <div className="content-right white-bg">
            <div className="text-editor"><Editor editor_id={workspace.editor_id} workspace_id={workspaceID.id} title={workspace.title}/></div>
          </div>
        </div>
      </div>
     }
    </div>
  );
}

export default Workspace;