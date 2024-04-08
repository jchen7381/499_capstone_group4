import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'; // Import AnnotationLayer CSS
import 'react-pdf/dist/esm/Page/TextLayer.css'; // Import TextLayer CSS

// Initialize PDF.js worker using the workerSrc property
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfViewer = () => {
  const pdfUrl = 'http://localhost:5000/get_pdf/beginners_python_cheat_sheet_pcc_all.pdf'; // Updated URL
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState(1);

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
      </div>
      <div className="pdf-content">
        <Document file={pdfUrl} onLoadSuccess={handleLoadSuccess}>
          <Page pageNumber={currentPage} />
        </Document>
      </div>
    </div>
  );
};

export default PdfViewer;
