
DeepaMehta 3 Email Plugin
=========================


Adds email functionality.


Requirements
------------

* A DeepaMehta 3 installation  
  <http://github.com/jri/deepamehta3>


Installation
------------

1.  Go to your DeepaMehta 3 installation directory:
        cd deepamehta3
2.  Download DeepaMehta 3 Email Plugin:
        couchapp vendor install git://github.com/jri/dm3-email.git
3.  Add plugin to DeepaMehta 3 by inserting a line to _attachments/javascript/plugins.js
        add_plugin("vendor/dm3-email/script/dm3_email.js")
4.  Upload changes to CouchDB:
        couchapp push --atomic http://localhost:5984/deepamehta3-db


Running
-------

1.  Visit DeepaMehta 3 in your webbrowser (resp. press reload):
        http://localhost:5984/deepamehta3-db/_design/deepamehta3/index.html
2.  You'll find an additional document type "Email" in the type menu (next to the "Create" button).


------------
Jörg Richter  
30.9.2009
