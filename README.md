# AMIGA - Aplicación Modular Inteligente de Gestión Avanzada

AMIGA es un sistema integral de gestión empresarial (ERP/CRM) diseñado específicamente para empresas de ambulancias y transporte sanitario.

## 🚀 Características Principales

*   **Gestión de Flota:** Control total de vehículos, mantenimiento, ITV y documentación.
*   **Recursos Humanos:** Gestión de empleados, roles (RBAC), nóminas y turnos.
*   **Operaciones:** Planificación de turnos, incidencias, inventario médico y control de combustible.
*   **Firma Digital:** Integración con **BoldSign** para firma remota de documentos.
*   **ERP:** Facturación, clientes, proveedores y documentación corporativa.

## 🛠️ Requisitos Previos

*   Node.js (v16 o superior)
*   PostgreSQL
*   Cuenta de BoldSign (para firma digital)

## 📦 Instalación y Despliegue

### 1. Configuración Inicial

Clona el repositorio e instala las dependencias:

```bash
git clone https://github.com/tu-usuario/amiga-system.git
cd amiga-system
npm install
```

### 2. Configuración del Backend

1.  Asegúrate de tener PostgreSQL corriendo y crea una base de datos llamada `amiga_db`.
2.  Ejecuta el script `server/schema.sql` en tu base de datos para crear las tablas.
3.  El archivo `server/.env` ya contiene la configuración base y la API Key de BoldSign.

### 3. Iniciar la Aplicación

Para desarrollo, puedes ejecutar tanto el servidor como el cliente.

**Terminal 1 (Backend):**
```bash
npm run dev
```
_El servidor escuchará en http://localhost:5000_

**Terminal 2 (Frontend):**
```bash
npm run client
```
_La aplicación web estará en http://localhost:5173_

## 🔐 Credenciales por Defecto

*   **Super Administrador:**
    *   Email: `fj.camacho.sti@gmail.com`
    *   Contraseña: `Apisistem1981`

## 📄 Integración BoldSign

La funcionalidad de Firma Digital utiliza la API de BoldSign.
*   Los documentos se envían desde la sección "Firma Digital".
*   El backend actúa como proxy seguro para proteger tu API Key (`server/routes/boldsign.routes.js`).

---
**AMIGA** - Optimizando la gestión sanitaria.