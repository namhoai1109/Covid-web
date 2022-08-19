@echo off

start "Covid Server" cmd /c "cd ./server & npm i & npm start"
@REM start "Covid Client" cmd /c "cd ./client & npm i & npm start"
start "Payment Server" cmd /c "cd ./payment_system & npm i & npm start"
@REM start "Payment Client" cmd /c "cd ./client_payment & npm i & npm start"