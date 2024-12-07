from odoo.tests.common import TransactionCase
from datetime import datetime, timedelta
import calendar

class TestProjectDashboard(TransactionCase):
    def setUp(self):
        super(TestProjectDashboard, self).setUp()

        # Set up test data
        self.task_model = self.env['project.task']
        self.dashboard_model = self.env['project.dashboard']

        self.stage_completed = self.env['project.task.type'].create({'name': 'Completed'})
        self.stage_in_progress = self.env['project.task.type'].create({'name': 'In Progress'})

        now = datetime.now()

        # Last week
        start_of_last_week = now - timedelta(days=now.weekday() + 7)
        self.task_model.create({
            'name': 'Task Last Week',
            'create_date': start_of_last_week,
            'stage_id': self.stage_in_progress.id,
        })

        # This week
        start_of_week = now - timedelta(days=now.weekday())
        self.task_model.create({
            'name': 'Task This Week',
            'create_date': start_of_week,
            'stage_id': self.stage_in_progress.id,
        })

        # This month
        start_of_month = now.replace(day=1)
        self.task_model.create({
            'name': 'Task This Month',
            'create_date': start_of_month,
            'stage_id': self.stage_in_progress.id,
        })

        # Last month
        start_of_last_month = (start_of_month - timedelta(days=1)).replace(day=1)
        last_day_of_last_month = calendar.monthrange(
            start_of_last_month.year, start_of_last_month.month
        )[1]
        self.task_model.create({
            'name': 'Task Last Month',
            'create_date': start_of_last_month,
            'stage_id': self.stage_in_progress.id,
        })

        self.task_model.create({
            'name': 'Completed Task',
            'create_date': start_of_week,
            'stage_id': self.stage_completed.id,
        })

    def test_get_model_data(self):
        dashboard_data = self.dashboard_model.get_model_data()

        # Assert results
        self.assertEqual(dashboard_data['all_task'], 4, "Incorrect count for all tasks excluding completed.")
        self.assertEqual(dashboard_data['last_week_task'], 1, "Incorrect count for tasks created last week.")
        self.assertEqual(dashboard_data['this_week_task'], 1, "Incorrect count for tasks created this week.")
        self.assertEqual(dashboard_data['this_month_task'], 2, "Incorrect count for tasks created this month.")
        self.assertEqual(dashboard_data['last_month_task'], 1, "Incorrect count for tasks created last month.")
