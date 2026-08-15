/**
 * Utility helper to generate sample valid PDF Data URIs for pre-seeded assignments,
 * and to convert uploaded File objects to persistent Data URLs / Blob URLs.
 */

// UTF-8 safe base64 encoding helper
function utf8ToBase64(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
}

// Generate a valid minimal PDF binary as Base64 string for demo assignments
export function createSamplePdfDataUri(title: string, subjectName: string, date: string): string {
  // Clean non-ASCII characters for minimal PDF raw stream
  const safeTitle = title.replace(/[^\x00-\x7F]/g, '-');
  const safeSubject = subjectName.replace(/[^\x00-\x7F]/g, '-');

  const contentText = `%PDF-1.4
1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj
2 0 obj
<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>
endobj
3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /Resources <<
    /Font <<
      /F1 4 0 R
    >>
  >>
  /MediaBox [0 0 612 792]
  /Contents 5 0 R
>>
endobj
4 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica-Bold
>>
endobj
5 0 obj
<< /Length 260 >>
stream
BT
/F1 24 Tf
50 720 Td
(ASSIGNMENT HUB - ${safeSubject.toUpperCase()}) Tj
/F1 16 Tf
0 -40 Td
(${safeTitle}) Tj
/F1 12 Tf
0 -30 Td
(Date Added: ${date}) Tj
0 -30 Td
(This is an official original assignment document for ${safeSubject}.) Tj
0 -20 Td
(Please complete all questions and submit according to course guidelines.) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000262 00000 n 
0000000345 00000 n 
trailer
<<
  /Size 6
  /Root 1 0 R
>>
startxref
658
%%EOF`;

  const base64 = utf8ToBase64(contentText);
  return `data:application/pdf;base64,${base64}`;
}

export function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 KB';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
