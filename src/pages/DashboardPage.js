import { BasePage } from './BasePage.js';

export class DashboardPage extends BasePage {
    constructor(page, logger) {
        super(page, logger);

        this.dashboardSelector = '.oxd-topbar-header-title h6'; // Selector pentru dashboard
    }

    async isDashboardVisible() {
        this.log.info(`Checking if the dashboard is visible ...`, { page: this.pageName } );
        return await this.isElementVisible(this.dashboardSelector);
    }
}
