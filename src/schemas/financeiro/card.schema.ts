import { z } from 'zod';

export const cardSchema = z.object({
  number: z.string().min(1, 'O número do cartão é obrigatório.'),
  holderName: z.string().min(1, 'O nome do titular é obrigatório.'),
  dueAt: z.string().length(4, 'Formato deve ser MM/AA'),
  cvv: z.string().length(3, 'O CVV deve ter 3 dígitos.'),
  meioPagamento: z.number().optional(),
});

export const cardSchemaWae = cardSchema.extend({
  meioPagamento: z.number({ message: 'Campo obrigatório' }).min(1, 'Campo obrigatório'),
});

export type CardFormSchema = z.infer<typeof cardSchema>;
