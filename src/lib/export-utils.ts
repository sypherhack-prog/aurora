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

    // Create a container that is definitely visible on top of everything
    // This solves issues where hidden/off-screen elements aren't rendered by html2canvas
    const container = document.createElement('div')
    container.style.position = 'fixed'
    container.style.top = '0'
    container.style.left = '0'
    container.style.width = '100%'
    container.style.height = '100vh'
    container.style.zIndex = '99999' // Topmost
    container.style.backgroundColor = '#ffffff' // White background
    container.style.overflowY = 'auto' // Allow full content to be rendered
    container.style.padding = '40px'
    container.style.display = 'flex'
    container.style.justifyContent = 'center'

    // Clone the element
    const clone = element.cloneNode(true) as HTMLElement

    // Force Light Mode & Reset Styles
    clone.classList.remove('prose-invert')
    clone.classList.add('prose') // Use standard prose

    // Create explicit styles for clean PDF export
    const style = document.createElement('style')
    style.textContent = `
            .pdf-export-content,
            .pdf-export-content * {
                color: #000000 !important;
                -webkit-text-fill-color: #000000 !important;
            }
            .pdf-export-content {
                background-color: #ffffff !important;
                font-family: Arial, sans-serif !important;
            }
            .pdf-export-content h1, .pdf-export-content h2, .pdf-export-content h3,
            .pdf-export-content h4, .pdf-export-content h5, .pdf-export-content h6 {
                color: #000000 !important;
                background: none !important;
                -webkit-text-fill-color: #000000 !important;
            }
            .pdf-export-content p, .pdf-export-content li, .pdf-export-content span,
            .pdf-export-content strong, .pdf-export-content b, .pdf-export-content em,
            .pdf-export-content a, .pdf-export-content u, .pdf-export-content mark {
                color: #000000 !important;
                -webkit-text-fill-color: #000000 !important;
                background: transparent !important;
            }
            .pdf-export-content table {
                border-collapse: collapse !important;
                width: 100% !important;
                border: 1px solid #000000 !important;
            }
            .pdf-export-content th {
                background-color: #e8f5e9 !important; /* Light green header */
                color: #000000 !important;
                border: 1px solid #000000 !important;
                font-weight: bold !important;
                text-align: center !important;
                padding: 8px !important;
            }
            .pdf-export-content td {
                border: 1px solid #000000 !important;
                padding: 8px !important;
                color: #000000 !important;
                background-color: #ffffff !important;
            }
            .pdf-export-content tr:nth-child(even) td {
                background-color: #f9f9f9 !important;
            }
        `
    container.appendChild(style)
    clone.classList.add('pdf-export-content')

    // Force ALL elements to black text - critical for colored/white text
    const allElements = clone.querySelectorAll('*')
    allElements.forEach((el) => {
        if (el instanceof HTMLElement) {
            // Strip all tailwind color classes that might interfere
            el.className = el.className
                .replace(/text-[a-z]+-\d+/g, '')
                .replace(/bg-[a-z]+-\d+/g, '')
                .replace(/text-white/g, '')
                .replace(/text-zinc-\d+/g, '')
                .replace(/text-cyan-\d+/g, '')
                .replace(/text-blue-\d+/g, '')

            // Force black text color directly via inline style
            el.style.color = '#000000'
            el.style.setProperty('-webkit-text-fill-color', '#000000', 'important')

            // Clear any background that might hide text
            if (el.tagName !== 'TH' && el.tagName !== 'TD') {
                el.style.backgroundColor = 'transparent'
            }

            // Explicitly clear gradient backgrounds from headings
            if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(el.tagName)) {
                el.style.background = 'none'
            }
        }
    })

    container.appendChild(clone)
    document.body.appendChild(container)

    const opt = {
        margin: [0.5, 0.5] as [number, number], // Top/Bot, Left/Right
        filename: filename,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            logging: true, // Enable logging for debug
            letterRendering: true,
            windowWidth: 1024,
            scrollY: 0
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
    }

    try {
        // Longer wait to ensure rendering
        // User will see a white screen briefly (flash), which acts as feedback
        await new Promise(resolve => setTimeout(resolve, 500))
        await html2pdf().set(opt).from(clone).save()
    } catch (e) {
        console.error('PDF Export Error:', e)
        throw e // Re-throw to be handled by caller
    } finally {
        if (document.body.contains(container)) {
            document.body.removeChild(container)
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
