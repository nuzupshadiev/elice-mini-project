import { useRef, useState, useEffect, useCallback } from 'react';
import * as monaco from 'monaco-editor';
import { FileI } from '../file-upload/file-upload';
import './editor.css';

interface EditorProps {
  data: FileI;
  onContentChange: (newContent: string) => void;
  onFileSave: (newContent: string) => void;
  onClickDownload: () => void;
}

export const Editor = ({ data, onContentChange, onFileSave, onClickDownload}: EditorProps) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef<HTMLDivElement | null>(null);

  const handleEditorChange = () => {
    const model = editorRef.current?.getModel();
    if (model) {
      const currentContent = model.getValue();
      if(currentContent !== data.changedContent){
        onContentChange(currentContent);
      }
    }
  };

  const saveTheChanges = () => {
    const model = editorRef.current?.getModel();
    if (model) {
      const currentContent = model.getValue();
      onFileSave(currentContent);
    }
  }
  useEffect(() => {
    if(monacoEl.current){
      const editor = monaco.editor.create(monacoEl.current, {
        value: data.changedContent,
        language: data.type,
        theme: 'vs-dark',
        fontSize: 14,
        scrollBeyondLastLine: false,
        roundedSelection: false
      });
      editor.getModel()?.onDidChangeContent(handleEditorChange);
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, saveTheChanges);
      editorRef.current = editor;
      return () => {
        editor.dispose();
        editorRef.current = null;
      };
    }
  }, [data]);

  return (
    <div className='editor-container'>
      <div className='editor' ref={monacoEl}></div>
      <div className='download-btn' onClick={onClickDownload}>Download file</div>
    </div>
  );
  
};
