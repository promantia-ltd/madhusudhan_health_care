app_name = "health_care"
app_title = "Health Care"
app_publisher = "Promantia"
app_description = "Madhusudhan Hospital Health Care"
app_email = "kumar.m@promantia.com"
app_license = "mit"
# required_apps = []

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/health_care/css/health_care.css"
# app_include_js = "/assets/health_care/js/health_care.js"

# include js, css files in header of web template
# web_include_css = "/assets/health_care/css/health_care.css"
# web_include_js = "/assets/health_care/js/health_care.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "health_care/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "health_care/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "health_care.utils.jinja_methods",
# 	"filters": "health_care.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "health_care.install.before_install"
# after_install = "health_care.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "health_care.uninstall.before_uninstall"
# after_uninstall = "health_care.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "health_care.utils.before_app_install"
# after_app_install = "health_care.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "health_care.utils.before_app_uninstall"
# after_app_uninstall = "health_care.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "health_care.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }
doc_events = {
    'Family Details': {
        'before_save': 'health_care.custom_methods.save_additional_details.before_save',
    }
}


# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"health_care.tasks.all"
# 	],
# 	"daily": [
# 		"health_care.tasks.daily"
# 	],
# 	"hourly": [
# 		"health_care.tasks.hourly"
# 	],
# 	"weekly": [
# 		"health_care.tasks.weekly"
# 	],
# 	"monthly": [
# 		"health_care.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "health_care.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "health_care.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "health_care.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["health_care.utils.before_request"]
# after_request = ["health_care.utils.after_request"]

# Job Events
# ----------
# before_job = ["health_care.utils.before_job"]
# after_job = ["health_care.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"health_care.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

fixtures = [{
    "doctype": "Role",
    "filters": {
        "name": ["in", ["Student", "Professor"]]
    }
}]

