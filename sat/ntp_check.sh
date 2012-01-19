#!/bin/bash 
# This script was written by Brian Redbeard for Alticon
# Last update 2010-12-14
# This script is NOT SUPPORTED by ANYONE. Please
# contact Brian Redbeard for more information.

grep ticktock /etc/ntp.conf 
RETURN=$? 

case "$RETURN" in 
  0) 
	echo "NTP is successfully configured"	 
	;; 
  1) 
	echo "NTP is misconfigured" 
	;; 
  2) 
	echo "NTP is not installed" 
esac 

exit $RETURN
