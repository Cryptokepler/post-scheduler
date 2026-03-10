'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { api, Account } from '@/lib/api';

export default function SettingsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  useEffect(() => { api.getAccounts().then(setAccounts).catch(console.error); }, []);

  return (
    <AppLayout>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Configuración</h1>
        <p className="text-gray-500 mb-8">Gestiona tus cuentas y preferencias</p>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cuentas Conectadas</h2>
          {accounts.length === 0 ? (
            <p className="text-gray-400">No hay cuentas conectadas</p>
          ) : (
            <div className="space-y-3">
              {accounts.map(a => (
                <div key={a.id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {a.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">@{a.username}</p>
                    <p className="text-sm text-gray-500">{a.name}</p>
                  </div>
                  {a.isDefault ? (
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">Principal</span>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Zona Horaria</h2>
          <select value={timezone} onChange={e => setTimezone(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white">
            {Intl.supportedValuesOf('timeZone').map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
      </div>
    </AppLayout>
  );
}
