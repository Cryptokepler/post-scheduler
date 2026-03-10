'use client';
import { useState, useRef, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { api, Account } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function NewPostPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [accountId, setAccountId] = useState('usdtcapital');
  const [postType, setPostType] = useState<'feed' | 'story'>('feed');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => { api.getAccounts().then(setAccounts).catch(console.error); }, []);

  const handleFiles = (newFiles: FileList | File[]) => {
    let arr = Array.from(newFiles).filter(f => f.type.startsWith('image/'));
    if (postType === 'story') { arr = [arr[0]]; setFiles([]); setPreviews([]); }
    setFiles(prev => [...prev, ...arr]);
    arr.forEach(f => {
      const reader = new FileReader();
      reader.onload = e => setPreviews(prev => [...prev, e.target!.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const removeImage = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const moveImage = (idx: number, dir: number) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= files.length) return;
    const nf = [...files]; [nf[idx], nf[newIdx]] = [nf[newIdx], nf[idx]];
    const np = [...previews]; [np[idx], np[newIdx]] = [np[newIdx], np[idx]];
    setFiles(nf); setPreviews(np);
  };

  const submit = async (publishNow: boolean) => {
    if (!files.length) return alert('Sube al menos una imagen');
    if (!publishNow && (!date || !time)) return alert('Selecciona fecha y hora para programar');
    setLoading(true);
    try {
      const formData = new FormData();
      files.forEach(f => formData.append('images', f));
      formData.append('caption', caption);
      formData.append('hashtags', hashtags);
      formData.append('accountId', accountId);
      formData.append('postType', postType);
      if (!publishNow && date && time) formData.append('scheduledAt', new Date(`${date}T${time}`).toISOString());
      const post = await api.createPost(formData);
      if (publishNow) await api.publishNow(post.id);
      router.push(publishNow ? '/history' : '/scheduled');
    } catch (e: unknown) {
      alert('Error: ' + (e instanceof Error ? e.message : String(e)));
    } finally { setLoading(false); }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Nuevo Post</h1>
        <p className="text-gray-500 mb-6">Crea y programa un nuevo post de Instagram</p>

        {/* Post Type Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
          <button onClick={() => setPostType('feed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${postType === 'feed' ? 'bg-white shadow text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}>
            📸 Feed
          </button>
          <button onClick={() => { setPostType('story'); if (files.length > 1) { setFiles([files[0]]); setPreviews([previews[0]]); } }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${postType === 'story' ? 'bg-white shadow text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}>
            📱 Story
          </button>
        </div>

        <div className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors mb-6 ${dragOver ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-400'}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => fileRef.current?.click()}>
          <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={e => e.target.files && handleFiles(e.target.files)} />
          <div className="text-4xl mb-2">🖼️</div>
          <p className="text-gray-600 font-medium">Arrastra imágenes aquí o haz clic para seleccionar</p>
          <p className="text-sm text-gray-400 mt-1">{postType === 'feed' ? 'Múltiples imágenes para carrusel' : 'Una imagen para tu Story (9:16 recomendado)'}</p>
        </div>

        {previews.length > 0 && (
          <div className="flex gap-3 mb-6 flex-wrap">
            {previews.map((src, idx) => (
              <div key={idx} className="relative group">
                <img src={src} alt="" className="w-24 h-24 rounded-lg object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                  {idx > 0 && <button onClick={() => moveImage(idx, -1)} className="text-white text-xs bg-black/50 rounded px-1">←</button>}
                  <button onClick={() => removeImage(idx)} className="text-white text-xs bg-red-500 rounded px-1">✕</button>
                  {idx < previews.length - 1 && <button onClick={() => moveImage(idx, 1)} className="text-white text-xs bg-black/50 rounded px-1">→</button>}
                </div>
              </div>
            ))}
          </div>
        )}

        {postType === 'feed' && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
              <textarea value={caption} onChange={e => setCaption(e.target.value)} rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
                placeholder="Escribe el caption de tu post..." maxLength={2200} />
              <p className="text-xs text-gray-400 text-right">{caption.length}/2200</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hashtags</label>
              <input value={hashtags} onChange={e => setHashtags(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="#instagram #marketing #socialmedia" />
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Cuenta</label>
          <select value={accountId} onChange={e => setAccountId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white">
            {accounts.map(a => <option key={a.id} value={a.id}>@{a.username} — {a.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none" />
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={() => submit(false)} disabled={loading}
            className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-lg transition-colors">
            {loading ? 'Procesando...' : '📅 Programar'}
          </button>
          <button onClick={() => submit(true)} disabled={loading}
            className="flex-1 py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors">
            {loading ? 'Publicando...' : '🚀 Publicar Ahora'}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
