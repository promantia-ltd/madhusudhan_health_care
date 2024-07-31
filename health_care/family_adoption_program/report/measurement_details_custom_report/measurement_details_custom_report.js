// Copyright (c) 2024, Promantia and contributors
// For license information, please see license.txt

frappe.query_reports["Measurement Details Custom Report"] = {
  filters: [
    {
      fieldname: "family_details",
      label: __("Family Id"),
      fieldtype: "Link",
      options: "Family Details",
    },
    {
      fieldname: "family_member_name",
      label: __("Family Member Name"),
      fieldtype: "Data",
    },
    {
      fieldname: "measurement_date",
      label: __("Measurement Date"),
      fieldtype: "Date",
    },
  ],
  
};
