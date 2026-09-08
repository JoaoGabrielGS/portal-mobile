import { z } from 'zod';

export const minhaContaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  telefone: z.string().min(1, 'Telefone é obrigatório'),
});

export type MinhaContaFormSchema = z.infer<typeof minhaContaSchema>;
