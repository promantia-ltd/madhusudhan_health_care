# Copyright (c) 2024, Promantia and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document
from frappe.contacts.address_and_contact import load_address_and_contact


class StudentMaster(Document):
	def onload(self):
		load_address_and_contact(self)
