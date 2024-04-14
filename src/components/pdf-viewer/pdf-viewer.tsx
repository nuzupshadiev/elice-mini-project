import React, { useState } from 'react';
import { Document, pdfjs, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import './pdf-viewer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faSearchPlus, faSearchMinus } from '@fortawesome/free-solid-svg-icons';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
interface PDFViewerProps {
  file: File;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNum, setPageNum] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0); 

  const onLoadSuccess = (pdfDoc: any) => {
    setNumPages(pdfDoc._pdfInfo.numPages);
    setPageNum(1);
  }

  const changePage = React.useCallback((offset: number) => {
    const newPage = offset + pageNum;
    if (newPage > 0 && newPage <= numPages) {
      setPageNum(newPage);
    }
  }, [pageNum, numPages]);

  const zoomIn = () => {
    if(scale * 1.1 >= 3.0) return;
    setScale(scale => scale * 1.1); 
  };

  const zoomOut = () => {
    if(scale * 0.9 <= 0.9) return;
    setScale(scale => scale * 0.9);
  };

  const downloadFile = () => {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name || 'download.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return (
    <div className="pdf-viewer-container">
      <div className='pdf-document-wrapper'>
        <Document
          file={file}
          onLoadSuccess={onLoadSuccess}
          className="pdf-document"
        >
          <Page
            pageNumber={pageNum}
            scale={scale}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            className="pdf-page"
          />
        </Document>
      </div>
      <div className='pdf-control'>
        <div className='controls'>
          <div className="icon-button" onClick={zoomOut}>
            <FontAwesomeIcon icon={faSearchMinus} />
          </div>
          <div className="icon-button" onClick={() => changePage(-1)}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </div>
          <p>
            <input
              type="number"
              value={pageNum}
              onChange={(e) => {
                const newPage = Number(e.target.value);
                if (newPage > 0 && newPage <= numPages) {
                  setPageNum(newPage);
                }
              }}
            />
            / {numPages}</p>
          <div className="icon-button" onClick={() => changePage(1)}>
            <FontAwesomeIcon icon={faAngleRight} />
          </div>
          <div className="icon-button" onClick={zoomIn}>
            <FontAwesomeIcon icon={faSearchPlus} />
          </div>
          </div>
          <div
            className='download-button'
            onClick={downloadFile}
          >
            Download file
          </div>
      </div>
    </div>
  );
};

export default PDFViewer;
