'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { api, Post } from '@/lib/api';

const statusColors: Record<string, string> = {
  scheduled: 'bg-orange-400',
  published: 'bg-green-400',
  error: 'bg-red-400',
  publishing: 'bg-blue-400',
};

export default function CalendarPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => { api.getPosts().then(setPosts).catch(console.error); }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });

  const getPostsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return posts.filter(p => {
      const d = p.scheduledAt || p.publishedAt || p.createdAt;
      return d && d.startsWith(dateStr);
    });
  };

  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  return (
    <AppLayout>
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Calendario</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-2 hover:bg-gray-100 rounded-lg text-lg">←</button>
            <span className="text-lg font-semibold capitalize">{monthName}</span>
            <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-2 hover:bg-gray-100 rounded-lg text-lg">→</button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-7">
            {days.map(d => (
              <div key={d} className="p-3 text-center text-sm font-medium text-gray-500 border-b border-gray-100">{d}</div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="p-3 min-h-[100px] border-b border-r border-gray-50" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayPosts = getPostsForDay(day);
              const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
              return (
                <div key={day} className={`p-2 min-h-[100px] border-b border-r border-gray-50 ${isToday ? 'bg-orange-50' : ''}`}>
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-orange-600' : 'text-gray-700'}`}>{day}</div>
                  {dayPosts.map(p => (
                    <div key={p.id} className={`${statusColors[p.status] || 'bg-gray-400'} text-white text-xs px-1.5 py-0.5 rounded mb-1 truncate`}>
                      {p.caption ? p.caption.slice(0, 20) : 'Post'}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-400" /> Programado</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-400" /> Publicado</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-400" /> Error</span>
        </div>
      </div>
    </AppLayout>
  );
}
