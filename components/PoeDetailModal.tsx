
import React, { useRef } from 'react';
import { POE } from '../types';
import { getStatusBadgeClass, getStatusText, formatDate } from '../utils/helpers';
import { XIcon, FilePdf } from './Icons';

interface PoeDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    poe: POE;
}

const PoeDetailModal: React.FC<PoeDetailModalProps> = ({ isOpen, onClose, poe }) => {
    const scrollableContentRef = useRef<HTMLDivElement>(null);

    const exportToPDF = async () => {
        const { jsPDF } = (window as any).jspdf;
        const html2canvas = (window as any).html2canvas;

        const contentToCapture = scrollableContentRef.current;
        if (!contentToCapture || !html2canvas || !jsPDF) {
            alert("No se pudo encontrar el contenido o las librerías para exportar.");
            return;
        }

        const footer = contentToCapture.parentElement?.querySelector('.p-4.border-t') as HTMLElement | null;
        if (footer) {
            footer.style.display = 'none';
        }
        
        contentToCapture.scrollTop = 0;

        const poeTitle = poe.title.replace(/[\s/]+/g, '_');
        const filename = `${poeTitle}.pdf`;

        try {
            const canvas = await html2canvas(contentToCapture, {
                scale: 2,
                useCORS: true,
                logging: false,
                width: contentToCapture.scrollWidth,
                height: contentToCapture.scrollHeight,
                windowWidth: contentToCapture.scrollWidth,
                windowHeight: contentToCapture.scrollHeight,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const margin = 15;
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const usableWidth = pdfWidth - (margin * 2);
            const usableHeight = pdfHeight - (margin * 2);

            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const aspectRatio = canvasHeight / canvasWidth;
            
            const imgWidth = usableWidth;
            const imgHeight = imgWidth * aspectRatio;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
            heightLeft -= usableHeight;

            while (heightLeft > 0) {
                position -= usableHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', margin, position + margin, imgWidth, imgHeight);
                heightLeft -= usableHeight;
            }

            pdf.save(filename);

        } catch (err) {
            console.error("Error exporting to PDF:", err);
            alert("Hubo un error al generar el PDF.");
        } finally {
            if (footer) {
                footer.style.display = 'flex';
            }
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10 px-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-lg z-10">
                    <h2 className="text-xl font-semibold text-gray-800">Detalles del POE</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <XIcon />
                    </button>
                </div>
                <div ref={scrollableContentRef} className="p-6 overflow-y-auto">
                    <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white p-6 rounded-lg mb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-semibold opacity-80">{poe.code}</p>
                                <h3 className="text-2xl font-bold">{poe.title}</h3>
                                <span className="inline-block bg-yellow-500 text-white px-3 py-1 text-sm font-semibold rounded-full mt-2">{poe.establishment}</span>
                            </div>
                            <div className="text-right flex-shrink-0 ml-4">
                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeClass(poe.status)}`}>{getStatusText(poe.status)}</span>
                                <p className="mt-2">Versión: {poe.version}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p><strong>Área de Aplicación:</strong> {poe.applicationArea}</p>
                            <p><strong>Responsable:</strong> {poe.responsible}</p>
                            <p><strong>Frecuencia:</strong> {poe.frequency}</p>
                        </div>
                        <div>
                            <p><strong>Creado por:</strong> {poe.createdBy}</p>
                            <p><strong>Fecha creación:</strong> {formatDate(poe.createdAt)}</p>
                            {poe.approvedBy && <p><strong>Aprobado por:</strong> {poe.approvedBy} el {formatDate(poe.approvedAt)}</p>}
                        </div>
                    </div>
                    <div className="mb-4">
                        <h4 className="font-semibold text-gray-700">Objetivo</h4>
                        <p className="text-gray-600">{poe.objective}</p>
                    </div>
                     <div className="mb-4">
                        <h4 className="font-semibold text-gray-700">Alcance</h4>
                        <p className="text-gray-600">{poe.scope}</p>
                    </div>
                    <div className="mb-4">
                        <h4 className="font-semibold text-gray-700">Productos y Materiales</h4>
                        <p className="text-gray-600 whitespace-pre-wrap">{poe.productsAndMaterials}</p>
                    </div>
                    <div className="mb-4">
                        <h4 className="font-semibold text-gray-700">Descripción</h4>
                        <p className="text-gray-600">{poe.description}</p>
                    </div>
                    <div className="mb-4">
                        <h4 className="font-semibold text-gray-700">Instrucciones de Seguridad y EPI</h4>
                        <p className="text-gray-600 whitespace-pre-wrap">{poe.safetyInstructions}</p>
                    </div>
                    
                    <h4 className="font-semibold text-gray-700 mt-6 mb-2">Pasos del Procedimiento</h4>
                    <div className="space-y-3">
                        {poe.steps.map(step => (
                            <div key={step.id} className="p-4 border rounded-md border-l-4 border-sky-500 bg-white">
                                <h5 className="font-semibold">Paso {step.id}: {step.name}</h5>
                                <p className="text-sm text-gray-600 mt-1">{step.text}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 border-t pt-4">
                        <div className="mb-4">
                            <h4 className="font-semibold text-gray-700">Verificación y Registro</h4>
                            <p className="text-gray-600 whitespace-pre-wrap">{poe.verification}</p>
                        </div>
                        <div className="mb-4">
                            <h4 className="font-semibold text-gray-700">Acciones Correctivas</h4>
                            <p className="text-gray-600 whitespace-pre-wrap">{poe.correctiveActions}</p>
                        </div>
                    </div>

                </div>
                <div className="p-4 border-t flex justify-end space-x-2 sticky bottom-0 bg-white rounded-b-lg z-10">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cerrar</button>
                    <button onClick={exportToPDF} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700">
                        <FilePdf className="w-4 h-4 mr-2" /> Exportar a PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PoeDetailModal;