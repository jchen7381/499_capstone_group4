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
  const [pdfWidth, setPdfWidth] = useState(null);
  const [pdfHeight, setPdfHeight] = useState(null);
  const [scale, setScale] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [aiOutput, setAiOutput] = useState({ result: '' }); 

  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (pdfContainerRef.current) {
      const boundingRect = pdfContainerRef.current.getBoundingClientRect();
      setPdfWidth(boundingRect.width);
      setPdfHeight(boundingRect.height);
    }
  }, [pdfContainerRef.current]);

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
    const scale = 3;
    const options = {
      scale: scale,
    };
    html2canvas(pdfContentElement, options).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      setScreenshotImage(imgData);
      setImageModalVisible(true);
    });
  };

  const handleConfirm = () => {
    if (!selectedSubject) {
      alert("Please select a subject before sending to AI.");
      return;
    }

    setAiOutput({ result: 'Loading...' });
  
    if (cropperRef.current && cropperRef.current.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      if (croppedCanvas) {
        const croppedImage = croppedCanvas.toDataURL('image/png');
  
        const base64Image = croppedImage.replace(/^data:image\/(png|jpg);base64,/, '');
  
        const imageData = {
          image: base64Image,
          subject: selectedSubject
        };
  
        fetch('http://localhost:5000/process_subject', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(imageData)
        })
        .then(response => response.json())
        .then(data => {
          console.log('Response from backend:', data);
          setAiOutput(data); 
        })
        .catch(error => {
          console.error('Error uploading image:', error);
        });
      }
    }
    setImageModalVisible(false);
  };  
  
  const handleClose = () => {
    setImageModalVisible(false);
  };  

  const handleResize = () => {
    const boundingRect = pdfContainerRef.current.getBoundingClientRect();
    setPdfWidth(boundingRect.width);
    setPdfHeight(boundingRect.height);
    setScale(1);
  };

  const renderPdf = () => {
    if (!pdfWidth || !pdfHeight) return null;
    const scaleWidth = pdfWidth / 612;
    const scaleHeight = pdfHeight / 792;
    const computedScale = Math.min(scaleWidth, scaleHeight);
    if (computedScale !== scale) {
      setScale(computedScale);
    }
    return (
      <Document file={pdfUrl} onLoadSuccess={handleLoadSuccess}>
        <Page pageNumber={currentPage} width={612} scale={computedScale} />
      </Document>
    );
  };

  return (
    <>
      <div className="pdf-navigation">
        {imageModalVisible ? (
          <>
            <select onChange={(e) => setSelectedSubject(e.target.value)}>
              <option value="">Select Subject</option>
              <option value="Math">Math</option>
              <option value="CS">Computer Science</option>
              <option value="English">English</option>
              <option value="Other">Other</option>
            </select>
            <button onClick={handleConfirm}>Send to AI</button>
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
            <button onClick={handleScreenshot}>Snip</button>
          </>
        )}
      </div>
      <div className="pdf-viewer-container" ref={pdfContainerRef} onResize={handleResize}>
        <div className="pdf-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
          {renderPdf()}
        </div>
        {imageModalVisible && (
          <div className="screenshot-modal">
            <Cropper
              ref={cropperRef}
              src={screenshotImage}
              style={{ height: '100%', width: '100%' }}
              guides={true}
            />
          </div>
        )}
      </div>
      <div className="ai-output">
          <h3>AI Output</h3>
          <p>{aiOutput.result}</p>
      </div>
    </>
  );
};

export default PdfViewer;