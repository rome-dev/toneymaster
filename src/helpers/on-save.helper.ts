import XLSX from 'xlsx';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

const stringToArrayBuffer = (str: string) => {
  const buffer = new ArrayBuffer(str.length);
  const view = new Uint8Array(buffer);

  for (var i = 0; i < str.length; i++) {
    view[i] = str.charCodeAt(i) & 0xff;
  }

  return buffer;
};

const onXLSXSave = <T, Y>(headers: T[], body: Y[][], title: string) => {
  const wsData = [headers, ...body];
  const wb = XLSX.utils.book_new();
  wb.Props = { CreatedDate: new Date(2017, 12, 19) };
  wb.SheetNames.push(title);

  let ws = XLSX.utils.aoa_to_sheet(wsData);

  wb.Sheets[title] = ws;

  const wbout = XLSX.write(wb, {
    bookType: 'xlsx',
    type: 'binary',
  });

  saveAs(
    new Blob([stringToArrayBuffer(wbout)], {
      type: 'application/octet-stream',
    }),
    `${title}.xlsx`
  );
};

const onPDFSave = (PDFComponent: JSX.Element, title: string) => {
  return Promise.resolve(pdf(PDFComponent).toBlob()).then(blob => {
    saveAs(blob as Blob, `${title}.pdf`);
  });
};

export { onXLSXSave, onPDFSave };
