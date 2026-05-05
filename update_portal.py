import re

with open("src/lib/portal.ts", "r") as f:
    lines = f.readlines()

new_lines = []
skip = False

imports_added = False

for i, line in enumerate(lines):
    # Supabase import
    if "import { createClient, type SupabaseClient }" in line:
        continue
    
    # Supabase in env
    if "supabaseUrl" in line or "supabaseAnonKey" in line or "supabaseServiceRoleKey" in line:
        continue
    
    if "supabase: Boolean" in line:
        continue

    # Supabase clients block
    if "function createSupabaseClient" in line:
        skip = True
    if skip and "export const getSupabaseServiceClient" in line:
        if ");" in line:
            skip = False
        continue
    if skip and line.startswith(");"):
        # We need a more robust check for the end of getSupabaseServiceClient
        pass

    if "export const bhkOptions" in line:
        if not imports_added:
            new_lines.append('import { profiles, localities, projects, listings, inquiries, savedSearches, bhkOptions, propertyTypes, amenityOptions } from "./mock-data";\n')
            imports_added = True
        skip = True

    if skip and line.startswith("];"):
        # this is the end of an array block, maybe the last one?
        if "export const savedSearches" in "".join(lines[:i]):
            skip = False
            continue

    if not skip:
        # Check if we are inside Supabase functions manually to avoid issues
        if "function createSupabaseClient" in line or "export const getSupabasePublicClient" in line or "export const getSupabaseServiceClient" in line:
            skip = True
            
        if not skip:
            new_lines.append(line)
        
        if skip and line.startswith(");"):
             skip = False

# This is a bit risky. Let's do it safely.
