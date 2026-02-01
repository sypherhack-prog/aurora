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

    // Explicit styles for the document content
    clone.style.width = '800px' // A4 width approx
    clone.style.maxWidth = '100%'
    clone.style.margin = '0 auto' // Center
    clone.style.color = '#000000'
    clone.style.backgroundColor = '#ffffff'
    clone.style.display = 'block'

    // Aggressive clean-up of children
    const allDescendants = clone.getElementsByTagName('*')
    for (let i = 0; i < allDescendants.length; i++) {
        const child = allDescendants[i] as HTMLElement
        // Strip dark mode color classes
        child.classList.remove(
            'text-white', 'text-zinc-50', 'text-zinc-100', 'text-zinc-200', 'text-zinc-300', 'text-zinc-400', 'text-zinc-500',
            'bg-zinc-800', 'bg-zinc-900', 'bg-zinc-950', 'bg-black'
        )
        // Force text color
        child.style.color = '#000000'

        // Handle backgrounds - mainly keep transparent or white
        const bg = getComputedStyle(child).backgroundColor
        if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent' && bg !== 'rgb(255, 255, 255)') {
            child.style.backgroundColor = 'transparent' // Reset backgrounds to be safe, or set to white
        }
    }

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
