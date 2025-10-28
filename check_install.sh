#!/bin/bash
# Monitor olmOCR installation progress

echo "=== Checking pip installation status ==="
ps aux | grep -E "pip" | grep -v grep

echo -e "\n=== Last 5 lines of installation log ==="
tail -5 /tmp/pip_install.log 2>/dev/null || echo "Log file not found yet"

echo -e "\n=== Check if process is downloading (network activity) ==="
if command -v nethogs &> /dev/null; then
    sudo nethogs -c 1 -d 1 2>/dev/null | head -10
elif command -v iftop &> /dev/null; then
    echo "Run: sudo iftop -t -s 2"
else
    echo "Install nethogs or iftop to see network activity: sudo apt install nethogs"
fi

echo -e "\n=== Disk activity (check if files are being written) ==="
iostat -x 1 2 2>/dev/null || echo "iostat not available (install: sudo apt install sysstat)"
