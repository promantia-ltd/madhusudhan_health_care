# Copyright (c) 2024, Promantia and contributors
# For license information, please see license.txt

# import frappe
from datetime import date
from frappe.model.document import Document


class MeasurementDetails(Document):
	def before_save(self):
		self.measurement_date = date.today()
