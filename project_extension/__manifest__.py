# -*- coding: utf-8 -*-
{
    'name': 'Project Extension',
    'summary': """This moduel is intendent for assigning team in project with security rule""",
    'description': """

Project Extension
========
App Information.
    """,
    'version': '16.0.1.0',
    'author': 'Strativ',
    'website': 'https://www.strativ.se/en',
    'category': 'PMP',
    'sequence': 1,
    'depends': [
        'base',
        'web',
        'mail',
        'project',
    ],
    'data': [
        ## Data
        # 'data/ir_sequence.xml',

        ## Security
        'security/ir.model.access.csv',
        'security/security.xml',

        ## Report
        # 'reports/report_paper_format.xml',
        # 'reports/my_model_name_report.xml',
        
        ## Wizard
        # 'wizards/my_model_name_wizard.xml',
        
        ## View
        'views/project_team_view.xml',
        'views/inherit_project_view.xml',
        'views/menus.xml',
    ],
    'qweb': [
        ## Template
        'static/src/xml/*.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'project_extension/static/src/js/dashboard.js',
            'project_extension/static/src/xml/dashboard.xml',
            # ('include', 'app_name/static/src/css/web_assets_backend.css'),
        ],
        # 'web.assets_frontend': [
        #     ('include', 'app_name/static/src/css/web_assets_frontend.css'),
        #     ('include', 'app_name/static/src/js/web_assets_frontend.js'),
        # ],
        # 'web.assets_common': [
        #     ('include', 'app_name/static/src/css/web_assets_common.css'),
        #     ('include', 'app_name/static/src/js/web_assets_common.js'),
        # ],
    },
    # 'demo': [
    #     ## Demo Data
    #     'demo/my_model_name_demo.xml',
    # ],
    'test': [
        'tests/test_project_dashboard.py',
    ],
    'external_dependencies': {
        'python': [
            'werkzeug',
        ],
    },
    'icon': '/project_extension/static/description/icon.png',
    'images': [
        # 'static/description/banner.png',
    ],
    'installable': True,
    'auto_install': False,
    'application': True,
    'price': 0,
    'currency': 'EUR',
    'license': 'OPL-1',
    'contributors': [
        'Md Azharul Amin Mulla <https://github.com/azharul77>',
    ],
}
