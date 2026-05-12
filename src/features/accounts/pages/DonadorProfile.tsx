import { useState, useEffect } from "react";
import { auth, db } from "../../../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import { User as UserIcon, Phone, MapPin, Save, Loader2 } from "lucide-react";
import styles from "./DonadorProfile.module.css";

export function DonadorProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await loadProfile(currentUser.uid);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loadProfile = async (uid: string) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile({
          nombre: data.nombre || "",
          telefono: data.telefono || "",
          direccion: data.direccion || "",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "users", user.uid), profile, { merge: true });
      toast.success("Perfil guardado exitosamente", { icon: "✅" });
    } catch (error) {
      toast.error("Error al guardar el perfil");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <Toaster position="top-right" />
      <h2 className={styles.cardTitle}>
        <UserIcon size={20} />
        Mi Perfil
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <UserIcon size={14} className="inline mr-1" />
            Nombre completo
          </label>
          <input
            type="text"
            value={profile.nombre}
            onChange={(e) => setProfile({ ...profile, nombre: e.target.value })}
            placeholder="Tu nombre completo"
            className={styles.input}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Phone size={14} className="inline mr-1" />
            Teléfono
          </label>
          <input
            type="tel"
            value={profile.telefono}
            onChange={(e) => setProfile({ ...profile, telefono: e.target.value })}
            placeholder="Tu número de teléfono"
            className={styles.input}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin size={14} className="inline mr-1" />
            Dirección
          </label>
          <input
            type="text"
            value={profile.direccion}
            onChange={(e) => setProfile({ ...profile, direccion: e.target.value })}
            placeholder="Tu dirección"
            className={styles.input}
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={styles.saveButton}
        >
          {saving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
