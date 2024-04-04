import './workspace.css';
// @ts-ignore
import Sidebar from '../../components/Sidebar/Sidebar';
// @ts-ignore
import Upload from '../../components/Upload/Upload';
// @ts-ignore
import Editor from '../../components/Editor/Editor';
function Workspace() {
  return (
    <div className="app-container">
      <div className="main-container">
        <div>
        <Sidebar />
        </div>
        <div className="content">
          <div className="content-left gray-bg">
            <div className="rectangle padding"><Upload /></div>
          </div>
          <div className="content-right white-bg">
            <div className="text-editor"><Editor /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Workspace;
