export async function downloadFile(fileUrl, fileName) {
  try {
    let path = fileUrl;
    const match = fileUrl.match(/\/object\/public\/(documents\/[^?]+)/);
    if (match && match[1]) {
      path = match[1];
    }
    if (!path.startsWith('documents/')) {
      path = 'documents/' + path;
    }
    const response = await fetch(`/api/documents/download-documents?path=${encodeURIComponent(path)}`);
    if (!response.ok) throw new Error('Download failed');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'downloaded-file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    alert('Failed to download file: ' + error.message);
  }
}
