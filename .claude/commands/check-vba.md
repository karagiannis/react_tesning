# /check-vba - Compare output with VBA

Compare Python SIE parser output with VBA Excel program CSV exports.

```bash
cd /home/lasse/Documents/Onboarding_App/tic-tac-toe-app/backend
./venv/bin/pytest tests/test_sie_parser.py::TestImportChartOfAccounts::test_output_matches_vba_csv -v
```

Verify that Python parser produces identical results to VBA implementation.
