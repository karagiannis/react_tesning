# /test-coverage - Run tests with coverage report

Run tests and generate coverage report for the accounting module.

```bash
cd /home/lasse/Documents/Onboarding_App/tic-tac-toe-app/backend
./venv/bin/pytest tests/ --cov=accounting --cov-report=term-missing -v
```

Show coverage percentage and which lines are not covered.
