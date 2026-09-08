export type Mensalidade = {
  financeiroId: number;
  competencia: string;
  dataVencimento: string;
  dataPagamento?: string;
  valorOriginal: number;
  valorAteVencimento: number;
  status: { id: number; nome: string };
  isWaeCobranca?: boolean;
};

export type PixWae = {
  PixQrCode: string;
  URL: string;
};

export type PixErp = {
  key?: string;
  qrCodeUrl?: string;
};

export type MeioPagamento = {
  MeioPagamento: number;
  MeioPagamentoDescricao: string;
};

export type CardPayload = {
  number: string;
  holderName: string;
  dueAt: string;
  cvv: string;
};
