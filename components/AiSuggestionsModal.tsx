import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { POE } from '../types';
import { XIcon, SparklesIcon } from './Icons';

interface AiSuggestionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    poe: POE;
}

const parseMarkdown = (text: string) => {
    if (!text) return { __html: '' };
    const html = text
        .replace(/</g, "&lt;").replace(/>/g, "&gt;") // Sanitize
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-1">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 mt-6 mb-2">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-3">$1</h1>')
        .replace(/^\* (.*$)/gim, '<li class="list-disc ml-6">$1</li>') // List items
        .replace(/(\n)/g, '<br />'); // New lines
        
    return { __html: html };
};


const AiSuggestionsModal: React.FC<AiSuggestionsModalProps> = ({ isOpen, onClose, poe }) => {
    const [suggestions, setSuggestions] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && poe) {
            const fetchSuggestions = async () => {
                setIsLoading(true);
                setError('');
                setSuggestions('');

                try {
                    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                    
                    const responsibilitiesText = poe.responsibilities
                        .map(r => `- Cargo: ${r.cargo}\n  Responsabilidad: ${r.responsabilidad}`)
                        .join('\n');

                    const prompt = `
Eres un auditor experto especializado en Procedimientos Operativos Estandarizados (POE) para entornos industriales y de procesamiento de alimentos. Tu tarea es analizar el siguiente POE y proporcionar comentarios constructivos para mejorar su calidad, seguridad y claridad.

Analiza el POE que se proporciona a continuación y genera un informe con sugerencias. Estructura tu informe con las siguientes secciones:

1.  **Claridad y Concisión:** Evalúa si el lenguaje es simple, directo y sin ambigüedades para un operador. Sugiere reformulaciones donde sea necesario.
2.  **Completitud:** Verifica si toda la información necesaria está presente. ¿Son lógicos los pasos? ¿Están bien definidos los materiales, el equipo de seguridad (EPI) y las frecuencias? ¿Son claros los métodos de verificación y las acciones correctivas?
3.  **Seguridad y EPI:** Evalúa la idoneidad de las instrucciones de seguridad. ¿Se identifican los peligros potenciales? ¿Son los equipos de protección personal (EPI) especificados apropiados para las tareas descritas?
4.  **Consistencia:** Verifica que la información sea coherente en todo el documento (por ejemplo, que los materiales mencionados se utilicen en los pasos).
5.  **Puntos de Mejora y Riesgos Potenciales:** Identifica cualquier paso o instrucción que pueda ser una fuente de error o riesgo, y sugiere mejoras específicas.
6.  **Resumen General:** Proporciona un breve resumen general de la calidad del POE y una recomendación final (por ejemplo, "Listo para aprobación con cambios menores", "Requiere una revisión significativa").

Aquí está el POE para analizar:
---
Título: ${poe.title}
Código: ${poe.code}
Objetivo: ${poe.objective}
Alcance: ${poe.scope}
Responsabilidades:
${responsibilitiesText}
Frecuencia: ${Array.isArray(poe.frequency) ? poe.frequency.join(', ') : poe.frequency}
Productos y Materiales: ${poe.productsAndMaterials}
Instrucciones de Seguridad y EPI: ${poe.safetyInstructions}
Descripción: ${poe.description}
Pasos:
${poe.steps.map((step, index) => `${index + 1}. ${step.name}: ${step.text}`).join('\n')}
Verificación y Registro: ${poe.verification}
Acciones Correctivas: ${poe.correctiveActions}
---
Por favor, proporciona tu análisis en formato Markdown.
                    `;

                    const response = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: prompt,
                    });

                    setSuggestions(response.text);

                } catch (e) {
                    console.error(e);
                    setError('No se pudieron generar las sugerencias. Por favor, intente de nuevo más tarde.');
                } finally {
                    setIsLoading(false);
                }
            };

            fetchSuggestions();
        }
    }, [isOpen, poe]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10 px-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-lg z-10">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-full">
                           <SparklesIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">Sugerencias de IA para "{poe.title}"</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <XIcon />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {isLoading && (
                         <div className="flex flex-col items-center justify-center h-64">
                            <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="mt-4 text-gray-600">Analizando el POE, por favor espere...</p>
                        </div>
                    )}
                    {error && (
                        <div className="text-center text-red-600 bg-red-50 p-4 rounded-md">
                            <p><strong>Error:</strong> {error}</p>
                        </div>
                    )}
                    {suggestions && (
                        <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={parseMarkdown(suggestions)} />
                    )}
                </div>
                <div className="p-4 border-t flex justify-end sticky bottom-0 bg-white rounded-b-lg z-10">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default AiSuggestionsModal;