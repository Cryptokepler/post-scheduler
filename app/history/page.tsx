'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { api, Post } from '@/lib/api';

export default function HistoryPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.getPosts('published').then(setPosts).finally(() => setLoading(false)); }, []);

  return (
    <AppLayout>
      <div className="max-w-5xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Historial</h1>
        <p className="text-gray-500 mb-8">Posts publicados</p>

        {loading ? <p className="text-gray-400">Cargando...</p> : posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">📭</div>
            <p>No hay posts publicados aún</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => {
              const images = JSON.parse(post.images);
              return (
                <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <img src={api.imageUrl(images[0])} alt="" className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <p className="text-sm text-gray-900 line-clamp-2">{post.caption || 'Sin caption'}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
                      </span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">✅ Publicado</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
