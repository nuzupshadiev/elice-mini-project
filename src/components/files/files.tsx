import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faFileImage, faFileCode, faFilePdf, faFolderOpen, faFolder, faPlus, faUpload, faFolderTree } from '@fortawesome/free-solid-svg-icons';
import './files.css';
import { FileI } from '../file-upload/file-upload';


interface FileProps {
  title: string;
  isActive: boolean;
  onClick: (file: FileI) => void;
  file: FileI;
}
interface FilesProps {
  activeFile?: string | null;
  onFileChange: (file: FileI) => void;
  data: Record<string, any>;
}
interface FolderProps {
  title: string;
  files: Record<string, any>;
  onClick: (file: FileI) => void;
  level: number;
  activeFile?: string | null;
}

const Folder: React.FC<FolderProps> = ({ title, files, onClick, level, activeFile}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleFolder = () => setIsOpen(!isOpen);
  const style = { 
    paddingLeft: `${level * 15}px`
  };
  return (
    <div>
      <div className="file" onClick={toggleFolder}>
        <FontAwesomeIcon icon={isOpen ? faFolderOpen : faFolder} />
        <div className='file-title'>
          <span>{title}</span>
        </div>
      </div>
      {isOpen &&
        <div style={style} className='indent'>
          {Object.entries(files).map(([key, value]) => {
            if(value.isFile){
              return(
                <File
                  key={key}
                  title={value.file.name}
                  isActive={value.file.name === activeFile}
                  onClick={() => onClick(value)}
                  file={value}
                />
              )
            }
            else{
              return(
                <Folder
                  level={level+1}
                  key={key}
                  title={key}
                  files={value}
                  onClick={onClick}
                  activeFile={activeFile}
                />
              )
            }
          })
        }
        </div>
      }
    </div>
  );
};

const File: React.FC<FileProps> = ({ title, isActive, onClick, file }) => {
  return (
    <div className={`file ${isActive ? 'active' : ''}`} onClick={()=>onClick(file)}>
      <FontAwesomeIcon icon={file.isText ? faFileCode : faFile}/>
      <p>{title}</p>
    </div>
  );
};

const Files: React.FC<FilesProps> = ({ activeFile, onFileChange, data }) => {
  const handleFileChange = (file: FileI) => {
    onFileChange(file);
  }
  return (
    <div className='files'>
      <div className='files-header'>
        <p>Tree Viewer</p>
      </div>
      {Object.entries(data).map(([key, value]) => {
        if(value.isFile){
          <File 
            key={key}
            title={value.name}
            isActive={activeFile === value.name}
            onClick={handleFileChange}
            file={value}
          />
        }
        else{
          return(
            <Folder
              level={1}
              key={key}
              title={key}
              files={value}
              onClick={handleFileChange}
              activeFile={activeFile}
            />
          )
        }
      })}
    </div>
  );
};

export default Files;