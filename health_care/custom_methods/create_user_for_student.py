import frappe
from frappe.utils.password import update_password
from frappe.exceptions import ValidationError

def create_user_for_student(doc, method):
    email = f"{doc.student_name.replace(' ', '.').lower()}.{doc.roll_no}@gmail.com"
    password = f"{doc.student_name.replace(' ', '')}@{doc.roll_no}"

    if frappe.db.exists("User", {"email": email}):
        frappe.throw(f"User with email {email} already exists.")
    user = frappe.new_doc("User")
    user.email = email
    user.first_name = doc.student_name
    user.username = email
    user.enabled = 1
    user.send_welcome_email = 0
    user.user_type = "System User"
    user.insert(ignore_permissions=True)
    
    user.add_roles("student")

    user_permission = frappe.get_doc({
        "doctype": "User Permission",
        "user": user.name,
        "allow": "Student Master",  
        "for_value": doc.name,
        "apply_for_all_roles": 1
    })
    user_permission.insert(ignore_permissions=True)

    try:
        update_password(user.name, password)
    except ValidationError as e:
        frappe.throw(f"Error updating password: {str(e)}")
    
    frappe.msgprint(f"User {user.name} created for student {doc.student_name}")
