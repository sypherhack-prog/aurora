/* eslint-disable @typescript-eslint/ban-ts-comment */

// Simple helper to estimate text height (very rough)
function estimateHeight(text: string, fontSize: number, widthInches: number): number {
    const charWidth = fontSize * 0.6 // Approximate width per char in points
    const charsPerLine = (widthInches * 72) / charWidth
    const lines = Math.ceil(text.length / charsPerLine)
    return (lines * fontSize * 1.2) / 72 // Height in inches
}

export const exportToPDF = async (element: HTMLElement, filename: string) => {
    // Dynamic import to ensure client-side execution
    // @ts-ignore
    const html2pdf = (await import('html2pdf.js')).default

    // Clone the element to manipulate styles for printing (Light Mode)
    const clone = element.cloneNode(true) as HTMLElement

    // Remove dark mode classes specifically
    clone.classList.remove('prose-invert')
    clone.classList.add('prose') // Force light mode typography

    // Reset styles for the clone to ensure black text on white background
    clone.style.width = '800px' // Fixed width for A4 consistency
    clone.style.padding = '40px'
    clone.style.backgroundColor = 'white'
    clone.style.color = 'black'
    clone.style.display = 'block' // Ensure it's visible

    // Force all children to use black text if they inherited white
    const allDescendants = clone.getElementsByTagName('*')
    for (let i = 0; i < allDescendants.length; i++) {
        const child = allDescendants[i] as HTMLElement
        // Strip text colors to fall back to black
        child.classList.remove('text-white', 'text-zinc-200', 'text-zinc-300', 'text-zinc-400')
        child.style.color = '#000000'

        // Ensure background is transparent or white
        if (getComputedStyle(child).backgroundColor !== 'rgba(0, 0, 0, 0)') {
            // Optional: could force white/transparent if needed, but keeping some bg is fine (like tables)
        }
    }

    // Position "visible" but hidden behind content
    clone.style.position = 'absolute'
    clone.style.left = '0'
    clone.style.top = '0'
    clone.style.zIndex = '-9999'
    document.body.appendChild(clone)

    const opt = {
        margin: 0.5,
        filename: filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            letterRendering: true,
            windowWidth: 800,
            scrollY: 0
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
    }

    try {
        // Small delay to ensure rendering
        await new Promise(resolve => setTimeout(resolve, 100))
        await html2pdf().set(opt).from(clone).save()
    } finally {
        if (document.body.contains(clone)) {
            document.body.removeChild(clone)
        }
    }
}

export const exportToPPTX = async (element: HTMLElement, filename: string) => {
    const PptxGenJS = (await import('pptxgenjs')).default
    const pptx = new PptxGenJS()
    pptx.layout = 'LAYOUT_16x9'
    pptx.author = 'Aurora AI'
    pptx.company = 'Aurora AI'
    pptx.title = filename.replace('.pptx', '')

    // Create Title Slide
    let slide = pptx.addSlide()

    // Basic Layout Constants
    const TYPE_AREA = { x: 0.5, y: 0.5, w: '90%', h: '85%' }
    let yPos = 0.5

    // Parse Content
    // We assume the element contains blocks like H1, H2, P, etc.
    const children = Array.from(element.children) as HTMLElement[]

    // If first element is H1, make it a Title Slide
    if (children.length > 0 && children[0].tagName === 'H1') {
        const title = children[0].textContent || ''
        slide.addText(title, {
            x: 0.5, y: 2.5, w: '90%', h: 1.5,
            fontSize: 44, bold: true, align: 'center', color: '363636'
        })
        yPos = 0.5
        children.shift() // Remove title from flow
        slide = pptx.addSlide() // Start content slide
    }

    for (const child of children) {
        const tagName = child.tagName.toLowerCase()
        const text = child.textContent || ''

        if (!text.trim() && tagName !== 'img') continue

        if (tagName === 'h1' || tagName === 'h2') {
            // New Slide for major sections if not at top
            if (yPos > 1.5) {
                slide = pptx.addSlide()
                yPos = 0.5
            }

            slide.addText(text, {
                x: 0.5, y: yPos, w: '90%', h: 1,
                fontSize: tagName === 'h1' ? 32 : 24,
                bold: true, color: '363636'
            })
            yPos += 1.0
        }
        else if (tagName === 'img') {
            const img = child as HTMLImageElement
            if (img.src) {
                if (yPos > 5) {
                    slide = pptx.addSlide()
                    yPos = 0.5
                }
                // Add Image
                // We need to handle scaling. For now, max width.
                slide.addImage({
                    path: img.src,
                    x: 0.5, y: yPos, w: 4, h: 3 // Fixed size for safety
                })
                yPos += 3.2
            }
        }
        else {
            // Paragraphs, lists, etc.
            const fontSize = 14
            const height = estimateHeight(text, fontSize, 9)

            if (yPos + height > 7.0) {
                slide = pptx.addSlide()
                yPos = 0.5
            }

            slide.addText(text, {
                x: 0.5, y: yPos, w: '90%', h: height,
                fontSize: fontSize, color: '666666', align: 'left'
            })
            yPos += height + 0.2
        }
    }

    await pptx.writeFile({ fileName: filename })
}
