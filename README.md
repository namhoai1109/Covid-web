# Covid Web App Project

A COVID-19 Web App final project for the Web Development class at HCMUS.

## Introduction

The website comes with 3 account tiers:

- Admin (tier 1)
- Doctor (tier 2 manager)
- Patient (tier 3 user)

For the detailed functionalities, please refer to the requirements.pdf file for more informations (the file is in Vietnamese, no English version for the moment).

Technologies used:

- Front-end: React.js
- Back-end: Node.js, Express.js, MongoDB

## Prerequisites

1. Install npm and Node.js
2. Allow invalid certificate in the browser (go to flags in the address bar and search for "Allow invalid certificates" and click "Enabled" )

## Run

The project comes with a pre-built script file to run all the necessary services.

- For Linux, locate to the project folder and run the following command (make sure to enable execution permission):
  ```
  sudo chmod +x run.sh
  ./run.sh
  ```
- For Windows:
  1.  Locate to client_payment folder
  2.  Open package.json, find the "script" property and change the "start" property as follows:
      ```
      "scripts": {
          "start": "SET PORT=2000 && react-app-rewired start"
          // other scripts
      }
      ```
  3.  Locate back to the project folder and run the run.bat file

## Database

The website uses MongoDB as the database to store all the data. The database is hosted on MongoDB atlas and can be access through the Internet.

When the website is first initialized, it comes with a clean database for 2 systems:

- Covid System
- Payment System

To change the database for both systems, do as follows:

1. Locate to the .env file of each system (Covid System: server folder; Payment System: payment_system folder)
2. Follow the instructions in the .env file to change the database connection string

## Contribution

Special thanks to the following people for their contribution:

- Nguyen Ho Trung Hieu - 20126038
- Vu Hoai Nam - 20126045
- Truong Do Truong Thinh - 20126056
