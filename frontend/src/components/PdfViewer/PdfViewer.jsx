import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'; 
import 'react-pdf/dist/esm/Page/TextLayer.css'; 
import html2canvas from 'html2canvas'; 
import './PdfViewer.css'; 

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfViewer = () => {
  const pdfUrl = 'http://127.0.0.1:5000/get_pdf/beginners_python_cheat_sheet_pcc_all.pdf';
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState(1);
  const pdfContainerRef = useRef(null);

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

  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  const handleScreenshot = () => {
    html2canvas(pdfContainerRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'pdf_screenshot.png';
      link.href = imgData;
      link.click();
    });
  };

  return (
    <div className="pdf-viewer-container">
      <div className="pdf-navigation">
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
      </div>
      <div className="pdf-content" ref={pdfContainerRef}>
        <Document file={pdfUrl} onLoadSuccess={handleLoadSuccess}>
          <Page pageNumber={currentPage} />
        </Document>
      </div>
    </div>
  );
};

export default PdfViewer;
