import frappe
from frappe.utils.password import update_password
from frappe import _
from datetime import datetime
from frappe.exceptions import ValidationError


def create_user_for_student(doc, method):
    if not doc.date_of_birth:
        frappe.throw(_("Date Of Birth is required to create a user."))

    try:
        dob_year = datetime.strptime(doc.date_of_birth, '%Y-%m-%d').year
    except ValueError:
        frappe.throw(
            _("Invalid Date of Birth format. Please use 'YYYY-MM-DD'."))

    password = f"{doc.student_name.replace(' ', '')}@{dob_year}"
    # get the user doc
    user = frappe.get_doc("User", doc.user)

    # Create a User Permission for the Student
    user_permission = frappe.get_doc({
        "doctype": "User Permission",
        "user": user.name,
        "allow": "Student",
        "for_value": doc.name,
        "apply_for_all_roles": 1
    })
    user_permission.insert(ignore_permissions=True)

    # Update the user's password
    try:
        update_password(user.name, password)
    except ValidationError as e:
        frappe.throw(_("Error updating password: {0}").format(str(e)))

    frappe.msgprint(_("User {0} created for student {1}").format(user.name, doc.student_name))
