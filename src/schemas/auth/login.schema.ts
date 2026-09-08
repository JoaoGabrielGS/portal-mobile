import { z } from 'zod';

export const loginSchema = z.object({
  login: z.string().min(1, 'Informe seu RA ou CPF'),
  senha: z.string().min(1, 'Informe sua senha'),
  nivel: z.union([z.literal(1), z.literal(2)]),
});

export type LoginFormSchema = z.infer<typeof loginSchema>;
