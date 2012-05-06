#!/bin/bash

forever start job-creator.js
forever start job-process.js
forever start web/app.js