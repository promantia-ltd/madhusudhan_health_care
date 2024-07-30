// Copyright (c) 2024, Promantia and contributors
// For license information, please see license.txt

frappe.ui.form.on("Family Details", {

	 refresh(frm) {
		frm.toggle_display('address_html', !frm.is_new());

		if (!frm.is_new()) {
			frm.doc.abbr && frm.set_df_property("abbr", "read_only", 1);
			frappe.contacts.render_address_and_contact(frm);
			frappe.dynamic_link = {doc: frm.doc, fieldname: 'name', doctype: 'Family Details'}

			frm.add_custom_button("Add Measurement", function(frm) {
				frappe.new_doc("Measurement Details");
			});
		}
	},
});

