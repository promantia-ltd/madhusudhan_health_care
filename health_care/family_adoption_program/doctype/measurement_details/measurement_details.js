// Copyright (c) 2024, Promantia and contributors
// For license information, please see license.txt

frappe.ui.form.on("Measurement Details", {
 	refresh(frm) {
        frm.set_df_property('family_member_name', 'options', ['option a', 'option b']);
        frm.refresh_field('family_member_name');
 	},
});
