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
  - `IPSORT ()`
  - `SUBNETFILL ()`
  - `IPFILL_UTIL ()`
  - `TOLOWER ()`
  - `REMOVE_FORMULAS ()`

### IPFILL (ip)

### IPNETWORK(ip)

### IPNEXTNET (ip)

### IPISIN (ip1, ip2)

### IPBROADCAST (ip)

### IPMASKLEN (ip)

### IPMASK (ip)

### IPMASKWILD (ip)

### IPHOSTS (ip)

### IPADD(ip, x)

### IPOCTET (ip,octet)

### IPADDR (ip)

### IPVALID (ip)

### IPDEC2DD (ip)

### IPDD2HEX(ip)

### IPDD2BIN (ip)

### IPDD2DEC (ip)

### IPBIN2DD (ip)

### IPSORT ()

### SUBNETFILL ()

### IPFILL_UTIL ()

### TOLOWER ()

### REMOVE_FORMULAS ()


## Copyright

This script is originally copyrighted 2014, [Jason Emery][jason-emery-linkedin]
with modifications made by Brian 'redbeard' Harrington in 2020.

[jason-emery-linkedin]: https://www.linkedin.com/in/jasonemery/
[uiapp]: https://developers.google.com/apps-script/guides/support/sunset#ui-service
[htmlservice]: https://developers.google.com/apps-script/reference/html/html-service?hl=en
[originalscript]: https://docs.google.com/spreadsheets/d/18j7NB1yBjrkmeIay-I4hPqck75LHt5LzObFcucQnSeQ/edit#gid=0

<!--
vim: ts=2 sw=2 et tw=80
-->
