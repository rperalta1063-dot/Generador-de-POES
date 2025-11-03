import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { POE, Step } from '../types';
import { PlusIcon, TrashIcon, XCircle } from '../components/Icons';
import ConfirmationModal from '../components/ConfirmationModal';

const CreatePoe: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { savePoe, updatePoe, currentEstablishment, currentUser, poes, addToast } = useApp();
    const isEditing = Boolean(id);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [poe, setPoe] = useState<Omit<POE, 'id'>>({
        establishment: currentEstablishment || '',
        code: '',
        title: '',
        applicationArea: '',
        responsible: '',
        frequency: '',
        objective: '',
        scope: '',
        productsAndMaterials: '',
        description: '',
        safetyInstructions: '',
        verification: '',
        correctiveActions: '',
        steps: [{ id: 1, name: '', text: '', image: null }],
        attachments: [],
        status: 'draft',
        version: 1,
        createdBy: currentUser?.username || '',
        createdAt: new Date().toISOString(),
        approvedBy: null,
        approvedAt: null,
        history: [],
    });

    useEffect(() => {
        if (isEditing) {
            const poeToEdit = poes.find(p => p.id === Number(id));
            if (poeToEdit) {
                setPoe(poeToEdit);
            }
        }
    }, [id, isEditing, poes]);
    
    useEffect(() => {
        if(!isEditing) {
            setPoe(p => ({ ...p, establishment: currentEstablishment || ''}));
        }
    }, [currentEstablishment, isEditing]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPoe({ ...poe, [name]: value });
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleStepChange = (index: number, field: keyof Omit<Step, 'id' | 'image'>, value: string) => {
        const newSteps = [...poe.steps];
        newSteps[index][field] = value;
        setPoe({ ...poe, steps: newSteps });
        const errorKey = `step_${index}_${field}`;
        if (errors[errorKey]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[errorKey];
                return newErrors;
            });
        }
    };

    const addStep = () => {
        setPoe({
            ...poe,
            steps: [...poe.steps, { id: poe.steps.length + 1, name: '', text: '' }],
        });
    };

    const removeStep = (index: number) => {
        const newSteps = poe.steps.filter((_, i) => i !== index);
        setPoe({ ...poe, steps: newSteps });
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        
        if (!poe.establishment.trim()) newErrors.establishment = 'El campo "Nombre del Establecimiento" es obligatorio.';
        if (!poe.code.trim()) newErrors.code = 'El campo "Código" es obligatorio.';
        if (!poe.title.trim()) newErrors.title = 'El campo "Título/Nombre del POE" es obligatorio.';
        if (!poe.applicationArea.trim()) newErrors.applicationArea = 'El campo "Área de aplicación" es obligatorio.';
        if (!poe.responsible.trim()) newErrors.responsible = 'El campo "Responsable" es obligatorio.';
        if (!poe.frequency) newErrors.frequency = 'Debe seleccionar una "Frecuencia".';
        if (!poe.objective.trim()) newErrors.objective = 'El campo "Objetivo" es obligatorio.';
        if (!poe.scope.trim()) newErrors.scope = 'El campo "Alcance" es obligatorio.';
        if (!poe.productsAndMaterials.trim()) newErrors.productsAndMaterials = 'El campo "Productos y materiales" es obligatorio.';
        if (!poe.description.trim()) newErrors.description = 'El campo "Descripción" es obligatorio.';
        if (!poe.safetyInstructions.trim()) newErrors.safetyInstructions = 'El campo "Instrucciones de seguridad y EPI" es obligatorio.';
        if (!poe.verification.trim()) newErrors.verification = 'El campo "Verificación y registro" es obligatorio.';
        if (!poe.correctiveActions.trim()) newErrors.correctiveActions = 'El campo "Acciones correctivas" es obligatorio.';

        poe.steps.forEach((step, index) => {
            if (!step.name.trim()) newErrors[`step_${index}_name`] = `El nombre del paso es obligatorio.`;
            if (!step.text.trim()) newErrors[`step_${index}_text`] = `La descripción del paso es obligatoria.`;
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = (status: 'draft' | 'pending') => {
        const poeData = {
            ...poe,
            status,
            createdAt: isEditing ? poe.createdAt : new Date().toISOString(),
            version: isEditing ? poe.version + 1 : 1,
            history: [
                ...poe.history,
                {
                    version: isEditing ? poe.version + 1 : 1,
                    changedBy: currentUser?.username || '',
                    changeDate: new Date().toISOString(),
                    changes: isEditing ? 'Actualización' : 'Creación inicial'
                }
            ]
        };
        
        if(isEditing) {
            updatePoe(poeData as POE);
        } else {
            savePoe(poeData);
        }

        addToast(`POE ${status === 'pending' ? 'enviado para aprobación' : 'guardado como borrador'}.`, status === 'pending' ? 'success' : 'info');
        navigate('/poe-list');
    };

    const handleSaveDraft = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            handleSave('draft');
        }
    };

    const handleSendForApproval = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setIsConfirmModalOpen(true);
        }
    };
    
    const onConfirmSend = () => {
        handleSave('pending');
        setIsConfirmModalOpen(false);
    };


    return (
        <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">{isEditing ? 'Editar POE' : 'Crear Nuevo POE'}</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <form>
                    {Object.keys(errors).length > 0 && (
                        <div className="mb-6 rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <XCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800">
                                        Por favor, corrija los errores en el formulario.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                            <label htmlFor="establishment" className="block text-sm font-medium text-gray-700">Nombre del Establecimiento</label>
                            <input type="text" name="establishment" id="establishment" value={poe.establishment} onChange={handleChange} required className={`mt-1 block w-full rounded-md shadow-sm ${errors.establishment ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:border-sky-500 focus:ring-sky-500'}`} readOnly={!!currentEstablishment && !isEditing} />
                            {errors.establishment && <p className="mt-2 text-sm text-red-600">{errors.establishment}</p>}
                        </div>
                        <div>
                            <label htmlFor="code" className="block text-sm font-medium text-gray-700">Código</label>
                            <input type="text" name="code" id="code" value={poe.code} onChange={handleChange} required className={`mt-1 block w-full rounded-md shadow-sm ${errors.code ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:border-sky-500 focus:ring-sky-500'}`} />
                            {errors.code && <p className="mt-2 text-sm text-red-600">{errors.code}</p>}
                        </div>
                        <div>
                            <label htmlFor="poe-title" className="block text-sm font-medium text-gray-700">Título/Nombre del POE</label>
                            <input type="text" name="title" id="poe-title" value={poe.title} onChange={handleChange} required className={`mt-1 block w-full rounded-md shadow-sm ${errors.title ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:border-sky-500 focus:ring-sky-500'}`} />
                            {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
                        </div>
                        <div>
                            <label htmlFor="applicationArea" className="block text-sm font-medium text-gray-700">Área de aplicación</label>
                            <input type="text" name="applicationArea" id="applicationArea" value={poe.applicationArea} onChange={handleChange} required className={`mt-1 block w-full rounded-md shadow-sm ${errors.applicationArea ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:border-sky-500 focus:ring-sky-500'}`} />
                            {errors.applicationArea && <p className="mt-2 text-sm text-red-600">{errors.applicationArea}</p>}
                        </div>
                        <div>
                            <label htmlFor="responsible" className="block text-sm font-medium text-gray-700">Responsable</label>
                            <input type="text" name="responsible" id="responsible" value={poe.responsible} onChange={handleChange} required className={`mt-1 block w-full rounded-md shadow-sm ${errors.responsible ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:border-sky-500 focus:ring-sky-500'}`} />
                            {errors.responsible && <p className="mt-2 text-sm text-red-600">{errors.responsible}</p>}
                        </div>
                        <div>
                            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frecuencia</label>
                            <select name="frequency" id="frequency" value={poe.frequency} onChange={handleChange} required className={`mt-1 block w-full rounded-md shadow-sm ${errors.frequency ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:border-sky-500 focus:ring-sky-500'}`}>
                                <option value="">Seleccione una frecuencia</option>
                                <option value="Después de cada uso">Después de cada uso</option>
                                <option value="Al menos una vez al dia">Al menos una vez al día</option>
                                <option value="Al final de la jornada">Al final de la jornada</option>
                                <option value="Diaria">Diaria</option>
                                <option value="Semanal">Semanal</option>
                                <option value="Mensual">Mensual</option>
                                <option value="Anual">Anual</option>
                                <option value="Según necesidad">Según necesidad</option>
                            </select>
                            {errors.frequency && <p className="mt-2 text-sm text-red-600">{errors.frequency}</p>}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="objective" className="block text-sm font-medium text-gray-700">Objetivo</label>
                        <textarea name="objective" id="objective" rows={2} value={poe.objective} onChange={handleChange} required className={`mt-1 block w-full rounded-md shadow-sm ${errors.objective ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:border-sky-500 focus:ring-sky-500'}`}></textarea>
                        {errors.objective && <p className="mt-2 text-sm text-red-600">{errors.objective}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="scope" className="block text-sm font-medium text-gray-700">Alcance</label>
                        <textarea name="scope" id="scope" rows={2} value={poe.scope} onChange={handleChange} required className={`mt-1 block w-full rounded-md shadow-sm ${errors.scope ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:border-sky-500 focus:ring-sky-500'}`}></textarea>
                        {errors.scope && <p className="mt-2 text-sm text-red-600">{errors.scope}</p>}
                    </div>
                     <div className="mb-4">
                        <label htmlFor="productsAndMaterials" className="block text-sm font-medium text-gray-700">Productos y materiales</label>
                        <textarea name="productsAndMaterials" id="productsAndMaterials" rows={3} value={poe.productsAndMaterials} onChange={handleChange} required placeholder="Liste los productos químicos, utensilios, equipos de protección, etc." className={`mt-1 block w-full rounded-md shadow-sm ${errors.productsAndMaterials ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:border-sky-500 focus:ring-sky-500'}`}></textarea>
                        {errors.productsAndMaterials && <p className="mt-2 text-sm text-red-600">{errors.productsAndMaterials}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="poe-description" className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea name="description" id="poe-description" rows={3} value={poe.description} onChange={handleChange} required className={`mt-1 block w-full rounded-md shadow-sm ${errors.description ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:border-sky-500 focus:ring-sky-500'}`}></textarea>
                        {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="safetyInstructions" className="block text-sm font-medium text-gray-700">Instrucciones de seguridad y equipo de Protección (EPI)</label>
                        <textarea name="safetyInstructions" id="safetyInstructions" rows={3} value={poe.safetyInstructions} onChange={handleChange} required className={`mt-1 block w-full rounded-md shadow-sm ${errors.safetyInstructions ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:border-sky-500 focus:ring-sky-500'}`}></textarea>
                        {errors.safetyInstructions && <p className="mt-2 text-sm text-red-600">{errors.safetyInstructions}</p>}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 border-t pt-6 mt-6">Pasos del Procedimiento</h3>
                    <div className="space-y-4">
                        {poe.steps.map((step, index) => (
                            <div key={index} className="p-4 border rounded-md relative bg-gray-50">
                                <div className="absolute top-2 right-2 flex items-center">
                                    <span className="text-sm font-bold text-gray-400 mr-4">Paso {index + 1}</span>
                                    {poe.steps.length > 1 && (
                                        <button type="button" onClick={() => removeStep(index)} className="p-1 text-red-500 hover:text-red-700">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                                <div className="mb-2">
                                    <label className="text-sm font-medium text-gray-700">Nombre del paso o fase</label>
                                    <input type="text" value={step.name} onChange={e => handleStepChange(index, 'name', e.target.value)} required placeholder="Ej: Preparación de materiales" className={`w-full text-sm mt-1 block rounded-md shadow-sm ${errors[`step_${index}_name`] ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}`} />
                                     {errors[`step_${index}_name`] && <p className="mt-1 text-sm text-red-600">{errors[`step_${index}_name`]}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Descripción</label>
                                    <textarea value={step.text} onChange={e => handleStepChange(index, 'text', e.target.value)} required rows={3} className={`w-full text-sm mt-1 block rounded-md shadow-sm ${errors[`step_${index}_text`] ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}`}></textarea>
                                    {errors[`step_${index}_text`] && <p className="mt-1 text-sm text-red-600">{errors[`step_${index}_text`]}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addStep} className="mt-4 flex items-center px-3 py-2 text-sm font-medium text-sky-600 bg-sky-100 rounded-md hover:bg-sky-200">
                        <PlusIcon className="w-4 h-4 mr-2" /> Agregar Paso
                    </button>
                    
                     <div className="mt-6 border-t pt-6">
                        <div className="mb-4">
                            <label htmlFor="verification" className="block text-sm font-medium text-gray-700">Verificación y registro</label>
                            <textarea name="verification" id="verification" rows={3} value={poe.verification} onChange={handleChange} required className={`mt-1 block w-full rounded-md shadow-sm ${errors.verification ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:border-sky-500 focus:ring-sky-500'}`}></textarea>
                            {errors.verification && <p className="mt-2 text-sm text-red-600">{errors.verification}</p>}
                        </div>
                        <div className="mb-6">
                            <label htmlFor="correctiveActions" className="block text-sm font-medium text-gray-700">Acciones correctivas</label>
                            <textarea name="correctiveActions" id="correctiveActions" rows={3} value={poe.correctiveActions} onChange={handleChange} required className={`mt-1 block w-full rounded-md shadow-sm ${errors.correctiveActions ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:border-sky-500 focus:ring-sky-500'}`}></textarea>
                            {errors.correctiveActions && <p className="mt-2 text-sm text-red-600">{errors.correctiveActions}</p>}
                        </div>
                    </div>


                    <div className="flex justify-end space-x-4 mt-8">
                        <button type="button" onClick={handleSaveDraft} className="px-4 py-2 font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Guardar Borrador</button>
                        <button type="button" onClick={handleSendForApproval} className="px-4 py-2 font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700">Enviar para Aprobación</button>
                    </div>
                </form>
            </div>
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={onConfirmSend}
                title="Confirmar Envío para Aprobación"
                confirmText="Sí, enviar"
            >
                <p className="text-sm text-gray-600">
                    ¿Está seguro de que desea enviar este POE para su aprobación?
                    <br /><br />
                    Una vez enviado, no podrá editarlo hasta que sea aprobado o rechazado por un administrador.
                </p>
            </ConfirmationModal>
        </div>
    );
};

export default CreatePoe;