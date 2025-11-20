
import React from 'react';
import { Page } from './types';
import { LayoutDashboard, UserCircle, CalendarDays, Siren, Users, Briefcase, Activity, PenTool, Info } from 'lucide-react';

interface NavItem {
  name: Page;
  icon: React.ElementType;
}

export const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Mi Perfil', icon: UserCircle },
  { name: 'Calendario', icon: CalendarDays },
  { name: 'Vehículos', icon: Siren },
  { name: 'Empleados', icon: Users },
  { name: 'ERP', icon: Briefcase },
  { name: 'Operaciones', icon: Activity },
  { name: 'Firma Digital', icon: PenTool },
  { name: 'Datos de Interés', icon: Info },
];
