#!/bin/bash

# Migration script: Convert all QUESTIONS_CONFIG to entireForm protocol
# Usage: ./migrate_to_entireform.sh

set -e

SLIDES_DIR="src/components/Slides"

echo "🔄 Starting migration to entireForm protocol..."
echo ""

# List of slides to convert (excluding already migrated ones)
SLIDES=(
  "RiskFragorSlide.jsx"
  "UppdragsvalsSlide.jsx"
)

for slide in "${SLIDES[@]}"; do
  file="$SLIDES_DIR/$slide"
  
  if [ ! -f "$file" ]; then
    echo "⚠️  Skipping $slide (not found)"
    continue
  fi
  
  echo "📝 Processing: $slide"
  
  # Backup
  cp "$file" "${file}.bak"
  
  # Check if already using entireForm
  if grep -q "entireForm: { type: 'object'" "$file"; then
    echo "   ✅ Already using entireForm"
    rm "${file}.bak"
    continue
  fi
  
  # This slide needs manual conversion due to complexity
  echo "   ⚠️  Requires manual conversion (complex structure)"
  echo "   💾 Backup saved: ${file}.bak"
  
done

echo ""
echo "✅ Migration script complete!"
echo ""
echo "⚠️  MANUAL STEPS REQUIRED:"
echo "1. Review RiskFragorSlide.jsx - convert q1-q7 to entireForm"
echo "2. Review UppdragsvalsSlide.jsx - ensure services/orgnr/companyName structure"
echo "3. Test each slide after conversion"
echo "4. Remove .bak files when confirmed working"
echo ""
echo "🔍 Files to review:"
ls -lh "$SLIDES_DIR"/*.bak 2>/dev/null || echo "   (none created)"
