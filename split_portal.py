import re

with open("src/lib/portal.ts", "r") as f:
    lines = f.readlines()

portal_lines = []
mock_data_lines = []

types_and_imports = []

capturing_mock = False
current_mock_block = []

mock_keywords = [
    "export const bhkOptions",
    "export const propertyTypes",
    "export const amenityOptions",
    "export const profiles:",
    "export const localities:",
    "export const projects:",
    "export const listings:",
    "export const inquiries:",
    "export const savedSearches:"
]

for i, line in enumerate(lines):
    if line.startswith("import") or line.startswith("export type") or line.startswith("export interface"):
        types_and_imports.append(line)

for line in lines:
    is_start = any(line.startswith(kw) for kw in mock_keywords)
    
    if is_start:
        capturing_mock = True
        
    if capturing_mock:
        mock_data_lines.append(line)
        if line.startswith("];"):
            capturing_mock = False
    else:
        if not is_start:
            # We skip pushing the line if it was part of a block, wait, the start line is already pushed.
            portal_lines.append(line)

# Let's verify the logic
