// Copyright (c) 2024, Promantia and contributors
// For license information, please see license.txt

frappe.ui.form.on("Measurement Details", {
 	refresh(frm) {
        frm.set_df_property('family_member_name', 'options', ['option a', 'option b']);
        frm.refresh_field('family_member_name');
       },
       weight(frm){
              update_bmi(frm)
       },
       height(frm){
              update_bmi(frm)
       },
       waist(frm){
              update_whr(frm)
       },
       hip_c_cm(frm){
              update_whr(frm)
       }
   });
   
   function update_bmi(frm) {
       let height = frm.doc.height;
       let weight = frm.doc.weight;
       if (height && weight) {
           let heightInMeters = height / 100;
           let bmi = weight / (heightInMeters * heightInMeters);
           frm.set_value('bmi', bmi.toFixed(2));
       } else {
           frm.set_value('bmi', '');
       }
   }
   
   function update_whr(frm) {
       let waist = frm.doc.waist;
       let hip = frm.doc.hip_c_cm;
       if (waist && hip) {
           let whr = waist / hip;
           frm.set_value('whr', whr.toFixed(2));
       } else {
           frm.set_value('whr', '');
       }
   }
   
