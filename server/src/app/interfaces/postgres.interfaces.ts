export type CompareOperator = '=' | '>' | '>=' | '<=' | '<' | '<>';

export interface Condition<T> {
  columnName: keyof T;
  value: string | number | boolean;
  type: 'string' | 'json' | 'number' | 'boolean';
  operation?: CompareOperator;
}

export interface Column<T> {
  columnName: keyof T;
  type: 'serial' | 'varchar' | 'boolean' | 'timestamp' | 'text' | 'json' | 'int';
  length?: number;
  primary?: boolean;
  unique?: boolean;
  notNull?: boolean;
  isArray?: boolean;
}

export type LogicalOperator = 'and' | 'or';

export type TableName = 'bots' | 'rules' | 'chats' | 'jokes' | 'jokes_likes' | 'action_logs';