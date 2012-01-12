#!/usr/bin/python
# This script was written by Brian Redbeard for Alticon
# Last update 2010-12-14
# This script is NOT SUPPORTED by ANYONE. Please
# contact Brian Redbeard for more information.
#
# This script uses the spacecmd utility to query a list of systems by group
# from the system set manager, produce a list of errata affecting those systems
# and then selectively apply them based on their status in the following three
# categories:
#	RHSA - Red Hat Security Advisory - Security Fixes
#	RHBA - Red Hat Bug Advisory - Bug Fixes
#	RHEA - Red Hat Enhancement Advisory - Feature Enhancements

#Ensure that the system set manager is clear
spacecmd "ssm_clear" 2>/dev/null 

#Retrieve all of the systems in the "All_Systems" system group
spacecmd "ssm_add group:All_Systems" 2>/dev/null 

#Produce a list of errata for all machines currently in the SSM
OUTPUT=`spacecmd "system_listerrata ssm"  2>/dev/null` 

 
# Iterate over each line of the output. If the line matches one of the 
# following awk strings, then either apply it or ignore it based on the
# commented lines.

for x in $OUTPUT; do 

       #Perform Security Patches 
       echo $x |  awk '/RHSA/ {print "spacecmd -y \"system_applyerrata ssm " $1 " \" "}' | sh 

       #Perform Bugfix Patches 
       echo $x |  awk '/RHBA/ {print "spacecmd -y \"system_applyerrata ssm " $1 " \" "}' | sh 

        #Perform Feature Enhancement Patches 
       #echo $x |  awk '/RHEA/ {print "spacecmd -y \"system_applyerrata ssm " $1 " \" "}' | sh 

done 
