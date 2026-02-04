import { useEffect, useRef } from 'react'
import { Editor } from '@tiptap/react'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'

interface UseEditorDictationReturn {
    isListening: boolean
    isSupported: boolean
    toggleDictation: () => void
    error: string | null
}

export function useEditorDictation(
    editor: Editor | null,
    showNotification: (type: 'success' | 'error', message: string) => void
): UseEditorDictationReturn {
    const { isListening, transcript, startListening, stopListening, isSupported, error } = useSpeechRecognition()
    const prevTranscriptRef = useRef('')

    // Insert transcribed text into editor in real-time
    useEffect(() => {
        if (!editor || !transcript) return

        // Calculate the new text to insert (only the delta)
        const newText = transcript.slice(prevTranscriptRef.current.length)
        if (newText) {
            editor.commands.insertContent(newText)
            prevTranscriptRef.current = transcript
        }
    }, [transcript, editor])

    // Reset transcript ref when dictation starts
    useEffect(() => {
        if (isListening) {
            prevTranscriptRef.current = ''
            showNotification('success', 'Dictée activée (parlez maintenant)')
        }
    }, [isListening])

    // Handle Dictation Errors
    useEffect(() => {
        if (error) {
            let message = 'Erreur microphone'

            if (error === 'not-allowed') {
                if (typeof window !== 'undefined' && !window.isSecureContext) {
                    message = 'Microphone requis HTTPS. Veuillez utiliser une connexion sécurisée.'
                } else {
                    message = 'Accès au micro refusé. Cliquez sur 🔒 dans la barre d\'adresse pour autoriser.'
                }
            }
            if (error === 'no-speech') message = 'Aucune parole détectée. Parlez plus fort ou vérifiez votre micro.'
            if (error === 'network') message = 'Erreur réseau (requise pour le speech-to-text).'

            showNotification('error', message)
        }
    }, [error])

    const toggleDictation = () => {
        if (isListening) {
            stopListening()
        } else {
            startListening()
        }
    }

    return {
        isListening,
        isSupported,
        toggleDictation,
        error
    }
}
