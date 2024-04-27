import './workspace.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import Upload from '../../components/Upload/Upload';
import Editor from '../../components/Editor/Editor';
import PdfViewer from '../../components/PdfViewer/PdfViewer'
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
function Workspace() {
  const location = useLocation()
  console.log(location.state)
  const workspaceID = useParams()
  const [workspace, setWorkspace ] = useState(null)
  const [pdf, setPDF] = useState("")
  const [loading, setLoading] = useState(true)
  useEffect(() =>{
    if (!workspace){
      setWorkspace(location.state)
      getFile()
    }
    if (workspace){
      console.log("Workspace:", workspace)
    }
  }, [])

  function getTokens() {
    var result = document.cookie.match(new RegExp('session' + '=([^;]+)'));
    result && (result = JSON.parse(result[1]));
    return result;
  }

  async function getFile(){
    const tokens = getTokens()
    try {
        const res = await fetch('http://127.0.0.1:5000/get-file', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"access_token": tokens.access_token, "refresh_token": tokens.refresh_token, "workspace_id": workspaceID.id})
        });
        if (res.ok) {
          const pdf_link = await res.json()
          if (pdf_link.link){
            setPDF(pdf_link.link)
            setLoading(false)
            return
          }
          else{
            setLoading(false)
            return
          }
        } else {
            alert('fail!');
        }
    } catch (error) {
        console.log('Error:', error);
    }
  }

  function resetInterface() {
    setPDF('');
  }

  return (
    <div className="app-container">
      {loading ? 
        <div></div>//add loading animation
        :
        <div className="workspace-container">
        <div>
        <Sidebar />
        </div>
        <div className="content">
          <div className="content-left gray-bg">
          { pdf ? 
            <PdfViewer url={pdf} resetInterface={resetInterface}/>
            : 
            <div><div className="rectangle padding"><Upload id={workspaceID} setPDF={setPDF}/></div></div>}
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