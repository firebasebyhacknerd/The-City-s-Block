import re

with open("src/lib/portal.ts", "r") as f:
    lines = f.readlines()

mock_data_lines = []
portal_lines = []

capturing_mock = False

mock_keywords = [
    "export const bhkOptions",
    "export const propertyTypes",
    "export const amenityOptions",
    "export const profiles",
    "export const localities",
    "export const projects",
    "export const listings",
    "export const inquiries",
    "export const savedSearches"
]

types_to_import = ["Profile", "Locality", "Project", "Listing", "Inquiry", "SavedSearch", "PropertyType", "AssetClass", "ListingType", "Furnishing", "PossessionStatus", "Role", "VerificationStatus"]

imports_for_mock = f"import type {{ {', '.join(types_to_import)} }} from './portal';\n\n"
mock_data_lines.append(imports_for_mock)

for line in lines:
    is_start = any(line.startswith(kw) for kw in mock_keywords)
    
    if is_start:
        capturing_mock = True
        
    if capturing_mock:
        mock_data_lines.append(line)
        if line.startswith("];"):
            capturing_mock = False
    else:
        # Check if line is Supabase stuff
        if "supabase" in line.lower() or "getSupabasePublicClient" in line or "getSupabaseServiceClient" in line or "createSupabaseClient" in line:
            # Drop the supabase lines but wait, some are functions.
            pass
            
        portal_lines.append(line)

with open("src/lib/mock-data.ts", "w") as f:
    f.writelines(mock_data_lines)

# Now we rewrite portal_lines to exclude Supabase stuff manually using a cleaner approach.
# It's better to rewrite portal.ts later using multi_replace_file_content or a better parsing script.
