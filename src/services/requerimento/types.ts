export type SolicitacaoResumo = {
  id: number;
  requerimento?: { nome: string; descricao?: string };
  status: { id: number; nome: string };
  respostaVisualizada?: boolean | null;
};

export type ArquivoLink = {
  id: number;
  nome: string;
  etapaAnexoLink: string;
};

export type Etapa = {
  etapa: number;
  etapaAnexos: { arquivoLinks: ArquivoLink[] }[];
};

export type SolicitacaoDetalhe = {
  id: number;
  requerimento: { nome: string; descricao?: string };
  status: { id: number; nome: string };
  resposta?: string;
  dataAbertura?: string;
  slaSolicitacao?: number;
  etapas: Etapa[];
};

export type Devolutiva = {
  mensagem: string;
};
