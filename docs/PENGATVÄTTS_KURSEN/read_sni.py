import sys
try:
    import pandas as pd
except Exception as e:
    print('ERROR_IMPORT', e)
    sys.exit(2)

xlsx = 'sni-2025-struktur.xlsx'
try:
    df = pd.read_excel(xlsx, dtype=str)
except Exception as e:
    print('ERROR_READ', e)
    sys.exit(3)

# Try to find likely columns: code and description
cols = df.columns.tolist()
# Print columns for debugging
print('COLUMNS:\t' + '\t'.join(cols))
# Try to find the column that looks like code
code_col = None
desc_col = None
for c in cols:
    lc = c.lower()
    if 'kod' in lc or 'sni' in lc or 'code' in lc or 'nummer' in lc:
        code_col = c
    if 'beskriv' in lc or 'description' in lc or 'namn' in lc:
        desc_col = c

if code_col is None:
    # fallback to first col
    code_col = cols[0]
if desc_col is None and len(cols) > 1:
    desc_col = cols[1]

print('USING:', code_col, '->', desc_col)

# Normalize and filter
rows = []
for _, r in df.iterrows():
    code = str(r.get(code_col, '')).strip()
    desc = str(r.get(desc_col, '')).strip()
    if not code:
        continue
    # Some codes might be like '41' or '41.20' or '41 20'
    prefix = code.replace(' ', '').split('.')[0][:2]
    if prefix in ('41','42','43') or 'bygg' in desc.lower():
        rows.append((code, desc))

if not rows:
    print('NO_MATCH')
else:
    for c,d in rows:
        print(f"{c}\t-\t{d}")

print('DONE')
