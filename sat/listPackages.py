#!/usr/bin/python
# This script was written by Brian Redbeard for Alticon
# Last update 2010-12-14
# This script is NOT SUPPORTED by ANYONE. Please
# contact Brian Redbeard for more information.

import xmlrpclib
import time
import datetime
import string
import sys
import getpass
import socket
from optparse import OptionParser

SATELLITE_URL = "sat.dev.alticon.net"
SATELLITE_LOGIN = "apiuser"
SATELLITE_PASSWORD = "apiuser"

#BASE_CHANNELS = ("rhel-i386-server-5", "rhel-x86_64-server-5")
#base_channels = [ "rhel-x86_64-server-5" ]
base_channel = [ "rhel-x86_64-server-5" ]


def main():
	SUCCESS = 0
	XMLRPCERR = 21
	UNSUPPORTED = 23
	SOCKERR = 27 

	parser = OptionParser()
	parser.add_option("-u", "--username", dest="username", type="string", help="User login for satellite", metavar="USERNAME")
	parser.add_option("-p", "--password", dest="password", type="string", help="Password for specified user on satellite.  If password is not specified it is read in during execution", metavar="PASSWORD", default=None)
	parser.add_option("-s", "--server", dest="serverfqdn", type="string", help="FQDN of satellite server - omit https://", metavar="SERVERFQDN")
	parser.add_option("-o", "--origin", dest="origin", type="string", help="Specify the original channel label", metavar="ORIGIN", default=None)
	parser.add_option("-b", "--beginning", dest="beginning", type="string", help="Specify the beginning date.  Date is in ISO 8601 (e.g. 2009-09-09) [Default: 2000-01-01", metavar="BEGINNING", default='2000-01-01')
	parser.add_option("-e", "--end", dest="end", type="string", help="Specify the end date.  Date is in ISO 8601 (e.g. 2009-09-10 for Sept 10th, 2009)", metavar="END", default=None)

	(options, args) = parser.parse_args()

	#print parser.parse_args()

	if not ( options.username ):
		options.username = SATELLITE_LOGIN
		
	if not ( options.serverfqdn ):
		options.serverfqdn = SATELLITE_URL

	if not ( options.origin ):
		options.origin = base_channel

	if not ( options.beginning and options.end ):
		print "Must specify beginning, and end date options.  See usage:"
		parser.print_help()
		print "\nExample usage:\n"
		print "To merge errata from Red Hat channel to custom channel up to date 2009-09-09:\n\tlistPackages.py -u admin -p password -s satellite.example.com -o rhel-x86_64-server-5 -d release-5-u1-server-x86_64 -e 2009-09-09"
		print ""
		return 100
	else:
		login = options.username
		serverfqdn = "https://%s/rpc/api" % options.serverfqdn
		origin = options.origin
		beginning = options.beginning
		end = options.end

	if not options.password:
		if not SATELLITE_PASSWORD:
			password = getpass.getpass("%s's password:" % login)
	else:
		password = options.password

	client = xmlrpclib.Server(serverfqdn, verbose=0)

	#iso_time = datetime.datetime.strptime(time.gmtime(), "%Y%m%dT%H:%M:%S")
	iso_time =  time.strftime("%Y-%m-%d", time.gmtime())

	key = client.auth.login(login, password)
	for label in base_channel:
		
		list = client.channel.software.listErrata(key, label,  beginning, end)
		#list = client.channel.software.listAllPackages(key, label)
		for errata in list:
			#print errata
			print "%s   %s  %s\t %s" % (errata['id'], errata['last_modified_date'], errata['advisory_name'], errata['advisory_type'])
			print "\n  \t", errata['advisory_synopsis'], "\n"
			errata_packages = client.errata.listPackages(key,errata['advisory_name'])
			for package in errata_packages:
				print "\t %s-%s-%s-%s" % (package['name'], package['version'], package['release'], package['arch_label'])
			
			print "\n"
	client.auth.logout(key)


if __name__ == "__main__":
    retval = 1
    try:
        retval = main()
    except KeyboardInterrupt:
        print "!!! Caught Ctrl-C !!!"

    
    sys.exit(retval)

