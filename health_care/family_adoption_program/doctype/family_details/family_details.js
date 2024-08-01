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
					frappe.msgprint(__('Please add a family member first.'));
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
						},
						{
							label: 'Height (Cms)',
							fieldname: 'height',
							fieldtype: 'Float',
							precision: 2
						},
						{
							label: 'Weight (Kg)',
							fieldname: 'weight',
							fieldtype: 'Float',
							precision: 2
						},
						{
							label: 'BMI',
							fieldname: 'bmi',
							fieldtype: 'Float',
							precision: 2
						},
						{
							label: 'Waist (Cms)',
							fieldname: 'waist',
							fieldtype: 'Float',
							precision: 2
						},
						{
							label: 'Hip C (Cms)',
							fieldname: 'hip_c_cm',
							fieldtype: 'Float',
							precision: 2
						},
						{
							label: 'WHR',
							fieldname: 'whr',
							fieldtype: 'Float',
							precision: 2
						},
						{
							label: 'RBS (mg%)',
							fieldname: 'rbs',
							fieldtype: 'Float',
							precision: 2
						},{
							label: 'BP (mm hg)',
							fieldname: 'bp_mm_hg',
							fieldtype: 'Float',
							precision: 2
						}
					],
					primary_action_label: 'Add Measurement',
					primary_action(values) {
						frappe.db.insert({
							doctype: 'Measurement Details',
							family_details : frm.doc.name,
							family_member_name : values.family_member_name,
							height: values.height,
							weight: values.weight,
							waist :values.waist,
							hip_c_cm: values.hip_c_cm,
							rbs : values.rbs,
							bp_mm_hg : values.bp_mm_hg,
							bmi: values.bmi,
							whr: values.whr
						});
						dialog.hide();
					}
					
				});				
				dialog.show();
			});
		}
	},
});
