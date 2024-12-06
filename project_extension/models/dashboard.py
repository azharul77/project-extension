from odoo import api, fields, models
from datetime import timedelta
import calendar  # For month calculations
import logging

_logger = logging.getLogger(__name__)

class BookingDashboard(models.Model): 
    _name = 'project.dashboard'    

    @api.model
    def get_model_data(self):
        now = fields.Datetime.now()

        # date range setup 
        start_of_week = now - timedelta(days=now.weekday(), hours=now.hour, minutes=now.minute, seconds=now.second)
        start_of_last_week = start_of_week - timedelta(weeks=1)
        end_of_last_week = start_of_week - timedelta(seconds=1)
        start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        start_of_last_month = (start_of_month - timedelta(days=1)).replace(day=1)
        last_day_of_last_month = calendar.monthrange(start_of_last_month.year, start_of_last_month.month)[1]
        end_of_last_month = start_of_last_month.replace(day=last_day_of_last_month, hour=23, minute=59, second=59)

        # --- Task Queries ---
        all_task = self.env['project.task'].search([('stage_id', '!=', 'completed_stage_id')])
        last_week_task = self.env['project.task'].search([
            ('create_date', '>=', start_of_last_week),
            ('create_date', '<=', end_of_last_week),
        ])
        this_week_task = self.env['project.task'].search([
            ('create_date', '>=', start_of_week),
        ])
        this_month_task = self.env['project.task'].search([
            ('create_date', '>=', start_of_month),
        ])
        last_month_task = self.env['project.task'].search([
            ('create_date', '>=', start_of_last_month),
            ('create_date', '<=', end_of_last_month),
        ])

        # --- Return Data ---
        return {
            'all_task': len(all_task),
            'last_week_task': len(last_week_task),
            'this_week_task': len(this_week_task),
            'this_month_task': len(this_month_task),
            'last_month_task': len(last_month_task),
        }
