import { z } from 'zod';

export const criarAtendimentoSchema = z.object({
  temaId: z.string().min(1, 'Selecione um tema'),
  assuntoId: z.string().min(1, 'Selecione um assunto'),
  mensagem: z.string().min(1, 'Escreva sua mensagem'),
});

export type CriarAtendimentoFormSchema = z.infer<typeof criarAtendimentoSchema>;
