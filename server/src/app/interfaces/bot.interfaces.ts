export interface NewDbBot {
  token: string;
  username: string;
  rule_ids: number[];
  date_added: Date;
  first_name: string;
  can_join_groups: boolean;
  can_read_all_group_messages: boolean;
  supports_inline_queries: boolean;
  can_connect_to_business: boolean;
  has_main_web_app: boolean;
  last_update_id: number;
}

export interface DbBot extends NewDbBot {
  id: number;
}

export type UpdateDbBot = Partial<NewDbBot>;

export interface CreateBotApi {
  token: string;
}

export interface GetBotApi {
  id: number;
  token: string;
  username: string;
  ruleIds: number[];
  dateAdded: Date;
  firstName: string;
  canJoinGroups: boolean;
  canReadAllGroupMessages: boolean;
  supportsInlineQueries: boolean;
  canConnectToBusiness: boolean;
  hasMainWebApp: boolean;
  lastUpdateId: number;
}

export interface UpdateBotApi {
  id?: number;
  ruleIds?: number[];
  lastUpdateId?: number;
}
