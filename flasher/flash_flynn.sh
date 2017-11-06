#!/bin/bash

espruino --board HEXBADGE.json main.flynn.js -ohex main.flynn.hex
echo ""

while true; do
RETRY=0

nrfjprog --family NRF52 --clockspeed 50000 --program firmware.hex --chiperase --reset || RETRY=1
#nrfjprog --family NRF52 --clockspeed 50000 --erasepage 0x71000-0x76000 || RETRY=1
if [ "$RETRY" -eq "0" ]; then
  nrfjprog --family NRF52 --clockspeed 50000 --program main.flynn.hex --reset ||  RETRY=1
fi

if [ "$RETRY" -eq "1" ]; then
  echo ""
  echo -e "\e[31m************************************************\e[0m"
  echo -e "\e[31m         Flashing failed - retrying             \e[0m"
  echo -e "\e[31m************************************************\e[0m"
  sleep 1s
else
  echo ""
  echo -e "\e[32m************************************************\e[0m"
  echo -e "\e[32m         Flashing OK!                           \e[0m"
  echo -e "\e[32m************************************************\e[0m"
#  sleep 3s  
  exit 0
fi
done
