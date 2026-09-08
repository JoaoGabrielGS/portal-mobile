export type Tema = { id: number; nome: string };
export type Assunto = { id: number; nome: string; tema: Tema };

export type Status = { id: number; nome: string };

export type Atendimento = {
  id: number;
  protocolo: string;
  assunto: Assunto;
  status: Status;
  dataAbertura: string;
  avaliacao?: number;
};

export type ArquivoLink = {
  mensagemLink: string;
};

export type Mensagem = {
  id: number;
  texto: string;
  dataAbertura: string;
  origemUsuario: boolean;
  mensagemAutomatica?: boolean;
  arquivoLink?: ArquivoLink;
  arquivoLinks?: ArquivoLink[];
};

export type MensagemGrupo = {
  data: string;
  mensagens: Mensagem[];
};
