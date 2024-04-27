import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import html2canvas from 'html2canvas';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import './PdfViewer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfViewer = ({url, resetInterface}) => {
	const pdfUrl = url;
	const [numPages, setNumPages] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [inputPage, setInputPage] = useState(1);
	const pdfContainerRef = useRef(null);
	const [imageModalVisible, setImageModalVisible] = useState(false);
	const [previewImageVisible, setPreviewImageVisible] = useState(false);
	const [screenshotImage, setScreenshotImage] = useState('');
	const [enlargedImage, setEnlargedImage] = useState('');
	const cropperRef = useRef(null);
	const [pdfWidth, setPdfWidth] = useState(null);
	const [pdfHeight, setPdfHeight] = useState(null);
	const [scale, setScale] = useState(1);
	const [selectedSubject, setSelectedSubject] = useState('');
	const [aiOutput, setAiOutput] = useState({ result: '', image: '' });
	const [processing, setProcessing] = useState(false);
	const [originalImage, setOriginalImage] = useState('');
	const [originalSubject, setOriginalSubject] = useState('');
	const [customQuery, setCustomQuery] = useState('');
	const [originalCustomQuery, setOriginalCustomQuery] = useState('');

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

	// Go to previous page
	const handlePreviousPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	// Go to next page
	const handleNextPage = () => {
		if (currentPage < numPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	// Page limiter (cant go to non-existent pages)
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

	// Function for getting a screenshot of the PDF content (after clicking on Snip)
	const handleScreenshot = () => {
		const pdfContentElement = pdfContainerRef.current;
		const scale = 3;
		const options = {
			scale: scale,
			willReadFrequently: true
		};

		options.willReadFrequently = true;

		html2canvas(pdfContentElement, options).then((canvas) => {
			canvas.getContext('2d').willReadFrequently = true;
			const imgData = canvas.toDataURL('image/png');
			setScreenshotImage(imgData);
			setImageModalVisible(true);
		});
	};

	// Function for opening enlarged preview image modal
	const handlePreviewImageClick = (image) => {
		setEnlargedImage(image);
		setPreviewImageVisible(true);
	};

	// Function for closing enlarged preview image modal
	const handleClosePreviewImage = () => {
		setPreviewImageVisible(false);
	};

	// Function for sending to backend (after clicking on Send to AI)
	const handleSend = () => {
		if (selectedSubject === "Custom" && !customQuery) {
			alert("Please enter your query.");
			return;
		}

		if (!selectedSubject && selectedSubject !== "Custom") {
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
					subject: selectedSubject,
					customQuery: selectedSubject === "Custom" ? customQuery : null
				};

				fetch('http://127.0.0.1:5000/process', {
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
					setCustomQuery('');
					if (selectedSubject === "Custom") {
						setOriginalCustomQuery(customQuery);
					}
				})
				.catch(error => {
					console.error('Error uploading image:', error);
					setProcessing(false);
					setSelectedSubject('');
					setCustomQuery('');
				});
			}
		}
		setImageModalVisible(false);
	};

	// Close Snip
	const handleCloseSnip = () => {
		setImageModalVisible(false);
	};

	// Close PDF
	const handleClosePDF = () => {
		resetInterface();
	};

	// Render the PDF
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

	// Function for copying to clipboard (or ctrl-c/cmd-c)
	const handleCopyToClipboard = () => {
		navigator.clipboard.writeText(aiOutput.result)
		.then(() => {
			alert('AI output copied to clipboard!');
		})
		.catch(err => {
			console.error('Failed to copy AI output: ', err);
		});
	};

	// Function for regenerating output
	const handleRegenerate = () => {
		if (originalImage && (originalSubject || customQuery)) {
			setAiOutput({ result: 'Processing...', image: originalImage });
			setProcessing(true);
		
			setTimeout(() => {
				const base64Image = originalImage.replace(/^data:image\/(png|jpg);base64,/, '');
				const imageData = {
					image: base64Image,
					subject: originalSubject,
					customQuery: originalSubject === "Custom" ? originalCustomQuery : null
				};
		
				fetch('http://127.0.0.1:5000/process', {
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
		<div>
		<div className="pdf-navbar">
			{imageModalVisible ? (
			<>
				<select className='dropdown-box' onChange={(e) => setSelectedSubject(e.target.value)}>
					<option className='dropdown-box' value="">Select Subject</option>
					<option className='dropdown-box' value="Math">Math</option>
					<option className='dropdown-box' value="CS">Computer Science</option>
					<option className='dropdown-box' value="English">English</option>
					<option className='dropdown-box' value="Other">Other</option>
					<option className='dropdown-box' value="Custom">Custom</option>
				</select>
				{selectedSubject === "Custom" && (
					<input className='input-box'
						type="text"
						placeholder="Enter your query"
						value={customQuery}
						onChange={(e) => setCustomQuery(e.target.value)}
					/>
				)}
				<button onClick={handleSend} disabled={processing}>Send to AI</button>
				<button onClick={handleCloseSnip}>Close Snip</button>
			</>
			) : (
			<>
				<button onClick={handlePreviousPage} disabled={currentPage === 1}>
					Previous
				</button>
				<span>Page </span>
				<input className='input-box'
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
				<button onClick={handleClosePDF}>Close PDF</button>
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
			<div className="snip-preview">
				<h3 className="output-header">Snip Preview</h3>
				{aiOutput.image && 
					<img 
					src={aiOutput.image} 
					alt="Snipped" 
					style={{ maxWidth: '100%', maxHeight: '100%' }} 
					onClick={() => handlePreviewImageClick(aiOutput.image)} 
					/>
				}
			</div>
			<div className="ai-output">
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<h3 className="ai-output-header">AI Output</h3>
					<div>
						<button onClick={handleCopyToClipboard}>Copy to Clipboard</button>
						<button onClick={handleRegenerate}>Regenerate Output</button>
					</div>
				</div>
				<div className="ai-output-text">
					{aiOutput.result.split('\n').map((paragraph, index) => (
						<p key={index}>{paragraph}</p>
					))}
				</div>
			</div>
		</div>
		{previewImageVisible && (
			<div className="preview-image-modal" onClick={handleClosePreviewImage}>
				<img src={enlargedImage} alt="Enlarged Preview" />
			</div>
		)}
		</div>
	);
};

export default PdfViewer;