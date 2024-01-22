@echo off
setlocal enabledelayedexpansion

echo Setting up Scrypto Environment and Package

echo.
echo Resetting radix engine simulator...
resim reset

echo.
echo Creating new account...
for /f "tokens=1,* delims=:" %%a in ('resim new-account') do (
    set "key=%%a"
    set "value=%%b"
    if defined value (
        rem Trim spaces
        for /f "tokens=1,* delims= " %%a in ("!value!") do set "value=%%a"

        if "!key!"=="Account component address" set "account=!value!"
        if "!key!"=="Private key" set "privatekey=!value!"
        if "!key!"=="Owner badge" set "account_badge=!value!"    
    )   
)

for /f "tokens=2 delims=: " %%a in ('resim show %account% ^| findstr /C:"XRD" ^| findstr /C:"resource_"') do set "xrd=%%a"

echo.
echo Publishing package...
for /f "tokens=4 delims=: " %%a in ('resim publish . ^| findstr /C:"Success! New Package:"') do set package=%%a

echo.
echo Setup Complete
echo --------------------------
echo Environment variables set:
echo account = %account%
echo privatekey = %privatekey%
echo account_badge = %account_badge%
echo xrd = %xrd%
echo package = %package%
