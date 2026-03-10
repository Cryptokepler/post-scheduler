'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { api, Post } from '@/lib/api';

export default function ScheduledPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => { api.getPosts('scheduled').then(setPosts).finally(() => setLoading(false)); };
  useEffect(load, []);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este post programado?')) return;
    await api.deletePost(id);
    load();
  };

  const handlePublish = async (id: number) => {
    if (!confirm('¿Publicar ahora?')) return;
    await api.publishNow(id);
    load();
  };

  return (
    <AppLayout>
      <div className="max-w-5xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Posts Programados</h1>
        <p className="text-gray-500 mb-8">Todos tus posts pendientes de publicación</p>

        {loading ? <p className="text-gray-400">Cargando...</p> : posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">📭</div>
            <p>No hay posts programados</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map(post => {
              const images = JSON.parse(post.images);
              return (
                <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
                  <img src={api.imageUrl(images[0])} alt="" className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate font-medium">{post.caption || 'Sin caption'}</p>
                    {post.hashtags && <p className="text-xs text-blue-500 truncate">{post.hashtags}</p>}
                    <p className="text-xs text-gray-500 mt-1">📅 {new Date(post.scheduledAt).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handlePublish(post.id)} className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-lg">🚀 Publicar</button>
                    <button onClick={() => handleDelete(post.id)} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium rounded-lg">🗑️ Eliminar</button>
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
