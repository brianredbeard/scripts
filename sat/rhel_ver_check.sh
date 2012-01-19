#!/bin/bash 
# This script was written by Brian Redbeard for Alticon
# Last update 2010-12-14
# This script is NOT SUPPORTED by ANYONE. Please
# contact Brian Redbeard for more information.


RHELVER=`uname -r | cut -d- -f 1` 
case "$RHELVER" in 
	2.4.21) 
		RHEL="RHEL3" 
		UPDATE_CMD="up2date -uf"		 
	;; 
	2.6.9) 
		RHEL="RHEL4" 
		UPDATE_CMD="up2date -uf"		 
	;; 
	2.6.18) 
		RHEL="RHEL5" 
		UPDATE_CMD="yum update --disableexcludes=* -y"		 
	;; 
	2.6.32) 
		RHEL="RHEL6" 
		UPDATE_CMD="yum update --disableexcludes=* -y"		 
	;; 
	*) 
		RHEL="Unknown version" 
esac 


echo "This machine is running $RHEL" 
$UPDATE_CMD
