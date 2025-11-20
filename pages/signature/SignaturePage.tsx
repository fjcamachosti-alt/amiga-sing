
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { SignedDocument } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { Input } from '../../components/ui/Input';
import { AutoFirmaClient } from './AutoFirmaClient';

export const SignaturePage: React.FC = () => {
    const [documents, setDocuments] = useState<SignedDocument[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Signing State
    const [fileToSign, setFileToSign] = useState<File | null>(null);
    const [isSigning, setIsSigning] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const fetchDocuments = async () => {
        setLoading(true);
        const data = await api.getSignedDocuments();
        setDocuments(data);
        setLoading(false);
        setTimeout(() => window.lucide?.createIcons(), 0);
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type !== 'application/pdf') {
                alert('Solo se admiten archivos PDF para firma electrónica.');
                return;
            }
            setFileToSign(file);
        }
    };

    const handleStartSignature = async () => {
        if (!fileToSign) return;

        setIsSigning(true);
        setStatusMessage('Iniciando comunicación con AutoFirma...');

        // 1. Trigger AutoFirma Flow
        const result = await AutoFirmaClient.signDocument(fileToSign);

        if (result.success && result.signedFile) {
            setStatusMessage('Documento firmado correctamente. Guardando...');
            
            // 2. Save Signed Document to Backend
            const newDoc: Omit<SignedDocument, 'id'> = {
                originalName: fileToSign.name,
                signedName: result.signedFile.name,
                signedDate: new Date().toISOString(),
                signedBy: 'Usuario Actual (Certificado)' // In real app, extract CN from cert
            };

            await api.saveSignedDocument(newDoc);
            
            setStatusMessage('Completado.');
            setFileToSign(null);
            fetchDocuments();
        } else {
            alert(`Error en la firma: ${result.error}`);
        }

        setIsSigning(false);
        setStatusMessage('');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">Firma Digital (AutoFirma)</h2>
            
            {/* Action Card */}
            <Card className="border-l-4 border-primary">
                <h3 className="text-xl font-bold mb-4">Firmar Nuevo Documento</h3>
                <div className="space-y-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                        <ol className="list-decimal list-inside text-sm text-gray-400 space-y-1 mb-4">
                            <li>Seleccione el documento PDF que desea firmar.</li>
                            <li>Pulse "Firmar con AutoFirma".</li>
                            <li>La aplicación <strong>AutoFirma</strong> se abrirá en su equipo.</li>
                            <li>Seleccione su certificado digital e introduzca su PIN.</li>
                        </ol>

                        <div className="flex flex-col md:flex-row gap-4 items-end">
                             <div className="w-full md:w-1/2">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Documento PDF</label>
                                <input 
                                    type="file" 
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                                />
                            </div>
                            <Button 
                                onClick={handleStartSignature} 
                                disabled={!fileToSign || isSigning}
                                icon={isSigning ? <Spinner /> : <i data-lucide="pen-tool"></i>}
                            >
                                {isSigning ? 'Procesando...' : 'Firmar con AutoFirma'}
                            </Button>
                        </div>
                        {statusMessage && <p className="text-primary mt-2 text-sm animate-pulse">{statusMessage}</p>}
                    </div>
                </div>
            </Card>

            {/* History List */}
            <h3 className="text-xl font-bold mt-8">Historial de Documentos Firmados</h3>
            {loading ? <Spinner /> : (
                <div className="grid gap-4">
                    {documents.length === 0 ? (
                         <p className="text-center text-gray-500 py-10">No hay documentos firmados en el historial.</p>
                    ) : (
                        documents.map(doc => (
                            <Card key={doc.id} className="hover:bg-gray-800/50 transition-colors">
                                <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-green-900/30 rounded-full text-green-400">
                                            <i data-lucide="file-check-2" className="h-6 w-6"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">{doc.signedName}</h4>
                                            <p className="text-sm text-gray-400">Original: {doc.originalName}</p>
                                            <div className="flex gap-4 text-xs text-gray-500 mt-1">
                                                <span>Firmado por: {doc.signedBy}</span>
                                                <span>•</span>
                                                <span>Fecha: {new Date(doc.signedDate).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="secondary" onClick={() => alert("Descargando documento firmado...")}>
                                        <i data-lucide="download" className="h-4 w-4 mr-2"></i> Descargar
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
