import React from 'react';
import Pdf from 'react-native-pdf';

export default function PdfViewer({ source, page, onPageChanged, onError, pdfRef }) {
  return (
    <Pdf
      ref={pdfRef}
      source={source}
      page={page}
      style={{ flex: 1 }}
      horizontal
      enablePaging
      enableRTL
      onPageChanged={onPageChanged}
      onError={onError}
    />
  );
}
