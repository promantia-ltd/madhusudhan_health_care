// Copyright (c) 2024, Promantia and contributors
// For license information, please see license.txt

frappe.ui.form.on("Family Adoption Program", {
    refresh(frm) {
        frappe.dynamic_link = {doc: frm.doc, fieldname: 'name', doctype: 'Family Adoption Program'}
		frappe.contacts.render_address_and_contact(frm);
 	}
 });
