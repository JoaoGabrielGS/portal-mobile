import { api } from '@/services/api';

export type Banner = {
  id: number;
  imagem: string;
  link?: string;
};

type PageResponse<T> = {
  content: T[];
};

export const getBanners = async () => {
  const { data } = await api.get<PageResponse<Banner> | Banner[]>('/banner', {
    params: { 'tipoBanner.id': 3 },
  });
  return Array.isArray(data) ? data : data?.content ?? [];
};
