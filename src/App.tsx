import React from 'react';
import styled from 'styled-components';
import DragNdrop, { FileI } from './components/file-upload/file-upload';
import Tabs from './components/tabs/tabs';
import Files from './components/files/files';
import PDFViewer from './components/pdf-viewer/pdf-viewer';
import NoFileSelected from './components/no-file/no-file';
import ImageViewer from './components/image-viewer/image-viewer';
import UnsupportedFile from './components/unsupported-file/unsupported-file';
import { Editor } from './components/editor/Editor';

const AppContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const FileUploadHandler = styled.div`
  // box-sizing: border-box;
  height: 15vh;
  background-color: #3A3A4C;
`;

const EditorLayout = styled.div`
  display: flex;
  height: 85vh;
`;

const FileTree = styled.div`
  width: 20%;
  overflow-y: auto;
`;

const EditorContainer = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
`;

const TabsS = styled.div`
  border-bottom: 1px solid #22222C;
  border-top: 1px solid #22222C;
  background-color: #22222C;
  height: 50px;
`;

const renderFileContent = (
    editorFile: FileI | null, 
    onContentChange: (context: string, file: FileI)=> void,
    onFileSave: (context: string, file: FileI)=> void,
    onClickDownload: () => void
  ) => {  
  if (!editorFile) {
    return <NoFileSelected />;
  }
  switch (editorFile.type) {
    case 'unknown':
      return <UnsupportedFile />;
    case 'image':
      return <ImageViewer file={editorFile.file} />;
    case 'pdf':
      return <PDFViewer file={editorFile.file} />;
    default:
      return <Editor
        data={editorFile}
        onContentChange={(newContent) => {
          onContentChange(newContent, editorFile);
        }}
        onFileSave={(newContent) => {
          onFileSave(newContent, editorFile);
        }}
        onClickDownload={onClickDownload}
      />
  }
};
const App: React.FC = () => {
  const [files, setFiles] = React.useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = React.useState<string | null>(null);
  const [openTabs, setOpenTabs] = React.useState<FileI[]>([]);
  const [editorFile, setEditorFile] = React.useState<FileI | null>(null);
  const handleFilesSelected = (uploadedFiles: Record<string, any>) => {
    setFiles(uploadedFiles);
  };

  const handleTabChange = (file: FileI) => {
    setActiveTab(file.name);
    setEditorFile(file);
  }
  const handleTabClose = (fileToClose: FileI) => {
    if (fileToClose.changedContent !== fileToClose.content) {
      const shouldClose = confirm('Do you want to close the file without saving?');
      if (!shouldClose) {
        return;
      }
      fileToClose.changedContent = fileToClose.content;
    }
    setOpenTabs((currentTabs) => {
      const tabIndex = currentTabs.findIndex(tab => tab.name === fileToClose.name);
      const updatedTabs = currentTabs.filter((_, index) => index !== tabIndex);

      if (activeTab === fileToClose.name) {
        const newActiveIndex = tabIndex === 0 ? 0 : tabIndex - 1;
        const newActiveTab = updatedTabs[newActiveIndex] ? updatedTabs[newActiveIndex].name : null;
        setActiveTab(newActiveTab);
        setEditorFile(updatedTabs[newActiveIndex] || null);
      }
      return updatedTabs;
    });
  };
  
  const handleFileChange = (file: FileI) => {
    setOpenTabs(currentTabs => {
      const isFileAlreadyOpen = currentTabs.some(tab => tab.name === file.name);
      if (!isFileAlreadyOpen) {
        return [...currentTabs, file];
      }
        return currentTabs;
    });
    handleTabChange(file);
  };

  const handleContentChange = (newContent: string, file: FileI) => {
    const changedFile = {...file, changedContent: newContent};
    const path = changedFile.relativePath.split('/');
    let current = files;
    for (let i = 0; i < path.length - 1; i++) {
        const part = path[i];
        if (!current[part]) {
            current[part] = {};
        }
        current = current[part];
    }
    const fileName = path[path.length - 1];
    current[fileName] = changedFile;
    setFiles({...files});
    setOpenTabs((currentTabs) => {
      return currentTabs.map(tab => {
        if (tab.name === file.name) {
          return changedFile;
        }
        return tab;
      });
    })
  }

  const handleFileSave = (newContent: string, file: FileI) => {
    const changedFile = {...file, content: newContent, changedContent: newContent};
    const path = changedFile.relativePath.split('/');
    let current = files;
    for (let i = 0; i < path.length - 1; i++) {
        const part = path[i];
        if (!current[part]) {
            current[part] = {};
        }
        current = current[part];
    }
    const fileName = path[path.length - 1];
    current[fileName] = changedFile;
    setFiles({...files});

    setOpenTabs((currentTabs) => {
      return currentTabs.map(tab => {
        if (tab.name === file.name) {
          return changedFile;
        }
        return tab;
      });
    })
  }
  const handleDownload = () =>{
    if(!editorFile) return
    const index = openTabs.findIndex((val) => val.name === editorFile.name)
    const myFile = {...openTabs[index]}
    const content = myFile.content || myFile.changedContent || '';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = myFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  return (
    <AppContainer>
      <FileUploadHandler>
        <DragNdrop
          onFilesUploaded={handleFilesSelected}
          downloadFiles={files}
        />
      </FileUploadHandler>
      <EditorLayout>
        <FileTree>
          <Files 
            data={files}
            onFileChange={handleFileChange}
            activeFile={activeTab}
          />
        </FileTree>
        <EditorContainer>
          <TabsS>
            <Tabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onTabClose={handleTabClose}
              data={openTabs}
            />
          </TabsS>
          {renderFileContent(
            editorFile, 
            handleContentChange, 
            handleFileSave, 
            handleDownload
          )}
        </EditorContainer>
      </EditorLayout>
    </AppContainer>
  );
}

export default App;
