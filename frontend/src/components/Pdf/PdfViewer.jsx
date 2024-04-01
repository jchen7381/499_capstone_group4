import React from 'react';

const PdfViewer = () => {
  const pdfUrl = 'http://localhost:5000/get_pdf/dummy.pdf';

  return (
    <div>
      <iframe
        title="PDF Viewer"
        src={pdfUrl}
        width="100%"
        height="1000px"
      />
    </div>
  );
};

export default PdfViewer;
