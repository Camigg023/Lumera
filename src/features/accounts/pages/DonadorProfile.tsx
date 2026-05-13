import { useState, useEffect } from "react";
import { auth, db } from "../../../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import { User as UserIcon, Phone, MapPin, Save, Loader2 } from "lucide-react";
import styles from "./DonadorProfile.module.css";

export function DonadorProfile() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        fetchProfile(user.uid);
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProfile = async (uid: string) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || "");
        setPhone(data.telefono || "");
        setAddress(data.direccion || "");
      }
    } catch (error) {
      console.error("Error al obtener el perfil:", error);
      toast.error("No se pudo cargar la información del perfil");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    if (!name.trim()) {
      toast.error("El nombre es requerido");
      return false;
    }
    if (phone.trim() && !/^\+?[0-9\s-]{7,15}$/.test(phone.trim())) {
      toast.error("Ingrese un número de teléfono válido");
      return false;
    }
    if (!address.trim()) {
      toast.error("La dirección es requerida");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!currentUser) {
      toast.error("Sesión no válida");
      return;
    }

    if (!validate()) return;

    setSaving(true);
    try {
      const docRef = doc(db, "users", currentUser.uid);
      await setDoc(docRef, {
        name: name.trim(),
        telefono: phone.trim(),
        direccion: address.trim(),
        updatedAt: new Date().toISOString(),
        role: "donor", // Aseguramos el rol si es autocreación
      }, { merge: true });

      toast.success("¡Perfil actualizado con éxito!");
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error("Hubo un problema al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.card}>
        <div className="h-7 w-2/5 bg-surface-container-high rounded-lg animate-pulse mb-8"></div>
        <div className="h-12 w-full bg-surface-container-high rounded-lg animate-pulse mb-5"></div>
        <div className="h-12 w-full bg-surface-container-high rounded-lg animate-pulse mb-5"></div>
        <div className="h-12 w-full bg-surface-container-high rounded-lg animate-pulse mb-5"></div>
        <div className="h-13 w-full bg-surface-container-high rounded-lg animate-pulse mt-4"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className={styles.card}>
        <p>Por favor, inicia sesión para ver tu perfil.</p>
      </div>
    );
  }

  return (
    <div className={`${styles.card} overflow-hidden`}>
      <h2 className={styles.cardTitle}>
        <UserIcon size={24} /> Mi Perfil
      </h2>

      <div className="flex items-center gap-4 mb-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
        <div className="relative">
          {currentUser?.photoURL ? (
            <img src={currentUser.photoURL} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-primary object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
              {name.charAt(0) || currentUser?.displayName?.charAt(0) || "U"}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success border-2 border-surface rounded-full"></div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-on-surface font-bold text-lg truncate">{name || "Usuario Lumera"}</p>
          <p className="text-on-surface-variant text-sm truncate">{currentUser?.email}</p>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Nombre Completo</label>
        <div className={styles.inputWrapper}>
          <UserIcon size={18} className={styles.inputIcon} />
          <input
            className={styles.input}
            placeholder="Ej. Juan Pérez"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Teléfono de Contacto</label>
        <div className={styles.inputWrapper}>
          <Phone size={18} className={styles.inputIcon} />
          <input
            className={styles.input}
            placeholder="Ej. +57 300 123 4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={saving}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Dirección de Recogida</label>
        <div className={styles.inputWrapper}>
          <MapPin size={18} className={styles.inputIcon} />
          <input
            className={styles.input}
            placeholder="Calle 123 #45-67"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={saving}
          />
        </div>
      </div>

      <button 
        className={styles.saveButton} 
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Guardando...
          </>
        ) : (
          <>
            <Save size={20} />
            Guardar Cambios
          </>
        )}
      </button>
    </div>
  );
}
