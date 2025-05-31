import { diContainer } from 'app/core/di-container';
import { EventBus } from 'app/core/event-bus';
import { Logger } from 'app/core/logger';
import { EventName } from 'app/interfaces/event-bus.interfaces';
import { DayOfWeek, Rule } from 'app/interfaces/rule.interfaces';
import schedule, { Job, RecurrenceRule } from 'node-schedule';
import { RulesService } from './rules.service';
import { BotsService } from './bots.service';
import { ChatsService } from './chats.service';
import { Bot } from 'app/interfaces/bot.interfaces';
import { TelegramService } from './telegram.service';

export class ScheduleMessagesService {
  private jobs = new Map<string, Job>();

  constructor(
    private rulesService: RulesService,
    private logger: Logger,
    private eventBus: EventBus,
    private botsService: BotsService,
    private chatsService: ChatsService,
    private telegramService: TelegramService,
  ) {
    this.eventBus.subscribe(EventName.added_rules_to_bot, async ({ ruleIds, botId }) => {
      const rules = await this.rulesService.getRules({ ids: ruleIds });
      const [bot] = await this.botsService.getBots({ ids: [botId] });

      if (bot) {
        for (const rule of rules) {
          this.scheduleMessage(rule, bot);
        }
      }
    });
    this.eventBus.subscribe(EventName.removed_rules_from_bot, async ({ ruleIds, botId }) => {
      for (const ruleId of ruleIds) {
        const jobId = this.getJobId(ruleId, botId);
        this.cancelScheduledMessage(jobId);
      } 
    });
    this.eventBus.subscribe(EventName.updated_rule_in_bot, async ({ rule, botId }) => {
      const jobId = this.getJobId(rule.id, botId);
      this.cancelScheduledMessage(jobId);

      const [bot] = await this.botsService.getBots({ ids: [botId] });
      if (bot) {
        this.scheduleMessage(rule, bot);
      }
    });
    this.initScheduleMessages();
  }

  private async initScheduleMessages(): Promise<void> {
    const bots = await this.botsService.getBots({});
    for (const bot of bots) {
      for (const ruleId of bot.ruleIds) {
        const [rule] = await this.rulesService.getRules({ ids: [ruleId] });
        if (rule && rule.condition.type === 'schedule') {
          this.scheduleMessage(rule, bot);
        }
      }
    }
  }

  private scheduleMessage(rule: Rule, bot: Bot): void {
    const scheduleRule = this.getScheduleRule(rule);
    if (rule.condition.type === 'schedule' && rule.condition.scheduleChatIds.length) {
      const job = schedule.scheduleJob(scheduleRule, async () => {
        if (rule.condition.type === 'schedule') {
          const chats = await this.chatsService.getChats({ ids: rule.condition.scheduleChatIds });
          for (const chat of chats) {
            const chatId = Number(chat?.chatId);
            try {
              await this.telegramService.sendMessageResponse(rule.response, bot.token, chatId);
            } catch(err) {
              this.logger.errorLog(`Error then send schedule message: ${JSON.stringify(err)}`);
            }
          }
        } else {
          this.logger.errorLog(`Rule: ${rule.name} with not schedule condition type: ${rule.condition.type}`);
        }
      });
  
      const jobId = this.getJobId(rule.id, bot.id);
      this.jobs.set(jobId, job);
      this.logger.infoLog(`Job with id: ${jobId} scheduled on time: ${job.nextInvocation()}`);
    }
  }

  private getScheduleRule(rule: Rule): RecurrenceRule {
    const scheduleRule = new schedule.RecurrenceRule();

    if (rule.condition.type === 'schedule' && rule.condition.schedule.type === 'weekly') {
      scheduleRule.dayOfWeek = this.getDayOfWeekIndex(rule.condition.schedule.dayOfWeek);
      scheduleRule.hour = rule.condition.schedule.hour;
      scheduleRule.minute = rule.condition.schedule.minute;
    }

    if (rule.condition.type === 'schedule' && rule.condition.schedule.type === 'annually') {
      scheduleRule.month = rule.condition.schedule.month;
      scheduleRule.date = rule.condition.schedule.day;
      scheduleRule.hour = rule.condition.schedule.hour;
      scheduleRule.minute = rule.condition.schedule.minute;
    }
    console.log('scheduleRule: ', JSON.stringify(scheduleRule));
    return scheduleRule;
  }

  private getDayOfWeekIndex(dayOfWeek: DayOfWeek): number {
    switch (dayOfWeek) {
      case 'monday': return 1;
      case 'tuesday': return 2;
      case 'wednesday': return 3;
      case 'thursday': return 4;
      case 'friday': return 5;
      case 'saturday': return 6;
      case 'sunday': return 0;
    }
  }

  private getJobId(ruleId: number, botId: number): string {
    return `${botId}_${ruleId}`;
  }

  private cancelScheduledMessage(id: string): void {
    const job = this.jobs.get(id);
    if (job) {
      job.cancel();
      this.jobs.delete(id);
      this.logger.infoLog(`Schedule job with id: ${id} deleted`);
    }
  }

  private shutdown(): void {
    schedule.gracefulShutdown();
    this.jobs.clear();
  }
}

diContainer.registerDependencies(ScheduleMessagesService, [
  RulesService,
  Logger,
  EventBus,
  BotsService,
  ChatsService,
  TelegramService,
]);
