
let pdfjsLibPromise;
if (typeof window !== 'undefined') {
  // Dynamically import the ES module for pdfjs-dist v5+
  pdfjsLibPromise = import('pdfjs-dist/build/pdf.mjs');
}


export async function extractPdfText(arrayBuffer) {
  try {
    if (!pdfjsLibPromise) {
      throw new Error('pdfjs-dist is only available in the browser environment.');
    }
    const pdfjsLib = await pdfjsLibPromise;
    // Set workerSrc to local file for maximum reliability in production
    if (pdfjsLib.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.js';
    }
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
