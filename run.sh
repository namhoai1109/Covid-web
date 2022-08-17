#!/bin/bash

# Uncomment this to run 4 instances of the program in one terminal
# npm start --prefix ./server & npm start --prefix ./client & npm start --prefix ./payment_system & npm start --prefix ./client_payment

# This below is for running the program in multiple terminals
gnome-terminal -- npm start --prefix ./server;
gnome-terminal -- npm start --prefix ./payment_system;
gnome-terminal -- npm start --prefix ./client;
gnome-terminal -- npm start --prefix ./client_payment;
