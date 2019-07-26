const { drawImage, PDFDocumentFactory, PDFDocumentWriter } = require('pdf-lib');

exports.generatePDFFromPNGs = imgData => {
  const pdfDoc = PDFDocumentFactory.create();

  const addImageToPage = img => {
    const [imgRef, imgDim] = pdfDoc.embedPNG(img);
    const page = pdfDoc
      .createPage([imgDim.width, imgDim.height])
      .addImageObject('imgObj', imgRef);

    const pageContentStream = pdfDoc.createContentStream(
      drawImage('imgObj', {
        height: imgDim.height,
        width: imgDim.width,
        x: 0,
        y: 0,
      }),
    );
    page.addContentStreams(pdfDoc.register(pageContentStream));
    pdfDoc.addPage(page);
  };

  imgData.map(data => {
    addImageToPage(data);
  });

  const pdfBytes = PDFDocumentWriter.saveToBytes(pdfDoc, {
    useObjectStreams: false,
  });

  return pdfBytes;
};
