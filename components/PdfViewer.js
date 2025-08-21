import React, { useEffect, useRef } from 'react';
import { Platform, View } from 'react-native';
import Pdf from 'react-native-pdf';
import { WebView } from 'react-native-webview';

export default function PdfViewer({ source, page, onPageChanged, onError, pdfRef }) {
  const webviewRef = useRef(null);

  useEffect(() => {
    if (Platform.OS === 'web' && webviewRef.current && page) {
      webviewRef.current.postMessage(JSON.stringify({ type: 'goToPage', page }));
    }
  }, [page]);

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data?.type === 'pageChanged' && onPageChanged) {
        onPageChanged(data.page);
      }
    } catch (err) {
      console.error('WebView message error', err);
    }
  };

  if (Platform.OS === 'web') {
    return (
      <WebView
        ref={webviewRef}
        source={{ html: getPdfHtml(source.uri, page) }}
        style={{ flex: 1 }}
        onMessage={handleWebViewMessage}
        originWhitelist={['*']}
        allowFileAccess
        allowUniversalAccessFromFileURLs
      />
    );
  }

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

function getPdfHtml(url, startPage = 1) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>PDF Viewer</title>
        <style>
          html, body, #viewerContainer { margin: 0; padding: 0; height: 100%; overflow: hidden; }
        </style>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf_viewer.min.css" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf_viewer.min.js"></script>
      </head>
      <body>
        <div id="viewerContainer" class="pdfViewer singlePageView"></div>
        <script>
          const CMAP_URL = 'https://unpkg.com/pdfjs-dist@2.10.377/cmaps/';
          const CMAP_PACKED = true;

          const container = document.getElementById('viewerContainer');
          const eventBus = new pdfjsViewer.EventBus();
          const pdfLinkService = new pdfjsViewer.PDFLinkService({ eventBus });
          const pdfViewer = new pdfjsViewer.PDFViewer({ container, eventBus, linkService: pdfLinkService });
          pdfLinkService.setViewer(pdfViewer);

          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';

          fetch('${url}').then(res => res.arrayBuffer()).then(async data => {
            const pdf = await pdfjsLib.getDocument({ data, cMapUrl: CMAP_URL, cMapPacked: CMAP_PACKED }).promise;
            pdfViewer.setDocument(pdf);
            pdfLinkService.setDocument(pdf);
            pdfViewer.currentPageNumber = ${startPage};
          });

          window.addEventListener('message', (event) => {
            const msg = JSON.parse(event.data);
            if (msg.type === 'goToPage') {
              pdfViewer.currentPageNumber = msg.page;
            }
          });

          document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
              pdfViewer.currentPageNumber++;
            } else if (e.key === 'ArrowLeft') {
              pdfViewer.currentPageNumber--;
            }
          });

          eventBus.on('pagechanging', (e) => {
            window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'pageChanged', page: e.pageNumber }));
          });
        </script>
      </body>
    </html>
  `;
}
