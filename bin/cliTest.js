#! /usr/bin/env node

const shell = require("shelljs");

shell.echo("\x1b[32m", "Welcome to SpeQL8");
shell.echo("\x1b[34m", "please wait....")
shell.exec("npm run build & npm run start");
shell.echo("\x1b[34m", "SpeQL8 is now running!")
shell.echo("\x1b[35m", "Open your browser and navigate to http://localhost:3333");