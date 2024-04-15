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
  const pdfUrl = 'http://127.0.0.1:5000/get_pdf/lecture_slip_cs499_2024_3_11.pdf';
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
  const [aiOutput, setAiOutput] = useState({ result: '', image: '' });
  const [processing, setProcessing] = useState(false);
  const [originalImage, setOriginalImage] = useState('');
  const [originalSubject, setOriginalSubject] = useState('');

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

  useEffect(() => {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const boundingRect = pdfContainerRef.current.getBoundingClientRect();
          setPdfWidth(boundingRect.width);
          setPdfHeight(boundingRect.height);
          setScale(1);
        }
      });
    });

    const config = { attributes: true, attributeFilter: ['style'] };
    if (pdfContainerRef.current) {
      observer.observe(pdfContainerRef.current, config);
    }

    return () => observer.disconnect(); 
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
      willReadFrequently: true
    };

    options.willReadFrequently = true;

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

    if (cropperRef.current && cropperRef.current.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      if (croppedCanvas) {
        const croppedImage = croppedCanvas.toDataURL('image/png');
        setAiOutput({ result: 'Processing...', image: croppedImage });
        setProcessing(true);
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
          setAiOutput({ result: data.result, image: croppedImage });
          setProcessing(false);
          setSelectedSubject('');
          setOriginalImage(croppedImage);
          setOriginalSubject(selectedSubject);
        })
        .catch(error => {
          console.error('Error uploading image:', error);
          setProcessing(false);
          setSelectedSubject('');
        });
      }
    }
    setImageModalVisible(false);
  };

  const handleClose = () => {
    setImageModalVisible(false);
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

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(aiOutput.result)
      .then(() => {
        alert('AI output copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy AI output: ', err);
      });
  };

  const handleRegenerate = () => {
    if (originalImage && originalSubject) {
      setAiOutput({ result: 'Processing...', image: originalImage });
      setProcessing(true);

      setTimeout(() => {
        const base64Image = originalImage.replace(/^data:image\/(png|jpg);base64,/, '');
        const imageData = {
          image: base64Image,
          subject: originalSubject
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
          setAiOutput({ result: data.result, image: originalImage });
          setProcessing(false);
        })
        .catch(error => {
          console.error('Error re-running AI processing:', error);
          setProcessing(false);
        });
      }, 2000);
    }
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
            <button onClick={handleConfirm} disabled={processing}>Send to AI</button>
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
      <div className="pdf-viewer-container" ref={pdfContainerRef}>
        <div className="pdf-content">
          {renderPdf()}
        </div>
        {imageModalVisible && (
          <div className="screenshot-modal">
            <Cropper
              ref={cropperRef}
              src={screenshotImage}
              guides={true}
            />
          </div>
        )}
      </div>
      <div className="outputs">
        <div className="snipped-image-preview">
          <h3 className="output-header">Snipped Image Preview</h3>
          {aiOutput.image && <img src={aiOutput.image} alt="Snipped" style={{ maxWidth: '100%', maxHeight: '100%' }} />}
        </div>
        <div className="ai-output">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="output-header">AI Output</h3>
            <div>
              <button onClick={handleCopyToClipboard}>Copy to Clipboard</button>
              <button onClick={handleRegenerate}>Regenerate</button>
            </div>
          </div>
          <div className="ai-output-text">
            {aiOutput.result.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PdfViewer;