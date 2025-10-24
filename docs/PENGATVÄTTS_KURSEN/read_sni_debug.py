import pandas as pd
xlsx = 'sni-2025-struktur.xlsx'
df = pd.read_excel(xlsx, dtype=str)
print('COLUMNS:', df.columns.tolist())
print('\nFIRST 30 ROWS:')
print(df.head(30).to_string(index=False))
# show any row where any cell contains '41' '42' or '43'
mask = df.apply(lambda row: row.astype(str).str.contains('^\s*41|^\s*42|^\s*43', regex=True).any(), axis=1)
print('\nROWS THAT MATCH PREFIX 41/42/43 in any cell:')
print(df[mask].to_string(index=False))
print('\nDONE')
