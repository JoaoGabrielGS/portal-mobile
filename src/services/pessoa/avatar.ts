import { api } from '@/services/api';

export const uploadAvatar = async (formData: FormData) => {
  const { data } = await api.post<string>('/pessoa/upload-avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const removeAvatar = async () => {
  await api.delete('/pessoa/avatar');
};
