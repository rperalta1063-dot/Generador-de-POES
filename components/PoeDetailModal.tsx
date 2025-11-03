import React from 'react';
import { POE } from '../types';
import { getStatusBadgeClass, getStatusText, formatDate } from '../utils/helpers';
import { XIcon, FilePdf, JsonIcon } from './Icons';

interface PoeDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    poe: POE;
}

const PoeDetailModal: React.FC<PoeDetailModalProps> = ({ isOpen, onClose, poe }) => {
    
    const exportToPDF = () => {
        const { jsPDF } = (window as any).jspdf;
        if (!jsPDF) {
            alert("La librería jsPDF no está cargada.");
            return;
        }

        const doc = new jsPDF('p', 'mm', 'a4');
        const margin = 15;
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();
        const usableWidth = pageWidth - margin * 2;
        let y = margin;

        const checkPageBreak = (spaceNeeded = 10) => {
            if (y + spaceNeeded > pageHeight - margin) {
                doc.addPage();
                y = margin;
            }
        };

        // Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        const titleLines = doc.splitTextToSize(poe.title, usableWidth);
        doc.text(titleLines, pageWidth / 2, y, { align: 'center' });
        y += titleLines.length * 8;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`${poe.code} - v${poe.version}`, pageWidth / 2, y, { align: 'center' });
        y += 12;

        // --- SECTION: METADATA ---
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Información General', margin, y);
        y += 6;
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;

        const addMetadaField = (label: string, value: string) => {
            const labelWidth = 45;
            checkPageBreak(12);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(label, margin, y);
            doc.setFont('helvetica', 'normal');
            const textLines = doc.splitTextToSize(value || 'N/A', usableWidth - labelWidth);
            doc.text(textLines, margin + labelWidth, y);
            y += textLines.length * 5;
            y += 2;
        };
        
        addMetadaField('Establecimiento:', poe.establishment);
        addMetadaField('Área de Aplicación:', poe.applicationArea);
        addMetadaField('Frecuencia:', Array.isArray(poe.frequency) ? poe.frequency.join(', ') : poe.frequency);
        addMetadaField('Creado por:', poe.createdBy);
        addMetadaField('Fecha creación:', formatDate(poe.createdAt));
        if (poe.approvedBy) {
            addMetadaField('Aprobado por:', `${poe.approvedBy} el ${formatDate(poe.approvedAt)}`);
        }
        y += 5;

        // --- SECTION: Responsibilities ---
        checkPageBreak(20);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Responsabilidades', margin, y);
        y += 6;
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;
        
        poe.responsibilities.forEach(resp => {
            checkPageBreak(12);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(`Cargo: ${resp.cargo}`, margin, y);
            y += 5;

            doc.setFont('helvetica', 'normal');
            const textLines = doc.splitTextToSize(`Responsabilidad: ${resp.responsabilidad}`, usableWidth - 5);
            checkPageBreak(textLines.length * 5 + 5);
            doc.text(textLines, margin + 5, y);
            y += textLines.length * 5 + 3;
        });
        y += 5;

        // --- SECTION: DETAILS ---
        const addSection = (title: string, textContent: string) => {
            checkPageBreak(20);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(title, margin, y);
            y += 6;
            doc.setLineWidth(0.5);
            doc.line(margin, y, pageWidth - margin, y);
            y += 6;
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const textLines = doc.splitTextToSize(textContent, usableWidth);
            checkPageBreak(textLines.length * 5 + 10);
            doc.text(textLines, margin, y);
            y += textLines.length * 5 + 5;
        };

        addSection('Objetivo', poe.objective);
        addSection('Alcance', poe.scope);
        addSection('Productos y Materiales', poe.productsAndMaterials);
        addSection('Descripción', poe.description);
        addSection('Instrucciones de Seguridad y EPI', poe.safetyInstructions);

        // --- SECTION: STEPS ---
        checkPageBreak(20);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Pasos del Procedimiento', margin, y);
        y += 6;
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;
        
        poe.steps.forEach((step, index) => {
            checkPageBreak(15);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(`Paso ${index + 1}: ${step.name}`, margin, y);
            y += 6;

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const textLines = doc.splitTextToSize(step.text, usableWidth - 5);
            checkPageBreak(textLines.length * 5 + 5);
            doc.text(textLines, margin + 5, y);
            y += textLines.length * 5 + 5;
        });
        
        y += 5;

        // --- SECTION: VERIFICATION AND ACTIONS ---
        addSection('Verificación y Registro', poe.verification);
        addSection('Acciones Correctivas', poe.correctiveActions);
        
        const poeTitle = poe.title.replace(/[\s/]+/g, '_');
        const filename = `${poe.code}_${poeTitle}_v${poe.version}.pdf`;
        doc.save(filename);
    };

    const exportToJson = () => {
        const poeTitle = poe.title.replace(/[\s/]+/g, '_');
        const filename = `${poe.code}_${poeTitle}.json`;
        
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(poe, null, 2));
        
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", filename);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };


    if (!isOpen) return null;
    
    const displayFrequency = Array.isArray(poe.frequency) ? poe.frequency.join(', ') : poe.frequency;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10 px-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white rounded-t-lg z-10">
                    <h2 className="text-xl font-semibold text-gray-800">Detalles del POE</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <XIcon />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
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
                            <p><strong>Frecuencia:</strong> {displayFrequency}</p>
                        </div>
                        <div>
                            <p><strong>Creado por:</strong> {poe.createdBy}</p>
                            <p><strong>Fecha creación:</strong> {formatDate(poe.createdAt)}</p>
                            {poe.approvedBy && <p><strong>Aprobado por:</strong> {poe.approvedBy} el {formatDate(poe.approvedAt)}</p>}
                        </div>
                    </div>
                     <div className="mb-4">
                        <h4 className="font-semibold text-gray-700">Responsabilidades</h4>
                        <div className="space-y-2 mt-2">
                            {poe.responsibilities.map((resp, index) => (
                                <div key={index} className="p-3 border rounded-md bg-gray-100">
                                    <p><strong className="text-gray-800">Cargo:</strong> {resp.cargo}</p>
                                    <p><strong className="text-gray-800">Responsabilidad:</strong> {resp.responsabilidad}</p>
                                </div>
                            ))}
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
                    <button onClick={exportToPDF} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                        <FilePdf className="w-4 h-4 mr-2" /> Exportar a PDF
                    </button>
                    <button onClick={exportToJson} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700">
                        <JsonIcon className="w-4 h-4 mr-2" /> Exportar a JSON
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PoeDetailModal;