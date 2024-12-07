odoo.define("project_extension.Dashboard", function (require) {
    "use strict";
    
    var core = require('web.core');
    var QWeb = core.qweb;
    var AbstractAction = require('web.AbstractAction');
    
    var DashBoard = AbstractAction.extend({
        contentTemplate: 'project_template_dashboard',
        
        init: function(parent, context) {
            this._super(parent, context);
            this.dashboard_templates = ['project_template_dashboard'];
        },
        
        start: function () {
            var self = this;
            this.set("title", 'Dashboard');
            return this._super().then(function () {
                self.fetch_data();
                self.render_graphs();
                self.$el.parent().addClass('oe_background_grey');
                self.bind_click_event();
            });
        },

        render_graphs: function () {
            // Empty function for now, to be implemented if needed
        },

        render_dashboards: function() {
            var self = this;
            _.each(this.dashboard_templates, function(template) {
                self.$('.o_hr_dashboard').append(QWeb.render(template, {widget: self}));
            });
        },

        fetch_data: function() {
            var self = this;
            this._rpc({
                model: 'project.dashboard',
                method: "get_model_data",
            })
            .then(function (result) {
                // Dynamically update the task counts
                self.update_task_count('#all_task', result.all_task);
                self.update_task_count('#last_week_task', result.last_week_task);
                self.update_task_count('#this_week_task', result.this_week_task);
                self.update_task_count('#this_month_task', result.this_month_task);
                self.update_task_count('#last_month_task', result.last_month_task);
            });
        },

        update_task_count: function(elementId, taskCount) {
            $(elementId).append('<span>' + taskCount + '</span>');
        },

        bind_click_event: function () {
            var self = this;
            this.$('#view_all_task').click((ev) => self.all_task(ev));
            this.$('#view_all_this_week_task').click((ev) => self.all_this_week_task(ev));
            this.$('#view_all_this_month_task').click((ev) => self.all_this_month_task(ev));
            this.$('#view_all_last_week_task').click((ev) => self.all_last_week_task(ev));
            this.$('#view_all_last_month_task').click((ev) => self.all_last_month_task(ev));
        },

        // Common method to calculate date range and perform action
        get_date_range: function(period) {
            var currentDatetime = new Date();
            var startDate, endDate;

            switch(period) {
                case 'this_week':
                    startDate = new Date(currentDatetime);
                    startDate.setDate(currentDatetime.getDate() - currentDatetime.getDay()); // Sunday
                    endDate = new Date(startDate);
                    endDate.setDate(startDate.getDate() + 6); // Saturday
                    break;
                case 'last_week':
                    startDate = new Date(currentDatetime);
                    startDate.setDate(currentDatetime.getDate() - currentDatetime.getDay() - 7); // Last Sunday
                    endDate = new Date(startDate);
                    endDate.setDate(startDate.getDate() + 6); // Last Saturday
                    break;
                case 'this_month':
                    startDate = new Date(currentDatetime);
                    startDate.setDate(1); // First day of the month
                    endDate = new Date(startDate);
                    endDate.setMonth(startDate.getMonth() + 1); // Next month
                    endDate.setDate(0); // Last day of the month
                    break;
                case 'last_month':
                    startDate = new Date(currentDatetime);
                    startDate.setMonth(currentDatetime.getMonth() - 1); // Last month
                    startDate.setDate(1); // First day of last month
                    endDate = new Date(startDate);
                    endDate.setMonth(startDate.getMonth() + 1); // Next month
                    endDate.setDate(0); // Last day of last month
                    break;
            }

            startDate.setHours(0, 0, 0, 0); // Midnight
            endDate.setHours(23, 59, 59, 999); // End of day

            return [startDate, endDate];
        },

        // Common method to handle task view actions
        open_task_view: function(domain, name) {
            this.do_action({
                name: name,
                type: 'ir.actions.act_window',
                res_model: 'project.task',
                view_mode: 'list,form',
                views: [
                    [false, 'list'],
                    [false, 'form']
                ],
                target: 'current',
                domain: domain
            });
        },

        // Task view actions for different periods
        all_task: function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
            this.open_task_view([], "All Project");
        },

        all_this_week_task: function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
            var [startOfWeek, endOfWeek] = this.get_date_range('this_week');
            var domain = [['create_date', '>=', startOfWeek.toISOString()], ['create_date', '<=', endOfWeek.toISOString()]];
            this.open_task_view(domain, "This Week Tasks");
        },

        all_this_month_task: function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
            var [startOfMonth, endOfMonth] = this.get_date_range('this_month');
            var domain = [['create_date', '>=', startOfMonth.toISOString()], ['create_date', '<=', endOfMonth.toISOString()]];
            this.open_task_view(domain, "This Month Tasks");
        },

        all_last_week_task: function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
            var [startOfLastWeek, endOfLastWeek] = this.get_date_range('last_week');
            var domain = [['create_date', '>=', startOfLastWeek.toISOString()], ['create_date', '<=', endOfLastWeek.toISOString()]];
            this.open_task_view(domain, "Last Week Tasks");
        },

        all_last_month_task: function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
            var [startOfLastMonth, endOfLastMonth] = this.get_date_range('last_month');
            var domain = [['create_date', '>=', startOfLastMonth.toISOString()], ['create_date', '<=', endOfLastMonth.toISOString()]];
            this.open_task_view(domain, "Last Month Tasks");
        },
        
    });

    core.action_registry.add('project_extension', DashBoard);
    return DashBoard;
});
