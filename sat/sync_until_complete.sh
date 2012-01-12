#!/usr/bin/python
# This script was written by Brian Redbeard for Alticon
# Last update 2010-12-14
# This script is NOT SUPPORTED by ANYONE. Please
# contact Brian Redbeard for more information.

# Spacewalk / Red Hat Satellite Server can be very finicky when it comes to
# network stability.  This wrapper for satellite-sync will check the return
# code of satellite-sync.  If the return code is non-zero, run the utility
# again after waiting up to 3 minutes.  This should be repeated a maximum of
# 100 times.

RETURN=1
FAILS=0

until [[ "$RETURN" -eq "0"  ||  "$FAILS" -eq "100" ]] ; do
        satellite-sync
        RETURN=$?
        SLEEP_TIME=`perl -e "print int(rand(180))"`
        [ "$RETURN" -gt 0 ] && sleep $SLEEP_TIME
        let FAILS+=1
        
done
