#!/bin/bash

# Migration script för att uppdatera hårdkodade typografi till centraliserade Tailwind-klasser
# Körs från: /home/lasse/Documents/Onboarding_App/tic-tac-toe-frontend

echo "🔧 Migrerar typografi till centraliserade klasser..."
echo ""

# Räknare
count_h1=0
count_h2=0
count_h3=0
count_icons=0

# 1. Migrera h1 rubriker: text-3xl font-bold → text-page-title
echo "📝 Migrerar H1-rubriker (text-3xl font-bold → text-page-title)..."
files_h1=$(grep -rl "text-3xl font-bold" src/components/)
for file in $files_h1; do
  sed -i 's/text-3xl font-bold/text-page-title/g' "$file"
  ((count_h1++))
  echo "  ✓ $file"
done

# 2. Migrera h2 rubriker: text-2xl font-bold → text-page-title
echo ""
echo "📝 Migrerar H2-rubriker (text-2xl font-bold → text-page-title)..."
files_h2=$(grep -rl "text-2xl font-bold" src/components/)
for file in $files_h2; do
  sed -i 's/text-2xl font-bold/text-page-title/g' "$file"
  ((count_h2++))
  echo "  ✓ $file"
done

# 3. Migrera h3 rubriker: text-xl font-bold → text-section-title
echo ""
echo "📝 Migrerar H3-rubriker (text-xl font-bold → text-section-title)..."
files_h3=$(grep -rl "text-xl font-bold" src/components/)
for file in $files_h3; do
  sed -i 's/text-xl font-bold/text-section-title/g' "$file"
  ((count_h3++))
  echo "  ✓ $file"
done

# 4. Migrera ikonstorlekar: w-7 h-7 → w-icon-md h-icon-md (för rubrikikoner)
echo ""
echo "📝 Migrerar ikonstorlekar (w-7 h-7 → w-icon-md h-icon-md)..."
files_icons=$(grep -rl "w-7 h-7" src/components/)
for file in $files_icons; do
  sed -i 's/w-7 h-7/w-icon-md h-icon-md/g' "$file"
  ((count_icons++))
  echo "  ✓ $file"
done

echo ""
echo "✅ Migration klar!"
echo ""
echo "📊 Statistik:"
echo "  • H1-rubriker (text-3xl): $count_h1 filer"
echo "  • H2-rubriker (text-2xl): $count_h2 filer"
echo "  • H3-rubriker (text-xl): $count_h3 filer"
echo "  • Ikoner (w-7 h-7): $count_icons filer"
echo ""
echo "🧪 Nästa steg: npm run dev och verifiera i browser"
