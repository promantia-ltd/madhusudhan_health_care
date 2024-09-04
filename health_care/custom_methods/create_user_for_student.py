import frappe
from frappe.core.doctype.user.user import reset_password


def create_user_permission(doc, method):
    if doc.user:
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
        frappe.db.commit()

        # reset the user password
        reset_password(doc.user)
