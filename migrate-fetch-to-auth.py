#!/usr/bin/env python3
"""
Migrate fetch() calls to fetchWithAuth() in slide components.

This script:
1. Finds all .jsx files with Bearer token authentication
2. Adds import { fetchWithAuth } from '../../utils/auth'
3. Replaces fetch() with fetchWithAuth()
4. Removes manual Authorization headers
5. Removes manual token fetching (const token = localStorage.getItem('accessToken'))

Usage:
    python3 migrate-fetch-to-auth.py [--dry-run] [--file FILE]
"""

import re
import sys
import argparse
from pathlib import Path
from typing import List, Tuple

# Base directory
BASE_DIR = Path(__file__).parent
SLIDES_DIR = BASE_DIR / "src" / "components" / "Slides"


def has_bearer_auth(content: str) -> bool:
    """Check if file has Bearer token authentication."""
    return bool(re.search(r"Authorization.*Bearer.*token", content, re.IGNORECASE))


def already_migrated(content: str) -> bool:
    """Check if file already uses fetchWithAuth."""
    return "fetchWithAuth" in content


def add_import_if_missing(content: str) -> str:
    """Add fetchWithAuth import if not present."""
    if "fetchWithAuth" in content:
        return content
    
    # Find first import statement
    import_match = re.search(r"^(import\s+.*?;?\s*$)", content, re.MULTILINE)
    if not import_match:
        # No imports found, add at top
        return "import { fetchWithAuth } from '../../utils/auth';\n\n" + content
    
    # Add after first import
    insert_pos = import_match.end()
    return (
        content[:insert_pos] + 
        "\nimport { fetchWithAuth } from '../../utils/auth';" + 
        content[insert_pos:]
    )


def remove_token_fetching(content: str) -> str:
    """Remove manual token fetching from localStorage."""
    # Pattern: const token = localStorage.getItem('accessToken'); or ("accessToken")
    # Also handles newlines after the statement
    content = re.sub(
        r"\s*const\s+token\s*=\s*localStorage\.getItem\(['\"]accessToken['\"]\);\s*\n?",
        "\n",
        content
    )
    
    # Clean up multiple consecutive newlines (max 2)
    content = re.sub(r"\n{3,}", "\n\n", content)
    
    return content


def replace_fetch_with_auth(content: str) -> Tuple[str, int]:
    """
    Replace fetch() with fetchWithAuth() and remove Authorization headers.
    
    Returns:
        Tuple of (modified_content, number_of_replacements)
    """
    replacements = 0
    
    # Step 1: Replace "fetch(" with "fetchWithAuth(" 
    # (simple replacement, works for all cases)
    original_content = content
    content = re.sub(r'\bfetch\(', 'fetchWithAuth(', content)
    
    # Count replacements by comparing
    replacements = len(re.findall(r'\bfetchWithAuth\(', content))
    
    # Step 2: Remove Authorization header lines
    # Pattern: 'Authorization': `Bearer ${token}`,
    content = re.sub(
        r"\s*['\"]Authorization['\"]\s*:\s*`Bearer\s*\$\{token\}`\s*,?\s*\n?",
        "",
        content
    )
    
    # Step 3: Clean up headers object if it's now empty or has trailing commas
    content = re.sub(r"headers:\s*\{\s*\n\s*,", "headers: {\n", content)
    content = re.sub(r"headers:\s*\{\s*\n\s*\}", "headers: {}", content)
    content = re.sub(r",(\s*)\n(\s*)\}", r"\1\n\2}", content)
    
    return content, replacements


def migrate_file(file_path: Path, dry_run: bool = False) -> Tuple[bool, str]:
    """
    Migrate a single file.
    
    Returns:
        Tuple of (success, message)
    """
    try:
        content = file_path.read_text(encoding='utf-8')
        
        # Check if migration needed
        if not has_bearer_auth(content):
            return True, f"⏭️  SKIP: No Bearer auth found"
        
        if already_migrated(content):
            return True, f"✅ SKIP: Already uses fetchWithAuth"
        
        # Perform migration
        original_content = content
        
        # Step 1: Add import
        content = add_import_if_missing(content)
        
        # Step 2: Replace fetch with fetchWithAuth
        content, replacements = replace_fetch_with_auth(content)
        
        # Step 3: Remove token fetching
        content = remove_token_fetching(content)
        
        if content == original_content:
            return True, f"⏭️  SKIP: No changes needed"
        
        if dry_run:
            return True, f"🔍 DRY-RUN: Would replace {replacements} fetch() calls"
        
        # Write changes
        file_path.write_text(content, encoding='utf-8')
        return True, f"✅ SUCCESS: Replaced {replacements} fetch() calls"
        
    except Exception as e:
        return False, f"❌ ERROR: {str(e)}"


def main():
    parser = argparse.ArgumentParser(
        description='Migrate fetch() to fetchWithAuth() in slide components'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Show what would be changed without modifying files'
    )
    parser.add_argument(
        '--file',
        type=str,
        help='Migrate specific file (relative to src/components/Slides/)'
    )
    
    args = parser.parse_args()
    
    # Get files to process
    if args.file:
        files = [SLIDES_DIR / args.file]
    else:
        files = sorted(SLIDES_DIR.glob("*.jsx"))
    
    print("=" * 70)
    print("🔄 FETCH → FETCHWITHAUTH MIGRATION")
    print("=" * 70)
    print(f"Mode: {'DRY-RUN' if args.dry_run else 'LIVE'}")
    print(f"Files: {len(files)}")
    print()
    
    # Process files
    results = []
    for file_path in files:
        if not file_path.exists():
            print(f"❌ {file_path.name}: File not found")
            continue
        
        success, message = migrate_file(file_path, dry_run=args.dry_run)
        results.append((file_path.name, success, message))
        print(f"{file_path.name:40} | {message}")
    
    # Summary
    print()
    print("=" * 70)
    print("📊 SUMMARY")
    print("=" * 70)
    
    successful = sum(1 for _, success, msg in results if success and "SUCCESS" in msg)
    skipped = sum(1 for _, success, msg in results if "SKIP" in msg)
    errors = sum(1 for _, success, _ in results if not success)
    
    print(f"✅ Migrated:  {successful}")
    print(f"⏭️  Skipped:   {skipped}")
    print(f"❌ Errors:    {errors}")
    print()
    
    if args.dry_run:
        print("💡 Run without --dry-run to apply changes")
    else:
        print("✅ Migration complete!")
        print()
        print("Next steps:")
        print("1. Review changes: git diff src/components/Slides/")
        print("2. Test locally: npm run dev")
        print("3. Commit: git add . && git commit -m 'feat: Migrate all slides to fetchWithAuth'")
        print("4. Push: git push origin main")
    
    return 0 if errors == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
