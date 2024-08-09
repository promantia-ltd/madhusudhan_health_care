import frappe
from frappe import _, msgprint


def execute(filters=None):
    if not filters:
        filters = {}

    columns = get_columns()
    data = []
    measurement_details_data = get_measurement_details_data(filters)

    if not measurement_details_data:
        msgprint(_("No records found"))
        return columns, data

    for record in measurement_details_data:
        row = frappe._dict(
            {
                "family_details": record.get("family_details"),
                "measurement_date": record.get("measurement_date"),
                "family_member_name": record.get("family_member_name"),
                "height": record.get("height"),
                "weight": record.get("weight"),
                "bmi": record.get("bmi"),
                "hip_c_cm": record.get("hip_c_cm"),
                "waist": record.get("waist"),
                "whr": record.get("whr"),
                "rbs": record.get("rbs"),
                "bp_mm_hg": record.get("bp_mm_hg"),
            }
        )
        data.append(row)

    return columns, data


def get_columns():
    return [
        {
            "fieldname": "family_details",
            "label": _("Family Id"),
            "fieldtype": "Data",
            "width": "180",
        },
        {
            "fieldname": "family_member_name",
            "label": _("Family Member Name"),
            "fieldtype": "Data",
            "width": "200",
        },
        {
            "fieldname": "measurement_date",
            "label": _("Date"),
            "fieldtype": "Date",
            "width": "120",
            "text-align": "left",
        },
        {
            "fieldname": "height",
            "label": _("Height (cm)"),
            "fieldtype": "Float",
            "width": "80",
            "precision": "2"
        },
        {
            "fieldname": "weight",
            "label": _("Weight (kg)"),
            "fieldtype": "Float",
            "width": "80",
            "precision": "2"
        },
        {"fieldname": "bmi", "label": _("Bmi"), "fieldtype": "Float", "width": "80", "precision": "2"},
        {
            "fieldname": "hip_c_cm",
            "label": _("Hip C (cm)"),
            "fieldtype": "Float",
            "width": "80",
            "precision": "2"
        },
        {
            "fieldname": "waist",
            "label": _("Waist C (cm)"),
            "fieldtype": "Float",
            "width": "80",
            "precision": "2"
        },
        {"fieldname": "whr", "label": _("WHR"), "fieldtype": "Float", "width": "80", "precision": "2"},
        {
            "fieldname": "rbs",
            "label": _("RBS (mg%)"),
            "fieldtype": "Float",
            "width": "80",
            "precision": "2"
        },
        {
            "fieldname": "bp_mm_hg",
            "label": _("BP (mm hg)"),
            "fieldtype": "Data",
            "width": "80",
            "precision": "2"
        },
    ]


def get_measurement_details_data(filters):
    conditions = get_conditions(filters)
    records = frappe.get_all(
        doctype="Measurement Details", fields=["*"], filters=conditions
    )
    return records


def get_conditions(filters):
    conditions = {}
    if filters.get("family_details"):
        conditions["family_details"] = filters["family_details"]
    if filters.get("family_member_name"):
        conditions["family_member_name"] = [
            "like",
            f"%{filters['family_member_name']}%",
        ]
    if filters.get("measurement_date"):
        selected_date = filters["measurement_date"]
        conditions["measurement_date"] = ["<=", selected_date]

    return conditions
