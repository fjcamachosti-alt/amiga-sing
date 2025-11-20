
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { SignatureDocument } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { Modal } from '../../components/ui/Modal';
import { SendDocumentForm } from './SendDocumentForm';

export const SignaturePage: React.FC = () => {
    const [documents, setDocuments] = useState<SignatureDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const data = await api.getSignatureDocuments();
            setDocuments(data);
        } catch (error) {
            console.error("Error fetching documents:", error);
        } finally {
            setLoading(false);
            setTimeout(() => window.lucide?.createIcons(), 0);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleSuccess = () => {
        setIsModalOpen(false);
        fetchDocuments();
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            'Completed': 'bg-green-500/20 text-green-400',
            'InProgress': 'bg-blue-500/20 text-blue-400',
            'Declined': 'bg-red-500/20 text-red-400',
            'Revoked': 'bg-gray-500/20 text-gray-400',
        };
        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-gray-700 text-white'}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Firma Digital (BoldSign)</h2>
                <Button onClick={() => setIsModalOpen(true)} icon={<i data-lucide="send"></i>}>
                    Enviar Documento
                </Button>
            </div>

            {loading ? <Spinner /> : (
                <div className="grid gap-6">
                    {documents.length === 0 ? (
                         <p className="text-center text-gray-500 py-10">No hay documentos enviados para firma.</p>
                    ) : (
                        documents.map(doc => (
                            <Card key={doc.documentId} className="hover:bg-gray-800/50 transition-colors">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-bold">{doc.title}</h3>
                                            {getStatusBadge(doc.status)}
                                        </div>
                                        <p className="text-sm text-gray-400">Enviado el: {new Date(doc.createdDate).toLocaleDateString()}</p>
                                        <div className="flex gap-2 items-center text-sm mt-2">
                                            <i data-lucide="users" className="h-4 w-4 text-primary"></i>
                                            <span>Firmantes:</span>
                                            {doc.signers.map((s, idx) => (
                                                <span key={idx} className="text-gray-300">
                                                    {s.name} ({s.email}) - {getStatusBadge(s.status || 'Pending')}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="secondary" onClick={() => alert("Descargando documento desde BoldSign...")}>
                                            <i data-lucide="download" className="h-4 w-4 mr-2"></i> Descargar
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Enviar Documento para Firma">
                <SendDocumentForm onClose={() => setIsModalOpen(false)} onSuccess={handleSuccess} />
            </Modal>
        </div>
    );
};
