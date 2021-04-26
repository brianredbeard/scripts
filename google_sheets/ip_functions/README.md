# IP Functions for Google Sheets

## About

In September 2014, [Jason Emery][jason-emery-linkedin] ported his "IP Functions"
for Microsoft Excel to Google AppScript enabling them to be used with Google
Sheets.

At the time it was ported to AppScript it used a primitive called
[`UiApp`][uiapp],
which as since been deprecated in favor of [`HtmlService`][htmlservice].

While this didn't affect the overall functionality within Google Sheets, it produced
occasional dialog errors when the help functionality was called.

This is a copy of the Google AppScript function which has been ported to use the
[`HtmlService`][htmlservice] primative, thus removing those errors.

The original [Google Sheets Demo][originalscript] is still available and can be
reviewed for reference.

An updated version of the demo focused around the addressing of multi-site
network configuration can be [explored here][newdemo].

## Installation (Basic)

Installation of this utility is pretty simple.  The functions can be added to a
new or existing Google Sheets document.  These directions 

  - [Create a new Google Sheet](https://sheets.new)
  - Click "Tools" -> "Script Editor"
  - In the new dialog you should be in a web based IDE editor in the file
    `Code.gs`.  Copy/paste the file Code.gs into this one.
  - Click "File" -> "New" -> "HTML File" named `IPFunctionsHelpFile.html` and
    copy/paste the contents of `IPFunctionsHelpFile.html`.
  - Save the project (I make the name the same as the spreadsheet as this will
    be attached to a single spreadsheet).
  - Go back to your spreadsheet, do a forced reload, and wait a moment.  A new
    menu bar item named "IPFunctions" should appear after "Help".
  - Test the functions:
    - In cell A1 add the content `192.168.0.25/24`
    - In cell A2 enter the following: `=IPBROADCAST(A1)` (the result should be
      `192.168.0.255`)
    - In cell A3 enter the following: `=IPADD(A1, 300)` (the result should be
      `192.168.1.69`)
    - In cell A4 enter the following: `=IPDD2DEC(A3)` (the result should be
      `3232235845`)
    - In cell A5 enter the following: `=IPDEC2DD(A4)` (the result should be
      `192.168.1.69`)


### Menu functions

Within Google AppScript/Google Sheets, accessing the Menu bar requires
additional OAUTH scoped permissions.  Users who need use these functions will
need to authorize the application.  This prompt will happen automatically upon
the first use of a menu based function.


   - Test the menu operations:
      - In cell B1 enter `192.168.224.224/28`
      - Select cells B1 through B4
      - Click "IPFunctions" -> "Subnet Fill" (the result should be the next 3
        subnets, listed in order, filled down in the selected cells.  In this
        case: "192.168.224.240/28", "192.168.225.0/28", "192.168.225.16/28")

## Functions

### Summary

The following is a list of the functions provided by this script:
  
  - `IPFILL (ip)`
  - `IPNETWORK(ip)`
  - `IPNEXTNET (ip)`
  - `IPISIN (ip1, ip2)`
  - `IPBROADCAST (ip)`
  - `IPMASKLEN (ip)`
  - `IPMASK (ip)`
  - `IPMASKWILD (ip)`
  - `IPHOSTS (ip)`
  - `IPADD(ip, x)`
  - `IPOCTET (ip,octet)`
  - `IPADDR (ip)`
  - `IPVALID (ip)`
  - `IPDEC2DD (ip)`
  - `IPDD2HEX(ip)`
  - `IPDD2BIN (ip)`
  - `IPDD2DEC (ip)`
  - `IPBIN2DD (ip)`
  - `SUBNETFILL`
  - `IPSORT`
  - `TOLOWER`
  - `REMOVE_FORMULAS`

#### IPFILL (ip)

Takes an ip/mask in CIDR notation and returns an array in the same column of all
hosts enumerated in the subnet.

#### IPNETWORK(ip)

Takes an ip/mask in CIDR notation and returns the network address.

#### IPNEXTNET (ip)

Takes an ip/mask in CIDR notation and returns the next matching network with the
same subnet mask.

#### IPISIN (ip1, ip2)

Returns true if ip1 is contained within ip2. Ip2 must be an ip with subnet mask
in CIDR notation. Ip1 can be either a single ip address or a subnet in CIDR
notation.

#### IPBROADCAST (ip)

Takes an ip/mask in CIDR notation and returns the broadcast address.

#### IPMASKLEN (ip)

Takes an ip/mask in CIDR notation and returns only the mask length.

#### IPMASK (ip)

Takes an ip/mask in CIDR notation and returns the mask value in dotted decimal,
such as 255.255.255.0.

#### IPMASKWILD (ip)

Calculate the wildcard subnet mask of a given CIDR block.

#### IPHOSTS (ip)

Takes an ip/mask in CIDR notation and returns the number of available hosts.

#### IPADD(ip, x)

Takes an IP address and adds an integer. This will work across subnet
boundaries. If no integer is provided, it will increment the IP by 1.

#### IPOCTET (ip,octet)

Takes an IP address with or without CIDR notation and returns the specific octet
specified by ‘octet’. If no octet is specified, it will return an array with all
4 octets.

#### IPADDR (ip)

Takes an IP/mask in CIDR notation and returns just the IP address.

#### IPVALID (ip)

_Note_: Reviewing the code, this seems to be a no-op function.

#### IPDEC2DD (ip)

Converts decimal number to IP address in dotted decimal notation.

#### IPDD2HEX(ip)

Converts IP in dotted decimal notation to HEX string.

#### IPDD2BIN (ip)

Converts an IP address in dotted decimal notation to 32-bit binary (0’s and 1’s
string).

#### IPDD2DEC (ip)

Converts IP in dotted decimal notation to decimal number. Useful for sorting and
mathematical operations.

#### IPBIN2DD (ip)

Converts 32-bit binary (0’s and 1’s string) to an IP address in dotted decimal
notation.

### Menu functions

These mechanisms are exposed through the menu bar at the top of the document
window.

#### SUBNETFILL

Similar to IP FILL above except it will fill the subnets incrementally but only
works if a range is selected. For example if 10.10.10.0/26 is selected, it will
fill the sleected range of cells with 10.10.10.64/26, 10.10.10.128/26 etc...
This will work fur subnets and supernets it does not care.

#### IPSORT

Will take a selected range of ip addresses and sort them by IP address. This is
very useful such as:

|Normal Sort:|IP Sort:|
|----|----|
|10.10.10.1|10.10.10.1|
|10.10.10.10|10.10.10.2|
|10.10.10.15|10.10.10.10|
|10.10.10.2|10.10.10.15|

#### TOLOWER

Converts the selected range to all lower case.

#### REMOVE_FORMULAS

Removes all formulas from the selected range. Especially useful with google
sheets where performance can be seriously impacted by too many formulas. Also
useful when copying and pasting data to another spreadsheet to get rid of
formulas.

## Copyright

This script is originally copyrighted 2013, [Jason Emery][jason-emery-linkedin]
with modifications made by Brian 'redbeard' Harrington in 2020.

[jason-emery-linkedin]: https://www.linkedin.com/in/jasonemery/
[uiapp]: https://developers.google.com/apps-script/guides/support/sunset#ui-service
[htmlservice]: https://developers.google.com/apps-script/reference/html/html-service?hl=en
[originalscript]: https://docs.google.com/spreadsheets/d/18j7NB1yBjrkmeIay-I4hPqck75LHt5LzObFcucQnSeQ/edit#gid=0
[newdemo]: https://docs.google.com/spreadsheets/d/1rpMCHwBE2HezmyckixBBpZJmK8xBL8z5TLhW4omKtSs/edit#gid=0

<!--
vim: ts=2 sw=2 et tw=80
-->
