// Copyright (c) 2024, Promantia and contributors
// For license information, please see license.txt

frappe.ui.form.on("Student Master", {
    refresh(frm) {
        frappe.dynamic_link = {doc: frm.doc, fieldname: 'name', doctype: 'Student Master'}
		frappe.contacts.render_address_and_contact(frm);
 	}
 });
