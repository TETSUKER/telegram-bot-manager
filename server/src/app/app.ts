import { diContainer } from 'app/core/di-container';
import { Http } from 'app/core/http';
import { Routes } from 'app/routes/routes';
import { Router } from 'app/core/router';
import { ScheduleMessagesService } from './services/schedule-messages.service';
import { UpdatesService } from './services/updates.service';

export class App {
  constructor(
    private http: Http,
    private router: Router,
    private routes: Routes,
    private updatesService: UpdatesService,
    private scheduleMessagesService: ScheduleMessagesService
  ) {}

  start() {
    this.http.listen(() => {
      this.routes.registerRoutes();
      this.http.setRoutes(this.router.getRoutes());
    });
  }
}

diContainer.registerDependencies(App, [
  Http,
  Router,
  Routes,
  UpdatesService,
  ScheduleMessagesService,
]);
