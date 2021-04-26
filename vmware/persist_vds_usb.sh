#!/bin/sh

# VMWare Distributed Switch USB Configurator
#
# Copyright 2021 Brian 'redbeard' Harrington <redbeard@dead-city.org>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
 
set -eu -o pipefail
state=""

function checkNic() {
  nic="${1}"
  nicnum=${nic#vusb*}
  esxcli network nic get -n ${nic} | awk -vnum=${nicnum} '/Link Status:/ {print "v" num ":" $NF}'
}
                                                       
function cfgNic() {                                    
  nic="${1}"                            
  vds_name="${2}"                       
  vds_port_id="${3}"                                                                             
  esxcfg-vswitch -P ${nic} -V ${vds_port_id} ${vds_name}                                         
}                                                                                                
                                                       
niclist="$( esxcfg-nics -l | awk '/vusb/ {print $1}' )"
                                                       
while [[ "${state}" != "complete" ]]; do
  for device in ${niclist}; do          
    status=$(checkNic ${device})        
    if [ "${status##*:}" != "Up" ]; then
      echo "Still waiting on ${device}" 
      continue 2                       
    fi          
  done            
  state="complete"
done              
    
# Enumerate the USB network interfaces you wish to configure
# syntax: cfgNic <interface> <vds name> <vds port number>
# e.g.                                
                              
# cfgNic vusb0 vds-production 10
# cfgNic vusb1 vds-vmotion 3
