import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../../../config/firebase';

// ── MOCK DATA ────────────────────────────────────────────────
const MOCK_COMPANY = {
  name: 'Alimentos del Valle S.A.',
  rfc: 'AVS-2019-0481',
  address: 'Av. Industrial 4820, Cali, Valle del Cauca',
  phone: '+57 300 123 4567',
  email: 'donaciones@alimentosdelvalle.com',
  logoUrl: null,
  employees: 24,
  verified: true,
};

const MOCK_DONATIONS = [
  { id: 'd1', productName: 'Arroz premium x50 kg', quantity: 50, unit: 'kg', status: 'entregada', createdAt: new Date('2025-05-10'), destination: 'Fundación Niños Felices' },
  { id: 'd2', productName: 'Aceite de girasol', quantity: 30, unit: 'litros', status: 'transito', createdAt: new Date('2025-05-09'), destination: 'Comedor Comunitario Norte' },
  { id: 'd3', productName: 'Leche en polvo', quantity: 15, unit: 'kg', status: 'pendiente', createdAt: new Date('2025-05-08'), destination: 'Hogar Santa Clara' },
  { id: 'd4', productName: 'Frijoles negros', quantity: 80, unit: 'kg', status: 'entregada', createdAt: new Date('2025-05-07'), destination: 'Fundación Vida Nueva' },
  { id: 'd5', productName: 'Harina de trigo', quantity: 60, unit: 'kg', status: 'entregada', createdAt: new Date('2025-05-06'), destination: 'Comedor Sur' },
  { id: 'd6', productName: 'Azúcar refinada', quantity: 40, unit: 'kg', status: 'cancelada', createdAt: new Date('2025-05-05'), destination: 'Fundación Crecer' },
  { id: 'd7', productName: 'Sardinas en lata x24', quantity: 24, unit: 'cajas', status: 'transito', createdAt: new Date('2025-05-04'), destination: 'Aldea Infantil' },
  { id: 'd8', productName: 'Maíz pira', quantity: 25, unit: 'kg', status: 'pendiente', createdAt: new Date('2025-05-03'), destination: 'Hogar de Adultos Mayor' },
];

const MOCK_INVENTORY = [
  { id: 'i1', name: 'Arroz', category: 'Cereales', stock: 850, maxStock: 1000, unit: 'kg', expiry: '2025-12-30', level: 'alto' },
  { id: 'i2', name: 'Aceite de cocina', category: 'Grasas', stock: 120, maxStock: 500, unit: 'litros', expiry: '2025-09-15', level: 'bajo' },
  { id: 'i3', name: 'Leche en polvo', category: 'Lácteos', stock: 280, maxStock: 400, unit: 'kg', expiry: '2025-07-20', level: 'normal' },
  { id: 'i4', name: 'Frijoles', category: 'Legumbres', stock: 620, maxStock: 800, unit: 'kg', expiry: '2026-01-10', level: 'alto' },
  { id: 'i5', name: 'Harina de trigo', category: 'Harinas', stock: 45, maxStock: 600, unit: 'kg', expiry: '2025-08-05', level: 'bajo' },
  { id: 'i6', name: 'Azúcar', category: 'Endulzantes', stock: 350, maxStock: 500, unit: 'kg', expiry: '2026-03-01', level: 'normal' },
  { id: 'i7', name: 'Sal', category: 'Condimentos', stock: 180, maxStock: 200, unit: 'kg', expiry: '2027-01-01', level: 'alto' },
  { id: 'i8', name: 'Sardinas', category: 'Conservas', stock: 60, maxStock: 300, unit: 'cajas', expiry: '2025-10-30', level: 'bajo' },
];

const MOCK_EMPLOYEES = [
  { id: 'e1', name: 'Daniela Ospina', role: 'Coordinadora de Donaciones', dept: 'Logística', initials: 'DO', color: '#3525cd' },
  { id: 'e2', name: 'Carlos Restrepo', role: 'Gestor de Inventario', dept: 'Almacén', initials: 'CR', color: '#712ae2' },
  { id: 'e3', name: 'María Gómez', role: 'Conductora', dept: 'Transporte', initials: 'MG', color: '#047857' },
  { id: 'e4', name: 'Andrés Torres', role: 'Analista de Reportes', dept: 'Finanzas', initials: 'AT', color: '#854d0e' },
  { id: 'e5', name: 'Laura Herrera', role: 'Administradora', dept: 'Administración', initials: 'LH', color: '#ba1a1a' },
  { id: 'e6', name: 'Julián Mora', role: 'Conductor', dept: 'Transporte', initials: 'JM', color: '#3730a3' },
];

const MOCK_LOGISTICS = [
  { id: 'l1', route: 'Planta → Fundación Niños Felices', driver: 'María Gómez', status: 'en_ruta', eta: '14:30', load: '50 kg arroz', progress: 65 },
  { id: 'l2', route: 'Almacén → Comedor Comunitario Norte', driver: 'Julián Mora', status: 'recogida', eta: '15:45', load: '30 L aceite', progress: 20 },
  { id: 'l3', route: 'Depósito → Hogar Santa Clara', driver: 'Carlos Restrepo', status: 'entregado', eta: 'Completado', load: '15 kg leche', progress: 100 },
];

const MOCK_ACTIVITY = [
  { id: 'a1', text: 'Donación de arroz entregada exitosamente', time: 'Hace 30 min', type: 'success', icon: 'check' },
  { id: 'a2', text: 'Nueva ruta de transporte asignada a María G.', time: 'Hace 1h', type: 'info', icon: 'truck' },
  { id: 'a3', text: 'Stock de aceite bajo del mínimo recomendado', time: 'Hace 2h', type: 'warning', icon: 'alert' },
  { id: 'a4', text: 'Empleado Carlos Restrepo actualizó inventario', time: 'Hace 3h', type: 'info', icon: 'edit' },
  { id: 'a5', text: 'Reporte mensual de mayo generado', time: 'Hace 5h', type: 'success', icon: 'file' },
];

const MOCK_KPI = {
  toneladasDonadas: '12.4',
  donacionesActivas: 8,
  beneficiarios: 342,
  puntosLogisticos: 7,
};

// ─────────────────────────────────────────────────────────────

export function useEmpresaData() {
  const [company, setCompany] = useState(null);
  const [donations, setDonations] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [logistics, setLogistics] = useState([]);
  const [activity, setActivity] = useState([]);
  const [kpi, setKpi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      // No hay sesión activa: usar mock data
      loadMock();
      return;
    }

    let unsub = () => {};
    try {
      unsub = onSnapshot(
        doc(db, 'companies', uid),
        (snap) => {
          if (snap.exists()) {
            setCompany({ id: snap.id, ...snap.data() });
          } else {
            setCompany(MOCK_COMPANY);
          }
          setLoading(false);
        },
        (err) => {
          console.warn('[useEmpresaData] Firestore error, using mock:', err.message);
          loadMock();
        }
      );
    } catch (err) {
      console.warn('[useEmpresaData] Setup error, using mock:', err.message);
      loadMock();
    }

    return () => unsub();
  }, []);

  function loadMock() {
    setCompany(MOCK_COMPANY);
    setDonations(MOCK_DONATIONS);
    setInventory(MOCK_INVENTORY);
    setEmployees(MOCK_EMPLOYEES);
    setLogistics(MOCK_LOGISTICS);
    setActivity(MOCK_ACTIVITY);
    setKpi(MOCK_KPI);
    setLoading(false);
  }

  // Exponer mock data siempre que esté disponible (para demo / dev)
  const resolvedDonations = donations.length ? donations : MOCK_DONATIONS;
  const resolvedInventory = inventory.length ? inventory : MOCK_INVENTORY;
  const resolvedEmployees = employees.length ? employees : MOCK_EMPLOYEES;
  const resolvedLogistics = logistics.length ? logistics : MOCK_LOGISTICS;
  const resolvedActivity = activity.length ? activity : MOCK_ACTIVITY;
  const resolvedKpi = kpi || MOCK_KPI;

  return {
    company: company || MOCK_COMPANY,
    donations: resolvedDonations,
    inventory: resolvedInventory,
    employees: resolvedEmployees,
    logistics: resolvedLogistics,
    activity: resolvedActivity,
    kpi: resolvedKpi,
    loading,
    error,
  };
}
