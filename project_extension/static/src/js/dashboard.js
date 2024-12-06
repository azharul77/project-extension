odoo.define("project_extension.Dashboard", function (require) {
    "use strict";
    var core = require('web.core');
    var QWeb = core.qweb;
    var web_client = require('web.web_client');
    var session = require('web.session');
    var ajax = require('web.ajax');
    var _t = core._t;
    var rpc = require('web.rpc');
    var self = this;
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
         var self = this;
         
         
     },
 
        willStart: function(){
            var self = this;
            return this._super()
        },
       
        render_dashboards: function() {
            var self = this;
            // this.fetch_data()
            var templates = []
            var templates = ['project_template_dashboard'];
            _.each(templates, function(template) {
                self.$('.o_hr_dashboard').append(QWeb.render(template, {widget: self}))
                
            });
           
            
        },
        

       
        

        fetch_data: function() {
            var self = this
 //          fetch data to the tiles
            var def1 = this._rpc({
                model: 'project.dashboard',
                method: "get_model_data",
            })
            .then(function (result) {
                $('#all_task').append('<span>' + result.all_task + '</span>');
                $('#last_week_task').append('<span>' + result.last_week_task + '</span>');
                $('#this_week_task').append('<span>' + result.this_week_task + '</span>');
                $('#this_month_task').append('<span>' + result.this_month_task + '</span>');
                $('#last_month_task').append('<span>' + result.last_month_task + '</span>');
            });
        },
        bind_click_event: function () {
            var self = this;

            // Use arrow functions to preserve the 'this' context
            this.$('#view_all_task').click((ev) => this.all_task(ev));
        },

        all_task: function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
        
            this.do_action({
                name: "All Project",
                type: 'ir.actions.act_window',
                res_model: 'project.task',
                view_mode: 'list,form',
                views: [
                    [false, 'list'],
                    [false, 'form']
                ],
                target: 'current',
            });
        },
        
    });

    core.action_registry.add('project_extension', DashBoard);
    return DashBoard;
 });