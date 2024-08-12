frappe.ui.form.on("Family Details", {

	refresh(frm) {
		frm.toggle_display('address_html', !frm.is_new());
		console.log("current doc", frm.doc)

		if (!frm.is_new()) {
			frm.doc.abbr && frm.set_df_property("abbr", "read_only", 1);
			frappe.contacts.render_address_and_contact(frm);
			frappe.dynamic_link = { doc: frm.doc, fieldname: 'name', doctype: 'Family Details' };

			frm.add_custom_button("Actions", function() {}, 'fa fa-chevron-down')
				.addClass('dropdown-toggle')
				.attr('data-toggle', 'dropdown')
				.parent().addClass('dropdown')
				.append(`
					<ul class="dropdown-menu">
						<li><a class="dropdown-item" href="#" data-action="add_measurement">Add Measurement</a></li>
						<li><a class="dropdown-item" href="#" data-action="measurement_report">Measurement Report</a></li>
					</ul>
				`)
				.css('display', 'inline-block');

			frm.$wrapper.find('.dropdown-menu li a').on('click', function() {
				let action = $(this).attr('data-action');
				
				if (action === 'add_measurement') {
					let family_member_names = frm.doc.family_structure_details
						? frm.doc.family_structure_details.map(detail => detail.family_member_name)
						: [];

					if (family_member_names.length === 0) {
						frappe.msgprint(__('Please add a family member first.'));
						return;
					}

					let dialog = new frappe.ui.Dialog({
						title: 'Select Family Member',
						fields: [
							{
								label: 'Family Member Name',
								fieldname: 'family_member_name',
								fieldtype: 'Select',
								options: family_member_names,
								reqd: 1
							},
							{
								label: 'Height (Cms)',
								fieldname: 'height',
								fieldtype: 'Float',
								precision: 2,
								reqd: 1,
								onchange: function() {
									update_bmi();
								}
							},
							{
								label: 'Weight (Kg)',
								fieldname: 'weight',
								fieldtype: 'Float',
								precision: 2,
								reqd: 1,
								onchange: function() {
									update_bmi();
								}
							},
							{
								label: 'BMI',
								fieldname: 'bmi',
								fieldtype: 'Float',
								precision: 2,
								reqd: 1
							},
							{
								label: 'Waist (Cms)',
								fieldname: 'waist',
								fieldtype: 'Float',
								precision: 2,
								reqd: 1,
								onchange: function() {
									update_whr();
								}
							},
							{
								label: 'Hip C (Cms)',
								fieldname: 'hip_c_cm',
								fieldtype: 'Float',
								precision: 2,
								reqd: 1,
								onchange: function() {
									update_whr();
								}
							},
							{
								label: 'WHR',
								fieldname: 'whr',
								fieldtype: 'Float',
								precision: 2,
								reqd: 1
							},
							{
								label: 'RBS (mg%)',
								fieldname: 'rbs',
								fieldtype: 'Float',
								precision: 2,
								reqd: 1
							},{
								label: 'BP (mm hg)',
								fieldname: 'bp_mm_hg',
								fieldtype: 'Data',
								precision: 2,
								reqd: 1
							}
						],
						primary_action_label: 'Add Measurement',
						primary_action(values) {
							frappe.db.insert({
								doctype: 'Measurement Details',
								family_details: frm.doc.name,
								family_member_name: values.family_member_name,
								height: values.height,
								weight: values.weight,
								waist: values.waist,
								hip_c_cm: values.hip_c_cm,
								rbs: values.rbs,
								bp_mm_hg: values.bp_mm_hg,
								bmi: values.bmi,
								whr: values.whr
							});
							dialog.hide();
						}
					});

					function update_bmi() {
						let height = dialog.get_value('height');
						let weight = dialog.get_value('weight');
						if (height && weight) {
							let heightInMeters = height / 100;
							let bmi = weight / (heightInMeters * heightInMeters);
							dialog.set_value('bmi', bmi.toFixed(2));
						} else {
							dialog.set_value('bmi', '');
						}
					}

					function update_whr() {
						let waist = dialog.get_value('waist');
						let hip = dialog.get_value('hip_c_cm');
						if (waist && hip) {
							let whr = waist / hip;
							dialog.set_value('whr', whr.toFixed(2));
						} else {
							dialog.set_value('whr', '');
						}
					}

					dialog.show();

				} 
				else if (action === 'measurement_report') {
					frappe.set_route('query-report', 'Family Members Measurement Details', { 'family_details': frm.doc.name });
				}
			});
			frm.add_custom_button(__('Start Recording'), function() {
				startVoiceRecording(frm);
			}).addClass("btn-primary").attr("id", "start-voice-record-btn");
	
			frm.add_custom_button(__('Stop Recording'), function() {
				stopVoiceRecording(frm);
			}).addClass("btn-danger").attr("id", "stop-voice-record-btn").hide(); 
		}
	},
	onload: function(frm) {
        if (!frm.doc.geotagging) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    let latitude = position.coords.latitude;
                    let longitude = position.coords.longitude;

                    let coords = {
                        type: "FeatureCollection",
                        features: [
                            {
                                type: "Feature",
                                properties: {
                                    point_type: "circle",
                                    radius: 500
                                },
                                geometry: {
                                    type: "Point",
                                    coordinates: [longitude, latitude]
                                }
                            }
                        ]
                    };
					setTimeout(()=>{
						frm.set_value('geotagging', JSON.stringify(coords));
						frm.refresh_field('geotagging');
						console.log("map loadedd")
					},3000)

                    

                   
                }, function(error) {
                    console.warn(`ERROR(${error.code}): ${error.message}`);
                    frappe.msgprint(__('Unable to fetch location. Please try again.'));
					
                }, 
				{
                    enableHighAccuracy: true,
                    // timeout: 5000,             
                    // maximumAge: 0              
                }
			);
            } else {
                frappe.msgprint(__('Geolocation is not supported by this browser.'));
            }
        }
    }

});

let recognition;
let recording = false;

function startVoiceRecording(frm) {
    const startBtn = document.querySelector("#start-voice-record-btn");
    const stopBtn = document.querySelector("#stop-voice-record-btn");
	// const resultField = frm.fields_dict['any_remarks'].input;
	if (!recording) {
        let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'en';
        recognition.interimResults = false;
        recognition.start();

        recognition.onresult = function(event) {
            const speechResult = event.results[0][0].transcript;
            frappe.msgprint('Recognized Speech: ' + speechResult);
            // resultField.value = speechResult; 
        
			console.log("check frm",frm)
			frm.meta.fields.forEach(field => {
				if(field.label){
					const label = field.label.toLowerCase();
					const regex = new RegExp(`${label} is ([\\w\\s]+)`, 'i');
					const match = speechResult.match(regex);
	
					if (match) {
						let value = match[1].trim();
						value = value.charAt(0).toUpperCase() + value.slice(1);
						updateFieldValue(frm, field.fieldname, value);
					}
				}
				
			});
		};
	}
        // recognition.onerror = function(event) {
        //     stopVoiceRecording(frm);
        //     frappe.msgprint('Error occurred in recognition: ' + event.error);
        // };
		recognition.onspeechend = () => {
			// startVoiceRecording(frm);
			stopVoiceRecording(frm);

		  };

        startBtn.style.display = 'none';
        stopBtn.style.display = 'inline-block';
        recording = true;
    }
// }

function stopVoiceRecording(frm) {
    const startBtn = document.querySelector("#start-voice-record-btn");
    const stopBtn = document.querySelector("#stop-voice-record-btn");
	
	if (recognition) {
        recognition.stop();
    }

    stopBtn.style.display = 'none';
    startBtn.style.display = 'inline-block';
    recording = false;
}
function updateFieldValue(frm, fieldname, value) {
    if (frm.fields_dict[fieldname]) {
        frm.set_value(fieldname, value);
        frappe.msgprint(`Updated ${fieldname}: ${value}`);
    } else {
        frappe.msgprint(`Field ${fieldname} not found in the form.`);
    }
}