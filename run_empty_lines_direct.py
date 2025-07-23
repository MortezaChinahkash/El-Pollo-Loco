#!/usr/bin/env python3
"""
Direct execution of empty line removal - no user input required
"""
import os
import sys

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from remove_empty_lines import scan_and_remove_empty_lines, Colors

def mock_ask_for_backup():
    """Mock function that returns False (no backup)"""
    print(Colors.colorize("🔒 BACKUP OPTION", Colors.BOLD + Colors.CYAN))
    print(Colors.colorize("The Empty Line Remover will modify your files.", Colors.YELLOW))
    print(Colors.colorize("It's recommended to create backups before proceeding.", Colors.YELLOW))
    print()
    print(Colors.colorize("Create backups before removing empty lines? (y/n): n", Colors.BOLD + Colors.CYAN))
    print(Colors.colorize("No backup will be created.", Colors.YELLOW))
    return False

# Replace the ask_for_backup function
import remove_empty_lines
remove_empty_lines.ask_for_backup = mock_ask_for_backup

if __name__ == "__main__":
    print(Colors.colorize("🚀 Empty Line Removal Tool - DIRECT EXECUTION", Colors.CYAN))
    print(Colors.colorize("=" * 50, Colors.CYAN))
    print(Colors.colorize("📏 Optimizes empty lines in JS/TS files", Colors.GREEN))
    print(Colors.colorize("🧹 Removes excessive empty lines (max 2 consecutive)", Colors.YELLOW))
    print(Colors.colorize("💡 Preserves intentional spacing for readability", Colors.BLUE))
    print(Colors.colorize("⚠️  WARNING: This will modify your files!", Colors.YELLOW))
    print()
    
    print(Colors.colorize("Proceeding automatically...", Colors.GREEN))
    scan_and_remove_empty_lines()
    print(Colors.colorize("\n✅ Empty line optimization process completed!", Colors.GREEN))
