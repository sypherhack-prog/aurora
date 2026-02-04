'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// TypeScript declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList
    resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string
    message: string
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    start(): void
    stop(): void
    abort(): void
    onresult: ((event: SpeechRecognitionEvent) => void) | null
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
    onend: (() => void) | null
    onstart: (() => void) | null
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition
        webkitSpeechRecognition: new () => SpeechRecognition
    }
}

interface UseSpeechRecognitionReturn {
    isListening: boolean
    transcript: string
    lastFinalTranscript: string
    interimText: string
    startListening: () => void
    stopListening: () => void
    isSupported: boolean
    error: string | null
}

export function useSpeechRecognition(lang: string = 'fr-FR'): UseSpeechRecognitionReturn {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [lastFinalTranscript, setLastFinalTranscript] = useState('')
    const [interimText, setInterimText] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isSupported, setIsSupported] = useState(false)

    const recognitionRef = useRef<SpeechRecognition | null>(null)
    const finalTranscriptRef = useRef('')

    // Check browser support on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
            setIsSupported(!!SpeechRecognitionAPI)
        }
    }, [])

    // Handle recognition lifecycle
    useEffect(() => {
        // Skip on server-side
        if (typeof window === 'undefined') return

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition


        if (SpeechRecognitionAPI) {
            const recognition = new SpeechRecognitionAPI()
            recognition.continuous = true
            recognition.interimResults = true
            recognition.lang = lang

            recognition.onstart = () => {
                setIsListening(true)
                setError(null)
            }

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                let currentInterim = ''

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i]
                    if (result.isFinal) {
                        // Add final result to accumulated transcript
                        const newSegment = result[0].transcript.trim()
                        if (newSegment) {
                            finalTranscriptRef.current += ' ' + newSegment
                            setTranscript(finalTranscriptRef.current)
                            setLastFinalTranscript(newSegment)
                            setInterimText('')
                        }
                    } else {
                        currentInterim += result[0].transcript
                    }
                }

                // Update interim text for real-time feedback
                if (currentInterim) {
                    setInterimText(currentInterim)
                }
            }

            recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                setError(event.error)
                setIsListening(false)
            }

            recognition.onend = () => {
                setIsListening(false)
            }

            recognitionRef.current = recognition
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort()
            }
        }
    }, [lang])

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            setTranscript('')
            setLastFinalTranscript('')
            setInterimText('')
            finalTranscriptRef.current = ''
            setError(null)
            try {
                recognitionRef.current.start()
            } catch {
                // Already started, ignore
            }
        }
    }, [isListening])

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop()
        }
    }, [isListening])

    return {
        isListening,
        transcript,
        lastFinalTranscript,
        interimText,
        startListening,
        stopListening,
        isSupported,
        error,
    }
}
