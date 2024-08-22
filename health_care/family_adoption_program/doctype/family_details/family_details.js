frappe.ui.form.on("Family Details", {
  refresh(frm) {
    $(document).off("keydown"); 
    $(document).on("keydown", function (event) {
      if (event.ctrlKey && event.key === "m") {
        event.preventDefault();
        if (frm) {
          toggleVoiceRecording(frm);
        }
      }
    });
      if (!frm.custom_buttons["Toggle Voice Recording"]) {
        frm
          .add_custom_button(__("Enable Voice Recording"), function () {
            toggleVoiceRecording(frm);
          })
          .addClass("btn-danger")
          .attr("id", "voice-record-toggle");
      }

      const fields = ["migration_reason", "any_remarks"];

      toggleVoiceRecording(frm, frm.voice_recording_enabled);

      fields.forEach((field_name) => {
        const field_wrapper = frm.fields_dict[field_name].$wrapper;
        const field_label = field_wrapper.find(".control-label");

        if (!field_label.find(".voice-icon").length) {
          const icon_html = `
                        <span class="voice-icon" style="margin-left: 8px; cursor: pointer; color: red;">
                            <i class="fa fa-microphone"></i>
                        </span>`;
          field_label.append(icon_html);
        }

        const field = frm.fields_dict[field_name].input;
        $(field).on("focus", function () {
          if (frm.voice_recording_enabled) {
            startVoiceRecording(frm, field_name);
          }
        });
        $(field).on("blur", function () {
          if (frm.voice_recording_enabled) {
            stopVoiceRecording(frm);
          }
        });
      });

      frm.toggle_display("address_html", !frm.is_new());
      console.log("current doc", frm.doc);

      if (!frm.is_new()) {
        frm.doc.abbr && frm.set_df_property("abbr", "read_only", 1);
        frappe.contacts.render_address_and_contact(frm);
        frappe.dynamic_link = {
          doc: frm.doc,
          fieldname: "name",
          doctype: "Family Details",
        };

        frm
          .add_custom_button("Actions", function () {}, "fa fa-chevron-down")
          .addClass("dropdown-toggle")
          .attr("data-toggle", "dropdown")
          .parent()
          .addClass("dropdown")
          .append(
            `
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" data-action="add_measurement">Add Measurement</a></li>
                            <li><a class="dropdown-item" href="#" data-action="measurement_report">Measurement Report</a></li>
                        </ul>
                    `
          )
          .css("display", "inline-block");

        frm.$wrapper.find(".dropdown-menu li a").on("click", function () {
          let action = $(this).attr("data-action");

          if (action === "add_measurement") {
            let family_member_names = frm.doc.family_structure_details
              ? frm.doc.family_structure_details.map(
                  (detail) => detail.family_member_name
                )
              : [];

            if (family_member_names.length === 0) {
              frappe.msgprint(__("Please add a family member first."));
              return;
            }

            let dialog = new frappe.ui.Dialog({
              title: "Select Family Member",
              fields: [
                {
                  label: "Family Member Name",
                  fieldname: "family_member_name",
                  fieldtype: "Select",
                  options: family_member_names,
                  reqd: 1,
                },
                {
                  label: "Height (Cms)",
                  fieldname: "height",
                  fieldtype: "Float",
                  precision: 2,
                  reqd: 1,
                  onchange: function () {
                    update_bmi();
                  },
                },
                {
                  label: "Weight (Kg)",
                  fieldname: "weight",
                  fieldtype: "Float",
                  precision: 2,
                  reqd: 1,
                  onchange: function () {
                    update_bmi();
                  },
                },
                {
                  label: "BMI",
                  fieldname: "bmi",
                  fieldtype: "Float",
                  precision: 2,
                  reqd: 1,
                },
                {
                  label: "Waist (Cms)",
                  fieldname: "waist",
                  fieldtype: "Float",
                  precision: 2,
                  reqd: 1,
                  onchange: function () {
                    update_whr();
                  },
                },
                {
                  label: "Hip C (Cms)",
                  fieldname: "hip_c_cm",
                  fieldtype: "Float",
                  precision: 2,
                  reqd: 1,
                  onchange: function () {
                    update_whr();
                  },
                },
                {
                  label: "WHR",
                  fieldname: "whr",
                  fieldtype: "Float",
                  precision: 2,
                  reqd: 1,
                },
                {
                  label: "RBS (mg%)",
                  fieldname: "rbs",
                  fieldtype: "Float",
                  precision: 2,
                  reqd: 1,
                },
                {
                  label: "BP (mm hg)",
                  fieldname: "bp_mm_hg",
                  fieldtype: "Data",
                  precision: 2,
                  reqd: 1,
                },
              ],
              primary_action_label: "Add Measurement",
              primary_action(values) {
                frappe.db.insert({
                  doctype: "Measurement Details",
                  family_details: frm.doc.name,
                  family_member_name: values.family_member_name,
                  height: values.height,
                  weight: values.weight,
                  waist: values.waist,
                  hip_c_cm: values.hip_c_cm,
                  rbs: values.rbs,
                  bp_mm_hg: values.bp_mm_hg,
                  bmi: values.bmi,
                  whr: values.whr,
                });
                dialog.hide();
              },
            });

            function update_bmi() {
              let height = dialog.get_value("height");
              let weight = dialog.get_value("weight");
              if (height && weight) {
                let heightInMeters = height / 100;
                let bmi = weight / (heightInMeters * heightInMeters);
                dialog.set_value("bmi", bmi.toFixed(2));
              } else {
                dialog.set_value("bmi", "");
              }
            }

            function update_whr() {
              let waist = dialog.get_value("waist");
              let hip = dialog.get_value("hip_c_cm");
              if (waist && hip) {
                let whr = waist / hip;
                dialog.set_value("whr", whr.toFixed(2));
              } else {
                dialog.set_value("whr", "");
              }
            }

            dialog.show();
          } else if (action === "measurement_report") {
            frappe.set_route(
              "query-report",
              "Family Members Measurement Details",    // }

              { family_details: frm.doc.name }
            );
          }
        });
      }
  },
  onload: function (frm) {
    if (!frm.doc.geotagging) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;

            let coords = {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {
                    point_type: "circle",
                    radius: 500,
                  },
                  geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude],
                  },
                },
              ],
            };

            setTimeout(() => {
              frm.set_value("geotagging", JSON.stringify(coords));
              frm.refresh_field("geotagging");
              console.log("map loaded");
            }, 3000);
          },
          function (error) {
            console.warn(`ERROR(${error.code}): ${error.message}`);
            frappe.msgprint(__("Unable to fetch location. Please try again."));
          },
          {
            enableHighAccuracy: true,
          }
        );
      } else {
        frappe.msgprint(__("Geolocation is not supported by this browser."));
      }
    }
  },
});

let recognition;
let recording = false;
function startVoiceRecording(frm, field_name) {
  let SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "en";
  recognition.interimResults = true;
  recognition.start();

  recognition.onresult = function (event) {
    const speechResult = event.results[0][0].transcript;
    const currentValue = frm.fields_dict[field_name].get_value() || "";
    if (event.results[0].isFinal) {
      const updatedValue = currentValue + " " + speechResult;
      updateFieldValue(frm, field_name, updatedValue.trim());
    }
  };

  recognition.onspeechend = () => {
    startVoiceRecording(frm, field_name);
  };
}

function stopVoiceRecording(frm) {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
}

function updateFieldValue(frm, field_name, value) {
  frm.set_value(field_name, value);
}
function toggleVoiceRecording(frm, enable = null) {
  if (enable === null) {
    enable = !frm.voice_recording_enabled;
  }
  frm.voice_recording_enabled = enable;

  const button = $("#voice-record-toggle");

  if (enable) {
    button.text("Disable Voice Recording");
    showVoiceIcons(frm, true);
  } else {
    button.text("Enable Voice Recording");
    showVoiceIcons(frm, false);
  }
}

function showVoiceIcons(frm, show) {
  const fields = ["migration_reason", "any_remarks"];

  fields.forEach((field_name) => {
    const field_wrapper = frm.fields_dict[field_name].$wrapper;
    const icon = field_wrapper.find(".voice-icon");
    if (show) {
      icon.show();
    } else {
      icon.hide();
    }
  });
}
