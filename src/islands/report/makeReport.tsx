import type { ReportInput } from './content';

// Builds the report in the browser. The PDF library is big, so it isn't part
// of the page: loadReport() fetches it in the background once the check-in
// starts. By the results it is in memory, so asking for the report works even
// if the site was redeployed meanwhile (a deploy renames these files).
type Modules = [typeof import('@react-pdf/renderer'), typeof import('./ReportDoc')];
let loading: Promise<Modules> | null = null;

export function loadReport(): Promise<Modules> {
  loading ??= Promise.all([import('@react-pdf/renderer'), import('./ReportDoc')]).catch((err) => {
    loading = null;
    throw err;
  });
  return loading;
}

export async function makeReport(input: Omit<ReportInput, 'base'>): Promise<Blob> {
  const [{ pdf }, doc] = await loadReport();
  const base = new URL('/report/', location.href).href;
  doc.registerFonts(base);
  const ReportDoc = doc.default;
  return pdf(<ReportDoc d={{ ...input, base }} />).toBlob();
}

export const reportFileName = (name: string) =>
  `Fulfilment Report - ${name.replace(/[^\p{L}\p{N} .'-]/gu, '').trim() || 'You'}.pdf`;

export function saveFile(url: string, fileName: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
