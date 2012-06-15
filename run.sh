#!/bin/sh

forever start job-process.js
forever start job-creator.js
forever start web/app.js