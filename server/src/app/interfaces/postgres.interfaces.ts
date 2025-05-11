export type CompareOperator = '=' | '>' | '>=' | '<=' | '<' | '<>';

export interface StringCondition {
  value: string;
  type: 'string';
}

export interface NumberCondition {
  value: number;
  type: 'number';
  operation: CompareOperator;
}

export interface BooleanCondition {
  value: boolean;
  type: 'boolean';
}

export interface ArrayCondition {
  value: unknown[];
  type: 'array';
}

export interface JsonCondition {
  value: object;
  type: 'json';
}

export type ConditionType = StringCondition | NumberCondition | BooleanCondition | ArrayCondition | JsonCondition;

export type Condition<T> = {
  columnName: keyof T;
} & ConditionType;

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