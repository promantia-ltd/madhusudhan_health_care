import json
import frappe
from frappe import _

def before_save(doc, method):
    if doc.is_new():
        return

    previous_version = frappe.get_all(
        'Family Details',
        filters={'name': doc.name},
        fields=['*'],
    )
    if previous_version:
        record = previous_version[0]
        fields_to_check = [
            "approach_road", "stray_animals_near_house", "livestock", "source_of_pollution",
            "set_back", "roof_material", "cracks", "floor_material", "total_floor_space",
            "ventilation", "overcrowding", "accident_prone_areas_around_house", 
            "vector_breeding_places", "infestation_of_rodents", "is_the_surrounding_prone_for_flooding",
            "house_type", "roof_condition", "dampness", "number_of_living_rooms",
            "artificial_ventilation", "cross_ventilation", "streetlights_near_house",
            "pet_animals", "environment_pollution", "indiscriminate_disposal_of_waste_around_house",
            "type_of_house", "wall_material", "floor_condition", "area_of_windows_doors",
            "per_capita_floor_space_in_the_house", "lighting", "kitchen_section", "kitchen",
            "cooking_fuel", "smoke_outlet", "washing_area_for_utensils", "cover_status",
            "platform", "storage_of_cooked_food", "kitchen_lighting", "sullage_disposal",
            "dustbin_status", "floor_type", "storage_of_raw_food_items", "water_supply",
            "appliances_present", "pests_inside_kitchen", "water_source", "water_supply_status",
            "storage_of_drinking_water", "purification_method", "distance_of_drinking_water_source_from_house",
            "intermittent_frequency", "household_purification_of_water", "privacy",
            "maintenance", "drainage", "sewage_disposal_section", "sanitary_latrine",
            "distance_of_sharedcommunity_latrine", "latrine_connection_type",
            "hand_washing_after_using_toilet", "type_of_latrine", "distance_between_insanitary_toilet_and_well",
            "open_air_defecation_practice", "children_defecateurinat_near_the_house", "waste_segragation",
            "solid_waste_disposal_method", "solid_waste_disposal_frequency", "solid_waste_collection_method",
            "collector_information", "sanitary_paddiaper_disposal", "additional_income", "per_capita_income",
            "dependency_ratio", "social_security_schemes", "health_insurance", "remarks_if_pension_not_availed",
            "gross_income_per_month", "economic_status", "young_age_dependency", "esi", "widow_pension",
            "disability_pension", "family_size", "socio_economic_status", "old_age_dependency_ratio",
            "life_insurance", "old_age_pension", "attach_sketch",
            "house_plan", "any_remarks","accident_prone_areas","segregation_into_dry_and_wet",
        ]
        
        for field in fields_to_check:
            if doc.get(field) != record.get(field):
                target_doc = frappe.new_doc('Additional Information')
                target_doc.family_details = record.get("name", "")
                target_doc.date = frappe.utils.now()

                for field in fields_to_check:
                    setattr(target_doc, field, record.get(field, ""))
                
                target_doc.insert(ignore_permissions=True)
                frappe.db.commit()
                break
