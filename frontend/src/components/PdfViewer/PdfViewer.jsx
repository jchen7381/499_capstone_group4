import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import html2canvas from 'html2canvas';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import './PdfViewer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfViewer = () => {
  const pdfUrl = 'http://127.0.0.1:5000/get_pdf/beginners_python_cheat_sheet_pcc_all.pdf';
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState(1);
  const pdfContainerRef = useRef(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [screenshotImage, setScreenshotImage] = useState('');
  const cropperRef = useRef(null);

  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleInputChange = (event) => {
    let value = parseInt(event.target.value, 10);
    if (isNaN(value)) {
      value = '';
    } else if (value < 1) {
      value = 1;
    } else if (value > numPages) {
      value = numPages;
    }
    setInputPage(value);
    setCurrentPage(value);
  };

  const handleLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleScreenshot = () => {
    const pdfContentElement = pdfContainerRef.current;
    html2canvas(pdfContentElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      setScreenshotImage(imgData);
      setImageModalVisible(true);
    });
  };

  const handleConfirm = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      if (croppedCanvas) {
        const croppedImage = croppedCanvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = croppedImage;
        link.download = 'cropped_image.png';

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
      }
    }
    setImageModalVisible(false);
  };

  const handleClose = () => {
    setImageModalVisible(false);
  };

  return (
    <>
      <div className="pdf-navigation">
        {imageModalVisible ? (
          <>
            <button onClick={handleConfirm}>Crop & Download</button>
            <button onClick={handleClose}>Exit</button>
          </>
        ) : (
          <>
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page </span>
            <input
              type="number"
              min="1"
              max={numPages || ''}
              value={inputPage}
              onChange={handleInputChange}
            />
            <span> of {numPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === numPages}>
              Next
            </button>
            <button onClick={handleScreenshot}>Take Screenshot</button>
          </>
        )}
      </div>
      <div className="pdf-viewer-container">
        <div className="pdf-content" ref={pdfContainerRef}>
          <Document file={pdfUrl} onLoadSuccess={handleLoadSuccess}>
            <Page pageNumber={currentPage} />
          </Document>
        </div>
        {imageModalVisible && (
          <div className="screenshot-modal">
            <Cropper
              ref={cropperRef}
              src={screenshotImage}
              style={{ height: '95%', width: '100%' }}
              aspectRatio={pdfContainerRef.current.clientWidth / pdfContainerRef.current.clientHeight}
              guides={true}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default PdfViewer;
