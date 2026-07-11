import jsPDF from "jspdf"
import html2canvas from "html2canvas-pro"

type PdfExportOptions = {
  filename?: string
  orientation?: "portrait" | "landscape"
  format?: "a4" | "letter"
  marginMm?: number
  scale?: number
  backgroundColor?: string
}

export const exportElementToPdf = async (
  element: HTMLElement,
  filename: string,
  options: PdfExportOptions = {},
) => {
  const {
    orientation = "portrait",
    format = "a4",
    marginMm = 10,
    scale = 2,
    backgroundColor = "#ffffff",
  } = options

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    logging: false,
    backgroundColor,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  })

  const pdf = new jsPDF({
    orientation,
    unit: "mm",
    format,
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const usableWidth = pageWidth - marginMm * 2
  const usableHeight = pageHeight - marginMm * 2

  const imgHeightMm = (canvas.height * usableWidth) / canvas.width

  if (imgHeightMm <= usableHeight) {
    const imgData = canvas.toDataURL("image/png", 1.0)
    pdf.addImage(
      imgData,
      "PNG",
      marginMm,
      marginMm,
      usableWidth,
      imgHeightMm,
      undefined,
      "FAST",
    )
    pdf.save(filename)
    return
  }

  const pageHeightPx = Math.max(
    1,
    Math.floor((usableHeight * canvas.width) / usableWidth),
  )
  let offsetPx = 0
  let page = 0

  while (offsetPx < canvas.height) {
    const sliceHeightPx = Math.min(pageHeightPx, canvas.height - offsetPx)
    const pageCanvas = document.createElement("canvas")
    const pageCtx = pageCanvas.getContext("2d")

    pageCanvas.width = canvas.width
    pageCanvas.height = sliceHeightPx

    if (pageCtx) {
      pageCtx.fillStyle = backgroundColor
      pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height)
      pageCtx.drawImage(
        canvas,
        0,
        offsetPx,
        canvas.width,
        sliceHeightPx,
        0,
        0,
        canvas.width,
        sliceHeightPx,
      )

      const pageImgData = pageCanvas.toDataURL("image/png", 1.0)
      const sliceHeightMm = (sliceHeightPx * usableWidth) / canvas.width

      if (page > 0) {
        pdf.addPage()
      }

      pdf.addImage(
        pageImgData,
        "PNG",
        marginMm,
        marginMm,
        usableWidth,
        sliceHeightMm,
        undefined,
        "FAST",
      )
    }

    offsetPx += sliceHeightPx
    page += 1
  }

  pdf.save(filename)
}
