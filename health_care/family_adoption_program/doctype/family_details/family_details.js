frappe.ui.form.on("Family Details", {

	refresh(frm) {
		frm.toggle_display('address_html', !frm.is_new());
		console.log("current doc", frm.doc)

		if (!frm.is_new()) {
			frm.doc.abbr && frm.set_df_property("abbr", "read_only", 1);
			frappe.contacts.render_address_and_contact(frm);
			frappe.dynamic_link = { doc: frm.doc, fieldname: 'name', doctype: 'Family Details' }

			frm.add_custom_button("Add Measurement", function() {
				let family_member_names = frm.doc.family_structure_details
					? frm.doc.family_structure_details.map(detail => detail.family_member_name)
					: [];

				if (family_member_names.length === 0) {
					frappe.msgprint(__('Please create a family member first.'));
					return;
				}

				let dialog = new frappe.ui.Dialog({
					title: 'Select Family Member',
					fields: [
						{
							label: 'Family Member Name',
							fieldname: 'family_member_name',
							fieldtype: 'Select',
							options: family_member_names
						}
					],
					primary_action_label: 'Create Measurement',
					primary_action(values) {
						frappe.new_doc("Measurement Details", {
							family_details: frm.doc.name,
							family_member_name: values.family_member_name
						});
						dialog.hide();
					}
				});
				
				dialog.show();
			});
		}
	},
});
