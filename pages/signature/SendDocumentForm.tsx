
import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { api } from '../../services/api';

interface SendDocumentFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const SendDocumentForm: React.FC<SendDocumentFormProps> = ({ onClose, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [signerName, setSignerName] = useState('');
    const [signerEmail, setSignerEmail] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            alert("Por favor selecciona un archivo PDF.");
            return;
        }
        
        setLoading(true);
        try {
            await api.sendSignatureDocument(title, message, file, signerName, signerEmail);
            onSuccess();
        } catch (error) {
            console.error(error);
            alert("Error al enviar el documento.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <Input 
                    label="Título del Documento" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                    placeholder="Ej: Contrato Laboral - Juan Pérez"
                />
                <Input 
                    label="Mensaje para el Firmante" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    required 
                    placeholder="Por favor revisa y firma este documento."
                />
                
                <div className="grid grid-cols-2 gap-4">
                    <Input 
                        label="Nombre del Firmante" 
                        value={signerName} 
                        onChange={(e) => setSignerName(e.target.value)} 
                        required 
                    />
                    <Input 
                        label="Email del Firmante" 
                        type="email"
                        value={signerEmail} 
                        onChange={(e) => setSignerEmail(e.target.value)} 
                        required 
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Documento (PDF)</label>
                    <input 
                        type="file" 
                        accept="application/pdf"
                        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white"
                        required
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
                <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar a Firmar (BoldSign)'}
                </Button>
            </div>
        </form>
    );
};
