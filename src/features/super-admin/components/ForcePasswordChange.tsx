import { useState } from 'react';
import { auth, db } from '../../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { Shield, Eye, EyeOff, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { validPassword, passwordsMatch, differentPassword, required } from '../../../utils/validators';

interface ForcePasswordChangeProps {
  onComplete: () => void;
}

/**
 * Pantalla de cambio forzado de contraseña.
 * Se muestra cuando el super-admin inicia sesión con una clave genérica.
 *
 * Flujo:
 * 1. Usuario ingresa su contraseña actual (la genérica)
 * 2. Re-autentica con Firebase
 * 3. Ingresa y confirma la nueva contraseña
 * 4. Actualiza la contraseña en Firebase
 * 5. Marca como completado y redirige al dashboard
 */
export function ForcePasswordChange({ onComplete }: ForcePasswordChangeProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones con validators reutilizables
    const errors = [
      required(currentPassword, 'La contraseña actual'),
      currentPassword ? validPassword(newPassword) : null,
      newPassword ? passwordsMatch(newPassword, confirmPassword) : null,
      newPassword && currentPassword ? differentPassword(newPassword, currentPassword) : null,
    ].filter(Boolean) as string[];

    if (errors.length > 0) {
      setError(errors[0]);
      return;
    }

    const user = auth.currentUser;
    if (!user || !user.email) {
      setError('No hay sesión activa. Vuelve a iniciar sesión.');
      return;
    }

    setLoading(true);

    try {
      // Re-autenticar con la contraseña actual
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Actualizar contraseña
      await updatePassword(user, newPassword);

      // Marcar como completado en Firestore (persiste entre sesiones)
      // El campo passwordChange: true evita que se muestre de nuevo
      await updateDoc(doc(db, 'users', user.uid), {
        passwordChange: true,
      });

      setSuccess(true);

      // Redirigir al dashboard después de 1.5s
      setTimeout(() => {
        onComplete();
      }, 1500);
    } catch (err: any) {
      console.error('[ForcePasswordChange] Error:', err);

      if (err.code === 'auth/wrong-password') {
        setError('La contraseña actual no es correcta.');
      } else if (err.code === 'auth/weak-password') {
        setError('La nueva contraseña es muy débil. Usa al menos 6 caracteres.');
      } else if (err.code === 'auth/requires-recent-login') {
        setError('Debes volver a iniciar sesión para cambiar la contraseña.');
      } else {
        setError(err.message || 'Error al cambiar la contraseña.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-4">
        <div className="bg-surface-container-lowest rounded-3xl p-8 max-w-md w-full text-center shadow-xl border border-outline-variant">
          <div className="w-16 h-16 bg-success-container rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-success" />
          </div>
          <h2 className="text-xl font-bold text-on-surface mb-2">¡Contraseña actualizada!</h2>
          <p className="text-on-surface-variant text-sm">
          Tu contraseña ha sido cambiada exitosamente. Serás redirigido al panel de administración.
          </p>
          <div className="mt-6 flex justify-center">
            <Loader size={20} className="text-primary animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-3xl p-8 max-w-md w-full shadow-xl border border-outline-variant">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface">Cambio de contraseña requerido</h1>
          <p className="text-sm text-on-surface-variant mt-2">
            Has iniciado sesión con una clave genérica. Por seguridad, debes crear una contraseña personalizada antes de continuar.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-error-container text-on-error-container mb-6 border border-error-container">
            <AlertCircle size={18} className="text-error shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Contraseña actual */}
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1.5">
              Contraseña actual
            </label>
            <div className="relative">
              <input
                type={showPasswords ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Ingresa la contraseña actual"
                className="w-full px-4 py-3 pr-12 bg-surface text-on-surface border border-outline-variant rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition cursor-pointer p-1"
                tabIndex={-1}
                aria-label={showPasswords ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Nueva contraseña */}
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1.5">
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                type={showPasswords ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 pr-12 bg-surface text-on-surface border border-outline-variant rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition cursor-pointer p-1"
                tabIndex={-1}
                aria-label={showPasswords ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1.5">
              Confirmar nueva contraseña
            </label>
            <div className="relative">
              <input
                type={showPasswords ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la nueva contraseña"
                className="w-full px-4 py-3 pr-12 bg-surface text-on-surface border border-outline-variant rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition cursor-pointer p-1"
                tabIndex={-1}
                aria-label={showPasswords ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-on-primary rounded-xl font-semibold hover:bg-primary-container hover:text-on-primary transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size={18} className="animate-spin" />
                Cambiando...
              </>
            ) : (
              'Cambiar contraseña'
            )}
          </button>
        </form>

        <p className="text-xs text-on-surface-variant text-center mt-6">
          Una vez cambiada la contraseña, serás redirigido al panel de administración.
        </p>
      </div>
    </div>
  );
}
