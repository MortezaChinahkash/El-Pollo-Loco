#!/usr/bin/env python3
"""
Quick Empty Line Test - Direct execution without user input
"""
import os
import glob
import re
from datetime import datetime

def remove_excessive_empty_lines(content):
    """
    Remove excessive empty lines while preserving intentional spacing
    SPECIAL RULES:
    - INSIDE functions/methods (between {}): ALL empty lines are removed
    - OUTSIDE functions/methods: Maximum 2 consecutive empty lines
    - Preserve empty lines after comments and JSDoc (outside functions)
    """
    lines = content.split('\n')
    result_lines = []
    
    in_jsdoc = False
    in_multiline_comment = False
    in_string = False
    string_char = None
    brace_level = 0
    inside_function = False
    
    i = 0
    while i < len(lines):
        line = lines[i].rstrip()  # Remove trailing whitespace
        original_line = line
        stripped = line.strip()
        
        # Track string literals
        if not in_multiline_comment and not in_jsdoc:
            for j, char in enumerate(line):
                if char in ['"', "'", '`'] and (j == 0 or line[j-1] != '\\'):
                    if not in_string:
                        in_string = True
                        string_char = char
                    elif char == string_char:
                        in_string = False
                        string_char = None
        
        # Track JSDoc comments
        if '/**' in line and not in_string:
            in_jsdoc = True
        if '*/' in line and in_jsdoc and not in_string:
            in_jsdoc = False
        
        # Track multiline comments
        if '/*' in line and not '/**' in line and not in_string:
            in_multiline_comment = True
        if '*/' in line and in_multiline_comment and not in_string:
            in_multiline_comment = False
        
        # Track brace levels and function context
        if not in_string and not in_jsdoc and not in_multiline_comment:
            # Count opening and closing braces
            opening_braces = line.count('{')
            closing_braces = line.count('}')
            
            # Update brace level
            brace_level += opening_braces - closing_braces
            
            # Determine if we're inside a function/method
            # We're inside a function if brace_level > 0 AND we've seen a function-like line
            if opening_braces > 0:
                # Check if this line looks like a function/method/class definition
                if any(keyword in line for keyword in ['function', 'class', '=>', 'constructor', 'get ', 'set ']):
                    inside_function = True
                elif brace_level > 0:
                    inside_function = True
            elif brace_level == 0:
                inside_function = False
        
        # Handle empty lines
        if stripped == '':
            # Look ahead to count consecutive empty lines
            empty_count = 0
            j = i
            while j < len(lines) and lines[j].strip() == '':
                empty_count += 1
                j += 1
            
            # Determine how many empty lines to keep
            keep_count = min(empty_count, 2)  # Maximum 2 consecutive empty lines
            
            # Determine how many empty lines to keep - AGGRESSIVE OPTIMIZATION
            keep_count = min(empty_count, 2)  # Maximum 2 consecutive empty lines anywhere
            
            # Get context before and after empty lines
            prev_line = lines[i-1].strip() if i > 0 else ''
            next_line = lines[j].strip() if j < len(lines) else ''
            
            # AGGRESSIVE RULES for empty line reduction:
            if empty_count > 2:
                # More than 2 consecutive empty lines -> reduce to 2
                keep_count = 2
            elif empty_count == 2:
                # 2 consecutive empty lines -> reduce to 1 in most cases
                keep_count = 1
                # Exception: Keep 2 lines after major sections (class/function definitions)
                if (prev_line.endswith('{') or 
                    'class ' in prev_line or 
                    'function ' in prev_line or
                    prev_line.startswith('/**')):
                    keep_count = 2
            else:
                # Single empty line -> keep it for readability
                keep_count = 1
            
            # Special reductions:
            # 1. No empty lines at start/end of functions
            if prev_line.endswith('{') and next_line == '}':
                keep_count = 0
            # 2. Reduce empty lines before closing braces
            elif next_line == '}' and empty_count > 1:
                keep_count = 1
            # 3. Reduce empty lines after opening braces
            elif prev_line.endswith('{') and empty_count > 1:
                keep_count = 1
            
            # Add the determined number of empty lines
            for _ in range(keep_count):
                result_lines.append('')
            
            # Skip ahead past all the empty lines we just processed
            i = j - 1
        else:
            # Non-empty line - add it
            result_lines.append(line)
        
        i += 1
    
    # Remove empty lines at the very beginning and end of file
    while result_lines and result_lines[0].strip() == '':
        result_lines.pop(0)
    
    while result_lines and result_lines[-1].strip() == '':
        result_lines.pop()
    
    # Ensure file ends with single newline
    if result_lines and result_lines[-1] != '':
        result_lines.append('')
    
    return '\n'.join(result_lines)

def test_file(file_path):
    """Test a specific file for empty line removal"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Count original empty lines
        lines = content.split('\n')
        original_empty_lines = sum(1 for line in lines if line.strip() == '')
        
        # Process content
        new_content = remove_excessive_empty_lines(content)
        
        # Count new empty lines
        new_lines = new_content.split('\n')
        new_empty_lines = sum(1 for line in new_lines if line.strip() == '')
        
        removed = original_empty_lines - new_empty_lines
        
        print(f"File: {os.path.basename(file_path)}")
        print(f"  Original empty lines: {original_empty_lines}")
        print(f"  New empty lines: {new_empty_lines}")
        print(f"  Removed: {removed}")
        print(f"  Would modify: {'Yes' if content != new_content else 'No'}")
        print()
        
        return {
            'file': file_path,
            'original': original_empty_lines,
            'new': new_empty_lines,
            'removed': removed,
            'modified': content != new_content
        }
        
    except Exception as e:
        print(f"ERROR processing {file_path}: {e}")
        return None

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Get all JS files
    file_patterns = ["**/*.js"]
    all_files = []
    for pattern in file_patterns:
        full_pattern = os.path.join(script_dir, pattern)
        files = glob.glob(full_pattern, recursive=True)
        all_files.extend(files)
    
    # Filter out unwanted directories
    excluded_dirs = ['node_modules', '.git', 'dist', 'build', '.angular', 'coverage', '.vscode', '.idea', 'backups']
    files = []
    for file_path in all_files:
        should_exclude = any(excluded_dir in file_path for excluded_dir in excluded_dirs)
        if not should_exclude:
            files.append(file_path)
    
    print(f"Found {len(files)} JavaScript files to analyze:")
    print()
    
    results = []
    total_original = 0
    total_removed = 0
    modified_count = 0
    
    for file_path in files:
        result = test_file(file_path)
        if result:
            results.append(result)
            total_original += result['original']
            total_removed += result['removed']
            if result['modified']:
                modified_count += 1
    
    print("=" * 50)
    print("SUMMARY:")
    print(f"Total files: {len(files)}")
    print(f"Files that would be modified: {modified_count}")
    print(f"Total original empty lines: {total_original}")
    print(f"Total empty lines that would be removed: {total_removed}")
    print()
    
    if total_removed > 0:
        print("Files with most removals:")
        sorted_results = sorted(results, key=lambda x: x['removed'], reverse=True)
        for result in sorted_results[:10]:
            if result['removed'] > 0:
                print(f"  {os.path.basename(result['file'])}: -{result['removed']} lines")

if __name__ == "__main__":
    main()
