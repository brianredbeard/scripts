#!/bin/bash
count=0
while true; do
	ifconfig | grep tun0 > /dev/null 2>&1 

	if [ $? -eq 1 ]; then
		notify-send -t 59000 -i /usr/share/icons/gnome/48x48/status/changes-allow.png "VPN" "VPN Appears to be down"
		sleep 60 
		let count+=1
		echo $count
	fi
	sleep 1
	if [ $count -eq 5 ]; then
		exit 1
	fi
done
