import React from 'react';

export default function PdfViewer({ source }) {
  return (
    <iframe
      src={source?.uri}
      title="PDF Viewer"
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  );
}
