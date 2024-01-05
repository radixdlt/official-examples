@echo off

echo Setting up Scrypto Environment and Package

echo.
echo Resetting radix engine simulator...
resim reset

echo.
echo Creating new account...
for /f "tokens=2 delims=: " %%a in ('resim new-account') do set temp_account=%%a
echo %temp_account%
for /f "tokens=2 delims=: " %%a in ('echo %temp_account% ^| findstr /C:"Account" ^| findstr /C:"account_"') do set account=%%a
for /f "tokens=3 delims=: " %%a in ('echo %temp_account% ^| findstr /C:"Private"') do set privatekey=%%a
for /f "tokens=2 delims=: " %%a in ('echo %temp_account% ^| findstr /C:"Owner" ^| findstr /C:"resource_"') do set account_badge=%%a
for /f "tokens=3 delims=: " %%a in ('resim show %account% ^| findstr /C:"XRD" ^| findstr /C:"resource_"') do set xrd=%%a

echo.
echo Publishing package...
for /f "tokens=3 delims=: " %%a in ('resim publish . ^| findstr /C:"Success! New Package:"') do set package=%%a

echo.
echo Setup Complete
echo --------------------------
echo Environment variables set:
echo account = %account%
echo privatekey = %privatekey%
echo account_badge = %account_badge%
echo xrd = %xrd%
echo package = %package%
