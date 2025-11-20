
import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { api } from '../services/api';
import { Alert, Incident, Vehicle, User } from '../types';
import { Button } from '../components/ui/Button';
import { UserForm } from './users/UserForm';
import { VehicleForm } from './vehicles/VehicleForm';
import { Modal } from '../components/ui/Modal';
import { Plus, UserPlus, Siren, Users, Bell, Wrench } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; color: string }> = ({ title, value, icon: Icon, color }) => (
    <Card className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6" />
        </div>
        <div>
            <p className="text-gray-400">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </Card>
);

export const Dashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{
        totalVehicles: number;
        totalWorkers: number;
        pendingAlerts: number;
        upcomingAlerts: Alert[];
        recentIncidents: Incident[];
        recentVehicles: Vehicle[];
    } | null>(null);
    const [calendarData, setCalendarData] = useState<{date: string, shifts: number}[]>([]);
    
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const dashboardData = await api.getDashboardData();
            const shifts = await api.getShifts();
            
            const next15Days = Array.from({length: 15}, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() + i);
                return d.toISOString().split('T')[0];
            });
            
            const calData = next15Days.map(date => ({
                date,
                shifts: shifts.filter(s => s.start.startsWith(date)).length
            }));

            setData(dashboardData);
            setCalendarData(calData);
            setLoading(false);
        };
        fetchData();
    }, []);
    
    const handleSaveUser = async (user: User) => {
        await api.saveUser(user);
        setIsUserModalOpen(false);
        const newData = await api.getDashboardData();
        setData(prev => prev ? ({...prev, totalWorkers: newData.totalWorkers}) : null);
    };

    const handleSaveVehicle = async (vehicle: Vehicle) => {
        await api.saveVehicle(vehicle);
        setIsVehicleModalOpen(false);
        const newData = await api.getDashboardData();
        setData(prev => prev ? ({...prev, totalVehicles: newData.totalVehicles}) : null);
    };

    if (loading) return <Spinner />;
    if (!data) return <p>No se pudieron cargar los datos del dashboard.</p>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Panel de Control Principal</h2>
                <div className="flex gap-3">
                    <Button onClick={() => setIsVehicleModalOpen(true)} icon={<Plus />}>Nuevo Vehículo</Button>
                    <Button onClick={() => setIsUserModalOpen(true)} icon={<UserPlus />}>Nuevo Empleado</Button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Vehículos" value={data.totalVehicles} icon={Siren} color="bg-blue-500/20 text-blue-400" />
                <StatCard title="Total Trabajadores" value={data.totalWorkers} icon={Users} color="bg-green-500/20 text-green-400" />
                <StatCard title="Alertas Pendientes" value={data.pendingAlerts} icon={Bell} color="bg-red-500/20 text-red-400" />
            </div>
            
            <Card title="Calendario de Servicios (Próximos 15 Días)">
                <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar">
                    {calendarData.map((day, idx) => {
                        const dateObj = new Date(day.date);
                        const dayName = dateObj.toLocaleDateString('es-ES', { weekday: 'short' });
                        const dayNum = dateObj.getDate();
                        return (
                            <div key={idx} className="flex flex-col items-center p-3 bg-gray-800 rounded-lg min-w-[80px] flex-shrink-0 border border-gray-700">
                                <span className="text-xs text-gray-400 uppercase mb-1">{dayName}</span>
                                <span className="text-xl font-bold text-white">{dayNum}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full mt-2 font-medium ${day.shifts > 0 ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-500'}`}>
                                    {day.shifts} Svc
                                </span>
                            </div>
                        );
                    })}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Alertas de Mantenimiento de Vehículos" className="lg:col-span-1">
                     {data.upcomingAlerts.length === 0 ? (
                        <p className="text-gray-500">No hay alertas pendientes.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="pb-2">Tipo</th>
                                        <th className="pb-2">Descripción</th>
                                        <th className="pb-2">Vencimiento</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.upcomingAlerts.map(alert => (
                                        <tr key={alert.id} className="border-b border-gray-700/50">
                                            <td className="py-2">
                                                <span className={`px-2 py-1 rounded text-xs ${alert.type === 'Revisión' ? 'bg-blue-900 text-blue-300' : 'bg-red-900 text-red-300'}`}>
                                                    {alert.type}
                                                </span>
                                            </td>
                                            <td className="py-2">{alert.description}</td>
                                            <td className="py-2 text-warning">{alert.dueDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
                 <Card title="Últimas Incidencias" className="lg:col-span-1">
                    <ul className="space-y-3">
                        {data.recentIncidents.map(incident => (
                            <li key={incident.id} className="flex items-center gap-3 text-sm border-b border-gray-700 pb-2 last:border-0">
                                <div className="p-2 bg-gray-800 rounded-full">
                                     <Wrench className="text-danger h-4 w-4" />
                                </div>
                                <div>
                                    <p className="font-semibold">{incident.description}</p>
                                    <div className="flex gap-2 text-xs text-gray-400">
                                        <span>{incident.date}</span>
                                        <span>•</span>
                                        <span>Vehículo: {incident.vehicleId}</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>

            <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title="Alta de Nuevo Empleado">
                <UserForm user={null} onSave={handleSaveUser} onCancel={() => setIsUserModalOpen(false)} />
            </Modal>
            <Modal isOpen={isVehicleModalOpen} onClose={() => setIsVehicleModalOpen(false)} title="Alta de Nuevo Vehículo">
                 <VehicleForm vehicle={null} onSave={handleSaveVehicle} onCancel={() => setIsVehicleModalOpen(false)} />
            </Modal>
        </div>
    );
};
