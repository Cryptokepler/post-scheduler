'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { api, Post, Stats } from '@/lib/api';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [upcoming, setUpcoming] = useState<Post[]>([]);

  useEffect(() => {
    api.getStats().then(setStats).catch(console.error);
    api.getPosts('scheduled').then(posts => setUpcoming(posts.slice(0, 3))).catch(console.error);
  }, []);

  const kpis = stats ? [
    { label: 'Programados', value: stats.totalScheduled, icon: '📅', color: 'bg-orange-50 text-orange-600' },
    { label: 'Publicados Hoy', value: stats.publishedToday, icon: '✅', color: 'bg-green-50 text-green-600' },
    { label: 'Esta Semana', value: stats.upcomingWeek, icon: '📆', color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Publicados', value: stats.totalPublished, icon: '📊', color: 'bg-purple-50 text-purple-600' },
  ] : [];

  return (
    <AppLayout>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Resumen de tu actividad</p>
          </div>
          <Link href="/new" className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
            ➕ Nuevo Post
          </Link>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {kpis.map(kpi => (
              <div key={kpi.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${kpi.color} mb-3`}>
                  <span className="text-lg">{kpi.icon}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                <div className="text-sm text-gray-500">{kpi.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Próximos Posts</h2>
          {upcoming.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No hay posts programados</p>
          ) : (
            <div className="space-y-4">
              {upcoming.map(post => {
                const images = JSON.parse(post.images);
                return (
                  <div key={post.id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:border-orange-200 transition-colors">
                    <img src={api.imageUrl(images[0])} alt="" className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{post.caption || 'Sin caption'}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        📅 {new Date(post.scheduledAt).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">Programado</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
