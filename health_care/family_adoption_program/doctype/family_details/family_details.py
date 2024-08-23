# Copyright (c) 2024, Promantia and contributors
# For license information, please see license.txt
import frappe
from frappe.model.document import Document
from frappe.contacts.address_and_contact import load_address_and_contact
from frappe.utils import now_datetime

# from datetime import date

# def calculate_age(birthdate):
#     today = date.today()
#     return today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))


class FamilyDetails(Document):
    def onload(self):
        load_address_and_contact(self)
    def before_save(self):
        if not isinstance(self.family_structure_details, list) or len(self.family_structure_details) == 0:
            frappe.throw("Family Structure Details must have at least one entry.")

        hof_found = False
        for detail in self.family_structure_details:
            if detail.relation_to_hof and detail.family_member_name:
                family_member_name = detail.get("family_member_name")
                relation_to_hof = detail.get("relation_to_hof").strip().lower()
                if family_member_name and relation_to_hof == "hof":
                    hof_found = True
                    
                    if self.is_new():
                        max_id = frappe.db.get_value('Family Details', {}, 'name', order_by='name desc')

                        if max_id:
                            parts = max_id.split('-')
                            numeric_part = int(parts[-1]) if len(parts) > 2 else 0
                            next_id = numeric_part + 1
                        else:
                            next_id = 1

                        formatted_id = str(next_id).zfill(6)

                        formatted_name = family_member_name.split()[0].upper()
                        now = now_datetime()
                        year = now.year
                        self.name = f"{formatted_name}-{year}-{formatted_id}"
                    break
            else:
                pass

        if not hof_found:
            frappe.throw("There must be at least one family member with relation_to_hof as 'Hof'.")

        
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
    
def get_next_unique_id(self):
        # Generate the next unique ID in a zero-padded format
        last_id = frappe.db.get_value("FamilyDetails", {}, "name", order_by="name desc")

        if last_id:
            # Extract the numeric part and increment
            last_id_number = int(last_id.split('-')[-1])
            next_id_number = last_id_number + 1
        else:
            # Start with 1 if no previous ID exists
            next_id_number = 1

        # Format the ID with leading zeros
        unique_id = str(next_id_number).zfill(6)
        return unique_id