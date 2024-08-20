# Copyright (c) 2024, Promantia and contributors
# For license information, please see license.txt
import frappe
from frappe.model.document import Document
from frappe.contacts.address_and_contact import load_address_and_contact


# from datetime import date

# def calculate_age(birthdate):
#     today = date.today()
#     return today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))


class FamilyDetails(Document):
    def onload(self):
        load_address_and_contact(self)
        
    # def after_insert(self):
    #     if not self.uid or len(self.uid) != 12 or not self.uid.isdigit():
    #         frappe.throw("UID must be a 12-digit number.")
        
    
    #     patient = frappe.db.get_value("Patient", {"uid": self.uid}, ["*"], as_dict=True)

    #     if patient:
    #         age = calculate_age(patient.dob) if patient.dob else None

    #         if not self.family_structure_details:
    #             self.append("family_structure_details", {
    #                     "family_member_name": patient.name,
    #                     "age": age,
    #                     "sex": patient.sex
    #             })
              
    #     else:
    #         if not self.family_structure_details:
    #             frappe.throw("family structure details missing")
    #         for detail in self.family_structure_details:
    #             if not detail.get("family_member_name"):
    #                 frappe.throw(f"Missing or empty value for 'family_member_name' in family structure details")

    #         for detail in self.family_structure_details:
                
    #             full_name = detail.family_member_name.strip().split()
    #             sex = detail.sex
                
                
            
    #         first_name = full_name[0] if len(full_name) > 0 else ""
    #         last_name = full_name[-1] if len(full_name) > 1 else ""
    #         middle_name = " ".join(full_name[1:-1]) if len(full_name) > 2 else ""
            

    #         new_patient = frappe.get_doc({
    #                 "doctype": "Patient",
    #                 "uid": self.uid,
    #                 "uid": self.uid,
    #                 "first_name": first_name,  
    #                 "middle_name": middle_name,  
    #                 "last_name": last_name,
    #                 "sex":sex
                    
    #         })
    #         new_patient.insert()
    #         frappe.msgprint(f"New patient created with UID: {self.uid}")