export type TipoNotificacao = { id: number };

export type Notificacao = {
  id: number;
  criacao: string;
  visualizada: boolean;
  tipoNotificacao: TipoNotificacao;
  aviso?: { id: number; titulo: string; mensagem: string };
  solicitacao?: { id: number; requerimento?: { nome: string; descricao: string }; status?: { id: number; nome: string } };
  atendimento?: { id: number; assunto: { nome: string; tema: { nome: string } } };
};

export type Aviso = {
  id: number;
  titulo: string;
  mensagem: string;
};
