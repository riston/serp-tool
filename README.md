Serp-tool
=========

Track the web sites positions


Installation
=========

Requirements to installation:

 - Redis v2.4.10
 - MongoDB v2.04
 - Node v0.6.15

To keep the processes alive, install the _forever_, this installation needs _root_ permission.

	sudo npm install -g forever

Clone, extract the code place where you need. Change the project directory to _serp-tool_.
Now you can start installing the libaries needed, dependencies are handled by the package.json file.

This command does not need the root privilege, only directory where package.json is located.

	npm install

The installation should end without any errors, or some of the libraries might be not installed.


Running application
=========

	forever start job-process.js
	forever start job-creator.js
	forever start web/app.js