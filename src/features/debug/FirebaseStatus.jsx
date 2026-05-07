import React, { useState, useEffect } from 'react';
import { validateFirebaseConnection } from '../../services/firebaseConnectionService';

export const FirebaseStatus = () => {
  const [status, setStatus] = useState({
    loading: true,
    success: false,
    message: '',
    error: '',
    warning: ''
  });

  const checkConnection = async () => {
    setStatus(prev => ({ ...prev, loading: true }));
    const result = await validateFirebaseConnection();
    setStatus({
      loading: false,
      success: result.success,
      message: result.message,
      error: result.error || '',
      warning: result.warning || ''
    });
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 border border-gray-200 mt-10">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Estado de Firebase</h2>
        <button 
          onClick={checkConnection}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          disabled={status.loading}
        >
          {status.loading ? 'Verificando...' : 'Reintentar'}
        </button>
      </div>

      {status.loading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className={`p-3 rounded-lg flex items-start space-x-2 ${status.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <span className={`text-xl ${status.success ? 'text-green-500' : 'text-red-500'}`}>
              {status.success ? '✅' : '❌'}
            </span>
            <div>
              <p className={`font-semibold ${status.success ? 'text-green-800' : 'text-red-800'}`}>
                {status.message}
              </p>
              {status.error && (
                <p className="text-sm text-red-600 mt-1 font-mono">{status.error}</p>
              )}
            </div>
          </div>

          {status.warning && (
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <p className="text-sm text-yellow-700">
                <strong>Nota:</strong> {status.warning}
              </p>
            </div>
          )}

          <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
            Última verificación: {new Date().toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
};
