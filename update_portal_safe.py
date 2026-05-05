import re

with open("src/lib/portal.ts", "r") as f:
    content = f.read()

# 1. Remove Supabase imports
content = re.sub(r'import \{ createClient, type SupabaseClient \} from "@supabase/supabase-js";\n', '', content)

# 2. Remove Supabase from portalEnv
content = re.sub(r'\s*supabaseUrl: process\.env\.NEXT_PUBLIC_SUPABASE_URL \|\| "",\n', '', content)
content = re.sub(r'\s*supabaseAnonKey: process\.env\.NEXT_PUBLIC_SUPABASE_ANON_KEY \|\| "",\n', '', content)
content = re.sub(r'\s*supabaseServiceRoleKey: process\.env\.SUPABASE_SERVICE_ROLE_KEY \|\| "",\n', '', content)

# 3. Remove Supabase from integrationStatus
content = re.sub(r'\s*supabase: Boolean\(portalEnv\.supabaseUrl && portalEnv\.supabaseAnonKey\),\n', '', content)

# 4. Remove Supabase clients block
supabase_clients_regex = r'function createSupabaseClient.*?getSupabaseServiceClient = cache\(\(\) =>\n\s*createSupabaseClient\(portalEnv\.supabaseServiceRoleKey\),\n\);\n'
content = re.sub(supabase_clients_regex, '', content, flags=re.DOTALL)

# 5. Remove mock data block and insert imports
mock_data_regex = r'export const bhkOptions = \[.*?\];\n.*?export const savedSearches: SavedSearch\[\] = \[.*?\];\n'
import_statement = 'import { profiles, localities, projects, listings, inquiries, savedSearches, bhkOptions, propertyTypes, amenityOptions } from "./mock-data";\n\n'
content = re.sub(mock_data_regex, import_statement, content, flags=re.DOTALL)

with open("src/lib/portal.ts", "w") as f:
    f.write(content)
