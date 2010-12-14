#!/usr/bin/python
# This script was written by Brian Redbeard for Alticon
# Last update 2010-12-14
# This script is NOT SUPPORTED by ANYONE. Please
# contact Brian Redbeard for more information.

import xmlrpclib

SATELLITE_URL = "https://sat.dev.alticon.net/rpc/api"
SATELLITE_LOGIN = "apiuser"
SATELLITE_PASSWORD = "apiuser"

client = xmlrpclib.Server(SATELLITE_URL, verbose=0)

key = client.auth.login(SATELLITE_LOGIN, SATELLITE_PASSWORD)
list = client.system.listSystems(key)
for system in list:
   print "id: %s \t name:  %s" % (system.get('id'), system.get('name'))

client.auth.logout(key)
