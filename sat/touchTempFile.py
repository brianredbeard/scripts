#!/usr/bin/python
# This script was written by Brian Redbeard for Alticon
# Last update 2010-12-14
# This script is NOT SUPPORTED by ANYONE. Please
# contact Brian Redbeard for more information.

import xmlrpclib
import datetime

SATELLITE_URL = "http://sat.dev.alticon.net/rpc/api"
SATELLITE_LOGIN = "apiuser"
SATELLITE_PASSWORD = "apiuser"

client = xmlrpclib.Server(SATELLITE_URL, verbose=0)
key = client.auth.login(SATELLITE_LOGIN, SATELLITE_PASSWORD)

system_id=1000015050

execute_time = datetime.datetime.now() + datetime.timedelta(seconds=60)
dtime = xmlrpclib.DateTime(execute_time.timetuple())

success = client.system.scheduleScriptRun(key,system_id,'root','root',600,'#!/bin/bash\ntouch /tmp/temp_`date +%s`\n',dtime)

client.auth.logout(key)

