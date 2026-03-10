const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://srv1378488.hstgr.cloud/scheduler-api';

export interface Post {
  id: number;
  caption: string;
  hashtags: string;
  scheduledAt: string;
  status: string;
  accountId: string;
  images: string;
  igMediaId: string | null;
  igPermalink: string | null;
  error: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  name: string;
  igUserId: string;
  username: string;
  profilePic: string | null;
  isDefault: number;
}

export interface Stats {
  totalScheduled: number;
  publishedToday: number;
  upcomingWeek: number;
  totalPublished: number;
  errors: number;
}

export const api = {
  async health() {
    const res = await fetch(`${API_URL}/api/health`);
    return res.json();
  },
  async getStats(): Promise<Stats> {
    const res = await fetch(`${API_URL}/api/stats`);
    return res.json();
  },
  async getPosts(status?: string): Promise<Post[]> {
    const url = status ? `${API_URL}/api/posts?status=${status}` : `${API_URL}/api/posts`;
    const res = await fetch(url);
    return res.json();
  },
  async getPost(id: number): Promise<Post> {
    const res = await fetch(`${API_URL}/api/posts/${id}`);
    return res.json();
  },
  async createPost(formData: FormData): Promise<Post> {
    const res = await fetch(`${API_URL}/api/posts`, { method: 'POST', body: formData });
    return res.json();
  },
  async updatePost(id: number, data: Partial<Post>): Promise<Post> {
    const res = await fetch(`${API_URL}/api/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  async deletePost(id: number): Promise<void> {
    await fetch(`${API_URL}/api/posts/${id}`, { method: 'DELETE' });
  },
  async publishNow(id: number): Promise<{ success: boolean; mediaId?: string; error?: string }> {
    const res = await fetch(`${API_URL}/api/posts/${id}/publish-now`, { method: 'POST' });
    return res.json();
  },
  async getAccounts(): Promise<Account[]> {
    const res = await fetch(`${API_URL}/api/accounts`);
    return res.json();
  },
  imageUrl(filename: string): string {
    return `${API_URL}/uploads/${filename}`;
  }
};
