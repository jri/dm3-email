
DeepaMehta 3 Email Plugin
=========================

The DeepaMehta 3 Email plugin adds email functionality to DeepaMehta 3 (only sending for the moment).


Requirements
------------

*   A DeepaMehta 3 installation  
    <http://github.com/jri/deepamehta3>

*   Other DeepaMehta 3 plugins:

    - *DM3 Contacts*  
      <http://github.com/jri/dm3-contacts>  
      This plugin provides you with an address book.

    - *DM3 Workspaces* (optional install)  
      <http://github.com/jri/dm3-workspaces>  
      If installed you get an easy way to maintain distribution lists (collections of contacts).

*   One CouchDB extension:  

    - *CouchDB Mailer*
      <http://github.com/jri/couchdb-mailer>


Installation
------------

1.  Go to your DeepaMehta 3 installation directory:
        cd deepamehta3

2.  Download DeepaMehta 3 Email Plugin:
        couchapp vendor install git://github.com/jri/dm3-email.git

3.  Activate the plugin by inserting one line to DeepaMehta's `_attachments/javascript/plugins.js`:
        add_plugin("vendor/dm3-email/script/dm3_email.js")

4.  Add additional stuff by copying a directory:
        cp -r vendor/dm3-email/views/dm3-email views

5.  Install the other DeepaMehta plugins and the CouchDB extension (see Requirements)
    as described on the respective pages.

6.  Upload changes to CouchDB:
        couchapp push http://localhost:5984/deepamehta3-db


Usage
-----

1.  Visit DeepaMehta 3 in your webbrowser (resp. press reload):
        http://localhost:5984/deepamehta3-db/_design/deepamehta3/index.html

    You'll find the additional document types "Contact" and "Email" in the type menu (next to the "Create" button).

2.  Create contacts and optionally assign them to workspaces. A contact represents e.g. a person or an institution.
    A workspace represents a distribution list. Dont't forget to create a contact for yourself.

3.  Create an email and enter your name in the *From* field. Then address the email by entering contact names and/or
    workspace names in the *To*, *Cc*, or *Bcc* fields. Each field can hold an arbitrary number of addressees.

    Auto-completion feature: After typing some letters DeepaMehta suggests matching contacts or workspaces by means of a menu.
    If an email is addressed to a workspace it is send to every contact assigned to that workspace.

4.  In order to attach files to the email you must save it first (by clicking the *Save as draft* button), then upload
    the attachments (by clicking *Upload Attachment*), and return to edit mode (by clicking *Edit*).

    Note: this save-edit-detour is bad usability and will vanish in the future.

5.  To send the email click the *Send* button.


Version History
---------------

`v0.2` -- Dec  1, 2009 -- Basic functionality. Requires DeepaMehta 3 v0.2


------------
Jörg Richter  
Dec 1, 2009
