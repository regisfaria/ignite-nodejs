// import { Statement } from '../../entities/Statement';

// export type ICreateStatementDTO = Pick<
//   Statement,
//   'user_id' | 'description' | 'amount' | 'type'
// >;

export type IRepositoryCreateStatementDTO = {
  user_id: string;
  description: string;
  sender_id?: string;
  amount: number;
  type: OperationType;
};
