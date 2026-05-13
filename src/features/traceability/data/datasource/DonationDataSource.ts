import { DonationDetail } from "../../domain/entities/Donation";

export const mockDonationDetail: DonationDetail = {
  id: "DON-8492-X",
  donorName: "Supermercado El Ahorro",
  beneficiaryName: "Juan Pérez",
  date: "30 de Abril, 2026",
  status: "ready_for_pickup",
  pickupLocation: "Calle 45 #51-10 (Centro Comunitario Central)",
  items: ["20kg Arroz", "10L Leche", "15kg Frutas Variadas"],
  timeline: [
    {
      status: "pending",
      label: "Donación Registrada",
      date: "30 Abr - 08:30 AM",
      isCompleted: true,
      icon: "📋",
    },
    {
      status: "ready_for_pickup",
      label: "En espera de recogida",
      date: "Disponible desde las 10:15 AM",
      isCompleted: true,
      icon: "📍",
    },
    {
      status: "delivered",
      label: "Entregado",
      date: "Pendiente",
      isCompleted: false,
      icon: "📦",
    },
  ],
};
