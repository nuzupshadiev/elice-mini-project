import React, { useState, useEffect } from 'react';
import './image-viewer.css';

interface ImageViewerProps {
  file: File;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ file }) => {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return () => {
      URL.revokeObjectURL(url); 
    };
  }, [file]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = file.name || 'image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="image-viewer-container">
      <img 
        src={imageUrl} 
        alt="Uploaded content" 
        className="image-content"
      />
      <div 
        className="download-button-image"
        onClick={handleDownload}
      >
        Download image
      </div>
    </div>
  );
};

export default ImageViewer;
