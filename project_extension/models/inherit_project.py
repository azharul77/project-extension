from odoo import api, fields, models, _

class ProjectTeam(models.Model):
    _name = 'project.team'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    name = fields.Char('Team Name', required=True)
    members = fields.Many2many('res.users', string='Members')

class Project(models.Model):
    _inherit = 'project.project'

    team_id = fields.Many2one('project.team', string='Project Team')