#!/usr/bin/python
# This script was written by Brian Redbeard for Alticon
# Last update 2010-12-14
# This script is NOT SUPPORTED by ANYONE. Please
# contact Brian Redbeard for more information.

import xmlrpclib
import time

SATELLITE_URL = "https://sat.dev.alticon.net/rpc/api"
SATELLITE_LOGIN = "apiuser"
SATELLITE_PASSWORD = "apiuser"

arches = [ "x86_64", "i386" ]
vers  = [ "5", "4" ]
children = [ "supplementary" ]
iso_time = time.strftime("%Y-%m-%d", time.gmtime())
client = xmlrpclib.Server(SATELLITE_URL, verbose=0)

key = client.auth.login(SATELLITE_LOGIN, SATELLITE_PASSWORD)

for arch in arches:
	if arch == "i386":
		chan_arch = "channel-ia32"
	else:
		chan_arch = "channel-%s" % arch

	for ver in vers:
		if ver == "4":
			#rels  = [ "as", "es", "ws" ]
			rels  = [ "as" ]
		if ver == "5":
			rels  = [ "server" ]
		for rel in rels:
			#print "rhel-%s-%s-%s" % (arch, rel, ver)
			pchan = "alticon-current-%s-%s-%s" % (arch, rel, ver)
			desc = "RHEL %s Release %s updated on %s" % (ver, rel, iso_time)
			#client.channel.software.create(key,pchan,pchan,desc,chan_arch,"")
			for child in children:
				chan = "alticon-current-%s-%s-%s-%s" % (arch, rel, ver, child)
				dchan = "alticon-current-%s-%s-%s-%s" % (arch, rel, ver, 'supplimentary')
				desc = "RHEL %s Release %s - %s updated on %s" % (ver, rel, child, iso_time)
				client.channel.software.create(key,chan,chan,desc,chan_arch,pchan)
				client.channel.software.delete(key,dchan)

client.auth.logout(key)
