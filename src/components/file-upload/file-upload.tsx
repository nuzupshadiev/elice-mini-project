import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileArrowUp, faDownload } from "@fortawesome/free-solid-svg-icons";
import JSZip from "jszip";
import { convertFileToBuffer } from "../../utils/file-to-buffer";

import "./file-upload.css";
import { textOrBinary } from "../../utils/binary";
import { getType } from "../../utils/get-type";

interface DragNdropProps {
  onFilesUploaded: (decompressedFiles: Record<string, any>) => void;
  downloadFiles: Record<string, any>;
}
export interface FileI {
  name: string;
  isFile: boolean;
  file: File;
  type: string;
  content?: string;
  changedContent?: string;
  relativePath: string;
  isText: boolean;
}


const DragNdrop: React.FC<DragNdropProps> = ({
  onFilesUploaded,
}) => {
  const [files, setFiles] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string>("" as string);

  const decompressZip = (file: File): Promise<any> => {
    setIsLoading(true);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = function (event) {
        const zip = new JSZip();
        zip.loadAsync(reader.result as ArrayBuffer)
          .then((zipContents) => {
            let filesByFolder: any = {};
            const promises: Promise<void>[] = [];
  
            zipContents.forEach((relativePath, zipEntry) => {
              if (!zipEntry.dir) {
                const pathParts = relativePath.split('/');
                let currentFolder = filesByFolder;
  
                for (let i = 0; i < pathParts.length - 1; i++) {
                  const folderName = pathParts[i];
                  if (!currentFolder[folderName]) {
                    currentFolder[folderName] = {};
                  }
                  currentFolder = currentFolder[folderName];
                }
  
                const fileName = pathParts[pathParts.length - 1];
                const promise = zipEntry.async("blob").then((content: Blob) => {
                  const file = new File([content], fileName, { type: content.type });
                  convertFileToBuffer(file)
                  .then((buffer) => {
                    const isText = true ? textOrBinary(buffer) === 'utf8' : false;
                    currentFolder[fileName] = {
                      name: fileName,
                      isFile: true,
                      file: file,
                      type: getType(fileName, isText),
                      relativePath: relativePath,
                      isText: isText,
                    } as FileI;

                    if(isText){
                      file.text().then((text) => {
                        currentFolder[fileName] = {
                          ...currentFolder[fileName],
                          content: text,
                          changedContent: text,
                        } as FileI;
                      });
                    }
                  });
                });
                promises.push(promise);
              }
            });
  
            Promise.all(promises)
              .then(() => {
                resolve(filesByFolder);
              })
              .catch((error) => {
                reject(error);
              })
              .finally(() => setIsLoading(false));
          })
          .catch((error) => {
            reject(error);
          });
      };
  
      reader.onerror = function (event) {
        reject(new Error("File reading error."));
      };
  
      reader.readAsArrayBuffer(file);
    });
  };
  
  const zipAndDownloadFiles = async (filesByFolder: Record<string, any>): Promise<void> => {
    const zip = new JSZip();
    setIsLoading(true);
    addFilesToZip(filesByFolder, zip);
    zip.generateAsync({ type: "blob" }).then((content) => {
      const blob = new Blob([content], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a")
      a.href = url;
      a.download = `${fileName.split('.')[0]}-modified.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsLoading(false);
    })
    .catch((error) => {console.error(error);});
  };
  const addFilesToZip = (folderData: Record<string, any>, currentZipFolder: JSZip) => {
    Object.keys(folderData).forEach(key => {
      const item = folderData[key];
      if (item && item.isFile) {
        const blob = new Blob([item.content], { type: item.file.type });
        if(item.isText){
          currentZipFolder.file(item.name, item.content);
        }
        else {
          currentZipFolder.file(item.name, item.file);
        }
      } else {
        const newFolder = currentZipFolder.folder(key);
        if (newFolder) {
          addFilesToZip(item as Record<string, any>, newFolder);
        }
      }
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setFileName(selectedFile.name);
      decompressZip(selectedFile)
      .then((filesByFolder) => {
        onFilesUploaded(filesByFolder)
        setFiles(filesByFolder);
      })
      .catch((error) => {console.error(error);});
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFileName(droppedFile.name);
      decompressZip(droppedFile)
      .then((filesByFolder) => {
        onFilesUploaded(filesByFolder)
        setFiles(filesByFolder);
      })
      .catch((error) => {console.error(error);});
    }
  };
  
  return (
    <div className="drag-drop">
      {isLoading ? (
        <div className="file-downloader">
          <p>Processing your files...</p>
        </div>
      ) : Object.keys(files).length > 0 ? (
        <div className="file-downloader">
          <p>Download your modified files as a zip file</p>
          <div
            className="download-button"
            onClick={() => zipAndDownloadFiles(files)}
          >
            Download
          </div>
        </div>
      ) : (
        <div
          className={`document-uploader`}
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
        >
          <>
            <div className="upload-info">
              {/* <div className="icon-container">
                <FontAwesomeIcon
                  icon={faFileArrowUp}
                  style={{color: "#fff"}}
                />
              </div> */}
              <div>
                <p>Drop your files here</p>
                <p>or</p>
              </div>
            </div>
            <input
              type="file"
              hidden
              id="browse"
              onChange={handleFileChange}
              accept=".zip"
              multiple
            />
            <label htmlFor="browse" className="browse-btn">
              Browse
            </label>
          </>
        </div>
      )}
    </div>
  );
};

export default DragNdrop;
