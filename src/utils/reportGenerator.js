// Mock report endpoint - renderar HTML eller returnerar PDF-URL
// Simulerar Fortnox's report.php?output=htm/pdf

import { getMockReportData } from '../data/mockAccountingData';

/**
 * Mock backend endpoint för rapportgenerering
 * Hanterar: ?type=balance, ?r=gledger, ?r=voucher med &output=htm eller &output=pdf
 */
export function generateReport(searchParams) {
  const type = searchParams.get('type');
  const r = searchParams.get('r');
  const fromacct = searchParams.get('fromacct');
  const toacct = searchParams.get('toacct');
  const fromdate = searchParams.get('fromdate') || '2025-01-01';
  const todate = searchParams.get('todate') || '2025-12-31';
  const output = searchParams.get('output') || 'htm';
  const s = searchParams.get('s'); // Voucher series
  const i = searchParams.get('i'); // Voucher number
  const fid = searchParams.get('fid') || 'hyrupstars_ab';
  
  const data = getMockReportData({ type, r, fromacct, toacct, s, i });
  
  if (!data) {
    return `<html><body><h1>Rapport hittades inte</h1></body></html>`;
  }
  
  if (output === 'pdf') {
    // I en riktig app skulle detta generera PDF server-side
    // För mock: returnera en placeholder PDF-URL
    return {
      isPdf: true,
      url: `/mock-pdf-placeholder.pdf?type=${type || r}&account=${fromacct || 'N/A'}`
    };
  }
  
  // Generera HTML baserat på rapporttyp
  if (type === 'balance') {
    return generateBalanceSheetHTML(data, { fromdate, todate, fid });
  } else if (r === 'gledger') {
    return generateGeneralLedgerHTML(data, { fromdate, todate, fid });
  } else if (r === 'voucher') {
    return generateVoucherHTML(data, { fid });
  }
  
  return `<html><body><h1>Okänd rapporttyp</h1></body></html>`;
}

/**
 * Genererar Balansrapport HTML (Fortnox-stil)
 */
function generateBalanceSheetHTML(data, params) {
  const { fromdate, todate, fid } = params;
  
  const assetAccounts = data.accounts.filter(a => a.type === 'asset');
  const liabilityAccounts = data.accounts.filter(a => a.type === 'liability' || a.type === 'equity');
  
  return `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Balansrapport ${data.firmName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Arial, sans-serif; 
      padding: 20px; 
      background-color: #f7f9f8;
      color: #1a3a2e;
    }
    .header {
      background-color: #00704a;
      color: white;
      padding: 20px;
      border-radius: 8px 8px 0 0;
    }
    .header h1 { font-size: 24px; margin-bottom: 10px; }
    .header .meta { font-size: 14px; opacity: 0.9; }
    
    .content {
      background-color: white;
      padding: 30px;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .section-title {
      font-size: 18px;
      font-weight: bold;
      margin-top: 30px;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #00704a;
      color: #00704a;
    }
    .section-title:first-child { margin-top: 0; }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    
    thead tr {
      background-color: #e8f0ed;
      border-bottom: 2px solid #00704a;
    }
    
    th {
      padding: 12px;
      text-align: left;
      font-weight: bold;
      color: #1a3a2e;
      font-size: 14px;
    }
    th.amount { text-align: right; }
    
    tbody tr {
      border-bottom: 1px solid #e8f0ed;
      transition: background-color 0.2s;
    }
    tbody tr:hover {
      background-color: #f7f9f8;
    }
    
    td {
      padding: 10px 12px;
      font-size: 14px;
    }
    td.amount {
      text-align: right;
      font-family: 'Courier New', monospace;
    }
    
    a {
      color: #00704a;
      text-decoration: none;
      font-weight: 500;
    }
    a:hover {
      text-decoration: underline;
      color: #005c3d;
    }
    
    .total-row {
      font-weight: bold;
      background-color: #e8f0ed;
      border-top: 2px solid #00704a;
    }
    
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e8f0ed;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    
    .action-buttons {
      margin-top: 20px;
      display: flex;
      gap: 10px;
    }
    .btn {
      padding: 10px 20px;
      border: 2px solid #00704a;
      background-color: white;
      color: #00704a;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      font-size: 14px;
      transition: all 0.2s;
    }
    .btn:hover {
      background-color: #00704a;
      color: white;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📊 Balansrapport</h1>
    <div class="meta">
      ${data.firmName} (${data.orgNr})<br>
      Period: ${fromdate} till ${todate}
    </div>
  </div>
  
  <div class="content">
    <div class="section-title">TILLGÅNGAR</div>
    <table>
      <thead>
        <tr>
          <th>Konto</th>
          <th>Benämning</th>
          <th class="amount">Belopp (SEK)</th>
        </tr>
      </thead>
      <tbody>
        ${assetAccounts.map(account => `
          <tr>
            <td>
              <a href="?fid=${fid}&r=gledger&fromacct=${account.number}&toacct=${account.number}&fromdate=${fromdate}&todate=${todate}&output=htm">
                ${account.number}
              </a>
            </td>
            <td>${account.name}</td>
            <td class="amount">${formatCurrency(account.balance)}</td>
          </tr>
        `).join('')}
        <tr class="total-row">
          <td colspan="2">Summa tillgångar</td>
          <td class="amount">${formatCurrency(data.totals.assets)}</td>
        </tr>
      </tbody>
    </table>
    
    <div class="section-title">SKULDER & EGET KAPITAL</div>
    <table>
      <thead>
        <tr>
          <th>Konto</th>
          <th>Benämning</th>
          <th class="amount">Belopp (SEK)</th>
        </tr>
      </thead>
      <tbody>
        ${liabilityAccounts.map(account => `
          <tr>
            <td>
              <a href="?fid=${fid}&r=gledger&fromacct=${account.number}&toacct=${account.number}&fromdate=${fromdate}&todate=${todate}&output=htm">
                ${account.number}
              </a>
            </td>
            <td>${account.name}</td>
            <td class="amount">${formatCurrency(account.balance)}</td>
          </tr>
        `).join('')}
        <tr class="total-row">
          <td colspan="2">Summa skulder & eget kapital</td>
          <td class="amount">${formatCurrency(data.totals.liabilitiesAndEquity)}</td>
        </tr>
      </tbody>
    </table>
    
    <div class="action-buttons">
      <a href="?fid=${fid}&type=balance&fromdate=${fromdate}&todate=${todate}&output=pdf" class="btn">
        📄 Visa som PDF
      </a>
      <button onclick="window.print()" class="btn">🖨️ Skriv ut</button>
    </div>
    
    <div class="footer">
      Genererad ${new Date().toLocaleString('sv-SE')}
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Genererar Huvudbok HTML (Fortnox-stil)
 */
function generateGeneralLedgerHTML(data, params) {
  const { fromdate, todate, fid } = params;
  
  return `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Huvudbok ${data.account} - ${data.accountName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Arial, sans-serif; 
      padding: 20px; 
      background-color: #f7f9f8;
      color: #1a3a2e;
    }
    .header {
      background-color: #00704a;
      color: white;
      padding: 20px;
      border-radius: 8px 8px 0 0;
    }
    .header h1 { font-size: 24px; margin-bottom: 10px; }
    .header .meta { font-size: 14px; opacity: 0.9; }
    
    .content {
      background-color: white;
      padding: 30px;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .breadcrumb {
      margin-bottom: 20px;
      font-size: 14px;
      color: #666;
    }
    .breadcrumb a {
      color: #00704a;
      text-decoration: none;
    }
    .breadcrumb a:hover { text-decoration: underline; }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    
    thead tr {
      background-color: #e8f0ed;
      border-bottom: 2px solid #00704a;
    }
    
    th {
      padding: 12px;
      text-align: left;
      font-weight: bold;
      color: #1a3a2e;
      font-size: 14px;
    }
    th.amount { text-align: right; }
    
    tbody tr {
      border-bottom: 1px solid #e8f0ed;
      transition: background-color 0.2s;
    }
    tbody tr:hover {
      background-color: #f7f9f8;
    }
    
    td {
      padding: 10px 12px;
      font-size: 14px;
    }
    td.amount {
      text-align: right;
      font-family: 'Courier New', monospace;
    }
    
    a {
      color: #00704a;
      text-decoration: none;
      font-weight: 500;
    }
    a:hover {
      text-decoration: underline;
      color: #005c3d;
    }
    
    .balance-row {
      font-weight: bold;
      background-color: #e8f0ed;
    }
    
    .action-buttons {
      margin-top: 20px;
      display: flex;
      gap: 10px;
    }
    .btn {
      padding: 10px 20px;
      border: 2px solid #00704a;
      background-color: white;
      color: #00704a;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      font-size: 14px;
      transition: all 0.2s;
    }
    .btn:hover {
      background-color: #00704a;
      color: white;
    }
    
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e8f0ed;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📖 Huvudbok</h1>
    <div class="meta">
      Konto: ${data.account} - ${data.accountName}<br>
      Period: ${fromdate} till ${todate}
    </div>
  </div>
  
  <div class="content">
    <div class="breadcrumb">
      <a href="?fid=${fid}&type=balance&fromdate=${fromdate}&todate=${todate}&output=htm">← Tillbaka till Balansrapport</a>
    </div>
    
    <table>
      <thead>
        <tr>
          <th>Vernr</th>
          <th>Ks</th>
          <th>Datum</th>
          <th>Text</th>
          <th class="amount">Debet</th>
          <th class="amount">Kredit</th>
          <th class="amount">Saldo</th>
        </tr>
      </thead>
      <tbody>
        <tr class="balance-row">
          <td colspan="6">Ingående balans</td>
          <td class="amount">${formatCurrency(data.openingBalance)}</td>
        </tr>
        ${data.transactions.map(tx => `
          <tr>
            <td>
              <a href="?fid=${fid}&r=voucher&s=${tx.series}&i=${tx.number}&output=htm">
                ${tx.series}${tx.number}
              </a>
            </td>
            <td></td>
            <td>${tx.date}</td>
            <td>${tx.text}</td>
            <td class="amount">${tx.debit > 0 ? formatCurrency(tx.debit) : ''}</td>
            <td class="amount">${tx.credit > 0 ? formatCurrency(tx.credit) : ''}</td>
            <td class="amount">${formatCurrency(tx.balance)}</td>
          </tr>
        `).join('')}
        <tr class="balance-row">
          <td colspan="6">Utgående balans</td>
          <td class="amount">${formatCurrency(data.closingBalance)}</td>
        </tr>
      </tbody>
    </table>
    
    <div class="action-buttons">
      <a href="?fid=${fid}&r=gledger&fromacct=${data.account}&toacct=${data.account}&fromdate=${fromdate}&todate=${todate}&output=pdf" class="btn">
        📄 Visa som PDF
      </a>
      <button onclick="window.print()" class="btn">🖨️ Skriv ut</button>
    </div>
    
    <div class="footer">
      Genererad ${new Date().toLocaleString('sv-SE')}
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Genererar Verifikation HTML (Fortnox-stil) med underlagsdokument
 */
function generateVoucherHTML(data, params) {
  const { fid } = params;
  
  const hasFraudFlags = data.forensicFlags?.multipleBusinessEvents;
  
  return `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifikation ${data.series}${data.number}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Arial, sans-serif; 
      padding: 20px; 
      background-color: #f7f9f8;
      color: #1a3a2e;
    }
    .header {
      background-color: #00704a;
      color: white;
      padding: 20px;
      border-radius: 8px 8px 0 0;
    }
    .header h1 { font-size: 24px; margin-bottom: 10px; }
    .header .meta { font-size: 14px; opacity: 0.9; }
    
    .content {
      background-color: white;
      padding: 30px;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .breadcrumb {
      margin-bottom: 20px;
      font-size: 14px;
      color: #666;
    }
    .breadcrumb a {
      color: #00704a;
      text-decoration: none;
    }
    .breadcrumb a:hover { text-decoration: underline; }
    
    .voucher-info {
      background-color: #f7f9f8;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 20px;
      font-size: 14px;
    }
    .voucher-info strong { color: #00704a; }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    
    thead tr {
      background-color: #e8f0ed;
      border-bottom: 2px solid #00704a;
    }
    
    th {
      padding: 12px;
      text-align: left;
      font-weight: bold;
      color: #1a3a2e;
      font-size: 14px;
    }
    th.amount { text-align: right; }
    
    tbody tr {
      border-bottom: 1px solid #e8f0ed;
    }
    
    td {
      padding: 10px 12px;
      font-size: 14px;
    }
    td.amount {
      text-align: right;
      font-family: 'Courier New', monospace;
    }
    
    .total-row {
      font-weight: bold;
      background-color: #e8f0ed;
      border-top: 2px solid #00704a;
    }
    
    .attachments {
      margin-top: 30px;
    }
    .attachments h2 {
      font-size: 18px;
      color: #00704a;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #00704a;
    }
    
    .attachment-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 15px;
    }
    
    .attachment-card {
      border: 1px solid #e8f0ed;
      border-radius: 6px;
      padding: 15px;
      transition: all 0.2s;
      cursor: pointer;
    }
    .attachment-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-color: #00704a;
    }
    .attachment-card.flagged {
      border-color: #dc3545;
      background-color: #fff5f5;
    }
    
    .attachment-icon {
      font-size: 40px;
      margin-bottom: 10px;
    }
    .attachment-name {
      font-weight: bold;
      margin-bottom: 5px;
      font-size: 14px;
      word-break: break-word;
    }
    .attachment-meta {
      font-size: 12px;
      color: #666;
      margin-bottom: 8px;
    }
    .attachment-ocr {
      font-size: 12px;
      background-color: #e8f0ed;
      padding: 5px 8px;
      border-radius: 4px;
      margin-top: 8px;
    }
    .attachment-ocr.flagged {
      background-color: #ffe8e8;
      color: #dc3545;
    }
    .match-confidence {
      display: inline-block;
      background-color: #00704a;
      color: white;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 11px;
      margin-top: 5px;
    }
    
    .fraud-warning {
      background-color: #ffe8e8;
      border: 2px solid #dc3545;
      border-radius: 6px;
      padding: 20px;
      margin-bottom: 30px;
    }
    .fraud-warning h3 {
      color: #dc3545;
      margin-bottom: 10px;
      font-size: 18px;
    }
    .fraud-warning ul {
      margin-left: 20px;
      margin-top: 10px;
    }
    .fraud-warning li {
      margin-bottom: 8px;
      color: #333;
    }
    
    .action-buttons {
      margin-top: 20px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .btn {
      padding: 10px 20px;
      border: 2px solid #00704a;
      background-color: white;
      color: #00704a;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      font-size: 14px;
      transition: all 0.2s;
    }
    .btn:hover {
      background-color: #00704a;
      color: white;
    }
    .btn.danger {
      border-color: #dc3545;
      color: #dc3545;
    }
    .btn.danger:hover {
      background-color: #dc3545;
      color: white;
    }
    
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e8f0ed;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📝 Verifikation ${data.series} ${data.number}</h1>
    <div class="meta">
      Datum: ${data.date}<br>
      ${data.description}
    </div>
  </div>
  
  <div class="content">
    <div class="breadcrumb">
      <a href="javascript:history.back()">← Tillbaka</a>
    </div>
    
    ${hasFraudFlags ? `
    <div class="fraud-warning">
      <h3>🚨 Forensisk varning</h3>
      <p><strong>Flera affärshändelser detekterade i samma verifikation</strong></p>
      <ul>
        <li>Antal bifogade dokument: <strong>${data.attachments.length}</strong></li>
        <li>Misstänkta privata inköp: <strong>${data.forensicFlags.suspiciousItems}</strong></li>
        <li><strong>Rekommendation:</strong> ${data.forensicFlags.recommendation}</li>
      </ul>
      <div style="margin-top: 15px;">
        <button class="btn danger">Dela upp verifikation automatiskt</button>
      </div>
    </div>
    ` : ''}
    
    <div class="voucher-info">
      <strong>Senaste vernr:</strong> 
      ${Object.entries(data.lastVoucherNumbers).map(([series, num]) => `${series} ${num}`).join(', ')}
    </div>
    
    <table>
      <thead>
        <tr>
          <th>Konto</th>
          <th>Ks</th>
          <th>Benämning</th>
          <th>Text</th>
          <th class="amount">Debet</th>
          <th class="amount">Kredit</th>
        </tr>
      </thead>
      <tbody>
        ${data.lines.map(line => `
          <tr>
            <td>${line.account}</td>
            <td>${line.costCenter || ''}</td>
            <td>${line.accountName}</td>
            <td>${line.text}</td>
            <td class="amount">${line.debit > 0 ? formatCurrency(line.debit) : ''}</td>
            <td class="amount">${line.credit > 0 ? formatCurrency(line.credit) : ''}</td>
          </tr>
        `).join('')}
        <tr class="total-row">
          <td colspan="4">Antal transaktioner: ${data.lines.length} • Omslutning:</td>
          <td class="amount">${formatCurrency(data.totalDebit)}</td>
          <td class="amount">${formatCurrency(data.totalCredit)}</td>
        </tr>
      </tbody>
    </table>
    
    ${data.attachments && data.attachments.length > 0 ? `
    <div class="attachments">
      <h2>📎 Bifogade underlagsdokument (${data.attachments.length})</h2>
      <div class="attachment-grid">
        ${data.attachments.map((doc, index) => `
          <div class="attachment-card ${doc.flagged ? 'flagged' : ''}" onclick="alert('Öppnar dokument: ${doc.filename}')">
            <div class="attachment-icon">📄</div>
            <div class="attachment-name">${doc.filename}</div>
            <div class="attachment-meta">
              Uppladdad: ${doc.uploadDate}<br>
              Storlek: ${(doc.size / 1024).toFixed(1)} KB
            </div>
            <div class="attachment-ocr ${doc.flagged ? 'flagged' : ''}">
              <strong>OCR-data:</strong><br>
              Belopp: ${formatCurrency(doc.ocrAmount)}<br>
              Leverantör: ${doc.ocrSupplier}
              ${doc.flagged ? `<br><strong>⚠️ ${doc.flagReason}</strong>` : ''}
            </div>
            <span class="match-confidence">Match: ${(doc.matchConfidence * 100).toFixed(0)}%</span>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}
    
    <div class="action-buttons">
      <a href="?fid=${fid}&r=voucher&s=${data.series}&i=${data.number}&output=pdf" class="btn">
        📄 Visa som PDF
      </a>
      <button onclick="window.print()" class="btn">🖨️ Skriv ut</button>
      <button class="btn">✏️ Redigera</button>
    </div>
    
    <div class="footer">
      Genererad ${new Date().toLocaleString('sv-SE')}
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Helper: Formatera belopp till SEK
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('sv-SE', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}
