"use client";

/**
 * Paper a clinic can set a printer up for.
 *
 * `continuous` marks a receipt roll: the paper has a width but no page
 * length, so the PDF page is cut to whatever the invoice actually needs
 * instead of being padded out to a sheet. Sheet sizes keep a real page
 * height and spill onto a second page when an invoice is long.
 */
const PAPER: Record<
  string,
  { width: number; height: number; margin: number; continuous?: boolean }
> = {
  a4: { width: 595.28, height: 841.89, margin: 24 },
  a5: { width: 419.53, height: 595.28, margin: 18 },
  thermal_80: { width: 226.77, height: 0, margin: 8, continuous: true },
  thermal_58: { width: 164.41, height: 0, margin: 6, continuous: true },
};

/**
 * Renders the on-screen invoice sheet to a PDF and saves it under the
 * invoice's own name — sidesteps the OS print dialog entirely, since
 * "Microsoft Print to PDF" (the Windows system printer, as opposed to
 * Chrome/Edge's own "Save as PDF" destination) ignores the page title and
 * always prompts for a filename regardless of what document.title says.
 *
 * `paperSize` comes from the clinic's chosen printer; an unknown value falls
 * back to the 80mm roll rather than failing, since a saved template could
 * name a size this build no longer knows about.
 */
export async function downloadInvoicePdf(
  filename: string,
  paperSize = "thermal_80",
): Promise<void> {
  const element = document.getElementById("invoice-sheet");
  if (!element) throw new Error("Could not find the invoice to export.");

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas-pro"),
    import("jspdf"),
  ]);

  // Rendered against the page's own background so a dark-theme viewer still
  // gets a normal white receipt — that's what the printed original assumes.
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");
  const paper = PAPER[paperSize] ?? PAPER.thermal_80;
  const { width: pageWidth, margin } = paper;

  const contentWidth = pageWidth - margin * 2;
  const imgHeight = (canvas.height * contentWidth) / canvas.width;

  // A roll has no page length, so the page becomes exactly as long as the
  // receipt — one continuous slip, which is what comes out of the printer.
  const pageHeight = paper.continuous
    ? imgHeight + margin * 2
    : paper.height;

  const pdf = new jsPDF({ unit: "pt", format: [pageWidth, pageHeight] });

  pdf.addImage(imgData, "PNG", margin, margin, contentWidth, imgHeight);

  // Only sheet sizes can overflow; a continuous page was cut to fit above.
  if (!paper.continuous) {
    const usable = pageHeight - margin * 2;
    let heightLeft = imgHeight - usable;
    while (heightLeft > 0) {
      pdf.addPage();
      pdf.addImage(
        imgData,
        "PNG",
        margin,
        margin - (imgHeight - heightLeft),
        contentWidth,
        imgHeight,
      );
      heightLeft -= usable;
    }
  }

  pdf.save(`${filename}.pdf`);
}

/** Strips characters Windows and macOS both refuse in a filename. */
export function sanitizeFilename(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, "-").trim();
}
