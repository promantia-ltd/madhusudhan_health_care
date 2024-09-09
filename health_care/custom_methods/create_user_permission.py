import frappe
from frappe.core.doctype.user.user import reset_password


def create_user_permission(user, doctype, for_value, apply_to_all_doctypes=1):
    try:
        user_permission = frappe.get_doc({
            "doctype": "User Permission",
            "user": user,
            "allow": doctype,
            "for_value": for_value,
            "apply_to_all_doctypes": apply_to_all_doctypes
        })
        user_permission.insert(ignore_permissions=True)
    except Exception as e:
        frappe.log_error(f"Failed to create User Permission for {user} on {doctype}: {str(e)}")


def create_user_permission_for_student(doc, method):
    if doc.user:
        try:
            user = frappe.get_doc("User", doc.user)
            # Create User Permission for the Student
            create_user_permission(user.name, "Student", doc.name)
            # Reset the user's password
            reset_password(doc.user)
        except Exception as e:
            frappe.log_error(f"Error in creating user permission for student {doc.name}: {str(e)}")


def create_user_permission_for_instructor(doc, method):
    if doc.employee:
        try:
            employee = frappe.get_doc("Employee", doc.employee)
            user = employee.user_id
            # Create User Permission for the Instructor
            create_user_permission(user, doc.doctype, doc.name)
        except Exception as e:
            frappe.log_error(f"Error in creating user permission for instructor {doc.name}: {str(e)}")
