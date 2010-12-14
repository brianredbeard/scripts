#!/usr/bin/python
# This script was written by Brian Redbeard for Alticon
# Last update 2010-12-14
# This script is NOT SUPPORTED by ANYONE. Please
# contact Brian Redbeard for more information.

import xmlrpclib
import time
from optparse import OptionParser


## define values for logging into the satellite server
SATELLITE_URL = "https://sat.dev.alticon.net/rpc/api"
SATELLITE_LOGIN = "apiuser"
SATELLITE_PASSWORD = "apiuser"

## define values for iteration across channels
arches = [ "x86_64", "i386" ]
vers  = [ "5", "4" ]
children = [ "oracle", "rhn-tools", "supplementary", "vmware" ]

## define todays date in iso8601 format in case user does not supply this
iso_time = time.strftime("%Y-%m-%d", time.gmtime())


## Build the option parser for the command line to allow for setting an end
## date for packages as well as the ability to skip processing of the 
## parent and child channels
parser = OptionParser()
parser.add_option("-e", "--end", dest="end", type="string", help="Specify the end date.  Date is in ISO 8601 (e.g. 2009-09-10 for Sept 10th, 2009)", metavar="END", default = iso_time)
parser.add_option("-p", "--skip-parent", dest="skip_parent", help="Skip package addition for parent channels to speed up operation", metavar="SKIP_PARENT", action = "store_false", default = True)
parser.add_option("-c", "--skip-child", dest="skip_child", help="Skip package addition for child channels to speed up operation", metavar="SKIP_CHILD", action = "store_false", default = True)
(options, args) = parser.parse_args()

## break out this variable to a shorter name since we will be using it
## repeatedly 
end = options.end


## establish a connection to the satellite server
client = xmlrpclib.Server(SATELLITE_URL, verbose=0)
key = client.auth.login(SATELLITE_LOGIN, SATELLITE_PASSWORD)


## iterate through architectures, versions, releases, and child channels
for arch in arches:
	## due to architecture strangeness with 32-bit we have to use a special
	## name for the channel architecture
	if arch == "i386":
		chan_arch = "channel-ia32"
	else:
		chan_arch = "channel-%s" % arch

	for ver in vers:
		if ver == "4":
			#rels  = [ "as", "es", "ws" ]
			rels  = [ "as" ]
		if ver == "5":
			#rels  = [ "server", "client" ]
			rels  = [ "server" ]
		for rel in rels:
			## build a reference to the parent Red Hat channel
			prchan = "rhel-%s-%s-%s" % (arch, rel, ver)

			## build a reference to the parent Alticon channel
			pchan = "alticon-current-%s-%s-%s" % (arch, rel, ver)
			desc = "RHEL %s Release %s updated on %s" % (ver, rel, iso_time)

			## get details on the redhat channel
			parent = client.channel.software.getDetails(key,prchan)

			## by default, the skip_parent variable evaluates to 
			## true, it evaluates to false when the -p flag is 
			## present
			if options.skip_parent:
				## get a list of all packages in the parent 
				## redhat channel
				package_list = client.channel.software.listAllPackages(key,prchan,'2000-01-01',end)
				## instantiate an empty array to hold packages
				add_list = []
				for package in package_list:
				## append package ids onto array to be added 
					add_list.append(package['id'])
				print "%s will add %s packages" % (pchan, len(add_list))
				## execute addition of parent packages to chan
				result = client.channel.software.addPackages(key,pchan,add_list)
			else:
				print "Skipping channel ", pchan
			## this works under the same premise as the parent
			if options.skip_child:
				for child in children:
				## handle channel naming differences in 4 v 5
					if child == "rhn-tools":
						if ver == "4":
							pchan = "rhn-tools-rhel-%s-%s-%s" % (ver, rel, arch)
						elif ver == "5":
							pchan = "rhn-tools-rhel-%s-%s-%s" % (arch, rel, ver)
					elif child == "supplementary":
						if ver == "4":
							pchan = "rhel-%s-%s-%s-extras" % (arch, rel, ver)
						elif ver == "5":
							pchan = "rhel-%s-%s-supplementary-%s" % (arch, rel, ver)
					elif child == "oracle":
						continue
					elif child == "vmware":
						continue
					## define child channel name
					chan = "alticon-current-%s-%s-%s-%s" % (arch, rel, ver, child)

					## get list of packages from parent
					package_list = client.channel.software.listAllPackages(key,pchan,'2000-01-01',end)
					add_list = []
					for package in package_list:
						add_list.append(package['id'])
					print "\t%s will add %s packages from %s" % (chan, len(add_list), pchan)
					result = client.channel.software.addPackages(key,chan,add_list)
			else:
				print "Skipping child channels"


client.auth.logout(key)
