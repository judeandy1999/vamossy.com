let pdfjsLib;
if (typeof window !== 'undefined') {
  pdfjsLib = require('pdfjs-dist/build/pdf');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.js';
}

export async function extractPdfText(arrayBuffer) {
  try {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ') + '\n';
      } catch (pageErr) {
        console.error(`Error extracting text from page ${i}:`, pageErr);
      }
    }
    if (!text || text.trim().length === 0) {
      throw new Error('No text extracted from PDF. The file may be image-based or encrypted.');
    }
    return text.trim();
  } catch (err) {
    console.error('PDF extraction error:', err);
    throw new Error('Failed to extract text from PDF. The file may be invalid, encrypted, or image-based.');
  }
}
