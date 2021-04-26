# VMWare scripts

This directory contains scripts to be used with various VMWare products.  These
scripts are supplied without warranty, expressed or implied.


# VMWare Virtual Distributed Switch USB Configurator

Filename: `persist_vds_usb.sh`

Using this script an administrator can configure the bindings between USB
network interfaces and distributed switch ports.  In various versions of VMWare
ESXi users of the [USB Fling] may experience issues where network interfaces are
not properly re-attached to the correct virtual distributed switch upon reboot
of the host.

The contents of this script may be placed in the file
`/etc/rc.local.d/local.sh`.

**NOTE**: If you copy/paste the _entire_ script, be aware that the error
behavior requested via the `set` shell builtin may be undesirable.  Consult the
`man` pages for BusyBox or the Bash Hackers Wiki page on [set].

In practice the script peforms the following:
- We start by ensuring that upon hitting any errors, the script fails.  This
ensures that any syntax errors do not cause subsequent configuration problems.
- Define a variable `state` for use in our `while` loop
- Define two functions: `checkNic` and `cfgNic`
 - `checkNic` takes a single _positional_ argument (`nic`)
   - We then derive the interface number from the name and store it in `nicnum`
   - Using `nic` and `nicnum` we then check the state with `esxcli network nic
     get`
 - `cfgNic` takes three _positional_ arguments (`nic`, `vds_name`,
   `vds_port_id`)
   - We then run `esxcfg-vswitch` with the corresponding arguments
- Enumerate a list of network interfaces containing `vusb` in the name. This
  is only done a single time for the life of the script. 
- Using the enumerated list of nics, we loop over them until are have quiesced
  to a working state using the `checkNic` function.  Any nic _not_ found to be
  in an "Up" state causes the entire control structure to restart, thus avoiding
  the use of counters.  **NOTE**: The combination of a `while` loop checking the
  value of `state` was done to aid in readability.
- Finally, the administrator calls `cfgNic` function with the parameters they
  wish to use for each network interface.

e.g. Given the interfaces `vusb0` which we wish to connect to "port" `10` on the
virtual switch `vds-production` and `vusb1` which we wish to connect to "port"
`3` on the virtual switch `vds-motion`.

```bash
cfgNic vusb0 vds-production 10
cfgNic vusb1 vds-vmotion 3
```

[USB Fling]: https://flings.vmware.com/usb-network-native-driver-for-esxi
[set]: https://wiki.bash-hackers.org/commands/builtin/set
<!--
vim: ts=2 sw=2 tw=80 expandtab
-->
