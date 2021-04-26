/**
 * @OnlyCurrentDoc Limits the script to only accessing the current sheet.
 */


/**
 * IP Functions Google Apps Script
 *
 * Written by Jason Emery
 * August 2013
 *
 * For information and help:
 * https://docs.google.com/a/costco.com/document/d/1x3UD12_MOpPIK2iuqRDv9Leku-sJmdtnVmrJmtkLfL8/edit?usp=sharing
 *
 * Sample Spreadsheet:
 * https://docs.google.com/spreadsheet/ccc?key=0AtvdVN89Xo5KdEhSaWctWTV1d1RpQUt1TTF1blFtVnc&usp=sharing
 *
 * Update:
 *  - 8/18/2016 with new onOpen function
 *  - 9/9/2020 change help dialog behavior
 *  - 9/11/2020 Remove help dialog to simplify OAUTH scopes and add function
 *       documentation.  This now provides in sheet documentation.
 */



function onOpen() {
  var spreadsheet = SpreadsheetApp.getActive();
  var menuitems = [
    {name: 'Subnet Fill', functionName: 'SUBNETFILL'},
    {name: 'IP Sort', functionName: 'IPSORT'},
    null,
    {name: 'To Lower', functionName: 'TOLOWER'},
    {name: 'Remove Formulas', functionName: 'REMOVE_FORMULAS'},
  ]

  spreadsheet.addMenu('IP Functions', menuitems);
}

/** IPFILL
 *
 *
 * Takes an ip/mask in CIDR notation and returns an array in the same column of
 * all hosts enumerated in the subnet
 *
 * @param {string} ip - IP/mask in CIDR notation
 * @returns {Array} An array in the same column of all hosts enumerated in the
 * subnet
 *
 * @customfunction
 */
function IPFILL (ip) {
  var ipaddresses = [];

  var ipnum = (IPDD2DEC(IPBROADCAST(ip))-IPDD2DEC(ip)+1);

  ipaddresses.push([ip]);

  for (var i=1; i<ipnum;i+=1) {
    ipaddresses.push([IPADD(ip,i)]);
  }

    return ipaddresses;
  }


/**
 * IPNETWORK
 *
 *
 * Takes an ip/mask in CIDR notation and returns the network address.
 *
 * @param {string} ip - IP/mask in CIDR notation
 * @returns {string} Network address for {ip}
 *
 * @customfunction
 */
function IPNETWORK(ip) {
  var mask = IPMASK(ip);
  var ipnet=""

  if (ip.indexOf("/") <= 0){return "no mask"}

  for (var i=1;i<5;i+=1) {
    ipnet = ipnet + (IPOCTET(ip,i) & IPOCTET(mask,i)) + ".";
  }

  return ipnet.substr(0,ipnet.length-1);
}


/**
 * IPNEXTNET
 *
 *
 * Takes an ip/mask in CIDR notation and returns the next matching network with the
 * same subnet mask.
 *
 * @param {string} ip - IP/mask in CIDR notation
 * @returns {string} Next network with the same subnet mask
 *
 * @customfunction
 */
function IPNEXTNET (ip) {
  var masklen;

  if (ip.indexOf("/") <= 0){return "no mask"}

  masklen = ip.substr(ip.indexOf("/")+1);

  return IPADD(IPBROADCAST(ip),1) + "/" + masklen;
}


/**
 * IPISIN
 *
 *
 * Returns true if ip1 is contained within ip2. Ip2 must be an ip with subnet mask
 * in CIDR notation. Ip1 can be either a single ip address or a subnet in CIDR
 * notation.
 *
 * @param {string} ip1 - IP address with or without CIDR mask
 * @param {string} ip2 - IP/mask in CIDR notation
 * @returns {boolean} True if {ip1} is contained within {ip2}.
 *
 * @customfunction
 */
function IPISIN (ip1, ip2) {
  var ipnet;

  if (IPMASKLEN(ip1)<IPMASKLEN(ip2)) {
    return false;
  }

  return (IPNETWORK(ip2)==IPNETWORK(IPADDR(ip1) + "/" + IPMASKLEN(ip2)))
}

 /**
 * IPBROADCAST
 *
 *
 * Takes an ip/mask in CIDR notation and returns the broadcast address.
 *
 * @param {string} ip - IP/mask in CIDR notation
 * @returns {string} Broadcast address for {ip}
 *
 * @customfunction
 */
function IPBROADCAST (ip) {
  var masklen;

  masklen = ip.substr(ip.indexOf("/")+1);

  ip = IPDD2BIN(ip)

  return IPBIN2DD(ip.substr(0,masklen) + "1".repeat(32-masklen))
}

/**
 * IPMASKLEN
 *
 *
 * Takes an ip/mask in CIDR notation and returns only the mask length.
 *
 * @param {string} ip - IP/mask in CIDR notation
 * @returns {string} Length of subnet mask
 *
 * @customfunction
 */
function IPMASKLEN (ip) {
  if (ip.indexOf("/")!=-1) {
    return parseInt(ip.substr(ip.indexOf("/")+1));
  }
  else {return 32}
}

/**
 * IPMASK
 *
 *
 * Takes an ip/mask in CIDR notation and returns the mask value in dotted decimal,
 * such as 255.255.255.0.
 *
 * @param {string} ip - IP/mask in CIDR notation
 * @returns {string} Subnet mask in dotted decimal notation
 *
 * @customfunction
 */
function IPMASK (ip) {
  var masklen;
  masklen = ip.substr(ip.indexOf("/")+1);
  return IPDEC2DD(parseInt(("1".repeat(masklen) + "0".repeat(32-masklen)),2));
}

/**
 * IPMASKWILD
 *
 *
 * Calculate the wildcard subnet mask of a given CIDR block.
 *
 * @param {string} ip - IP/mask in CIDR notation
 * @returns {string} Wildcard subnet mask
 *
 * @customfunction
 */
function IPMASKWILD (ip) {
  var masklen;
  masklen = ip.substr(ip.indexOf("/")+1);
  return IPDEC2DD(parseInt(("0".repeat(masklen) + "1".repeat(32-masklen)),2));
}


/**
 * IPHOSTS
 *
 *
 * Takes an ip/mask in CIDR notation and returns the number of available hosts.
 *
 * @param {string} ip - IP/mask in CIDR notation
 * @returns {string} Number of available hosts
 *
 * @customfunction
 */
function IPHOSTS (ip) {
  var masklen;

  masklen = ip.substr(ip.indexOf("/")+1);

  return (Math.pow(2, (32-masklen))-2);
}



/**
 * IPADD
 *
 *
 * Takes an IP address and adds an integer. This will work across subnet
 * boundaries. If no integer is provided, it will increment the IP by 1.
 *
 * @param {string} ip - IP address with or without CIDR mask
 * @param {number=1} x - Integer
 * @returns {string} IP address incremented by {x}.
 *
 * @customfunction
 */
function IPADD(ip, x) {
  x = x || 1;
  ip = IPDD2DEC(IPADDR(ip));
  return IPDEC2DD(ip + x);
}

/** IPOCTET
 *
 *
 * Takes an IP address with or without CIDR notation and returns the specific
 * octet specified by ‘octet’. If no octet is specified, it will return an
 * array with all 4 octets.
 *
 * @param {string} ip - IP address with or without CIDR mask
 * @param {string} [octet] - Octet of IP address
 * @returns {(string|Array)} Specific octet specified by ‘octet’. If no octet is
 * specified, it will return an array with all 4 octets
 *
 * @customfunction
 */
function IPOCTET (ip,octet) {
  if (typeof octet === "undefined" || octet===null) octet = 0;

  ip = IPADDR(ip);

  if (octet<0 || octet>4 || !IPVALID(ip))
  {
    return "invalid octet";
  }

  var regexp = /\./g;
  var match = 1;
  var matches = [-1];
  var i;
  var octets = [];

  while ((match = regexp.exec(ip)) != null) {
    matches.push(match.index);
  }

  matches.push(ip.length);

  for (i=1;i<5;i++) {
    octets[i] = parseInt(ip.substring(matches[i-1]+1,matches[i]));
  }

  if (octet === 0) {
    matches.shift();
    return octets;
  }

  return octets[octet];

};


/**
 * IPADDR
 *
 *
 * Takes an IP/mask in CIDR notation and returns just the IP address.
 *
 * @param {string} ip - IP/mask in CIDR notation
 * @returns {string} IP address without CIDR mask
 *
 * @customfunction
 */
function IPADDR (ip) {
  var IPADDR;

  if (IPVALID(ip) && ip.indexOf("/")!=-1)
    {
      IPADDR=ip.substring(0,ip.indexOf("/"))
    }
  else
    {
      IPADDR = ip
    }

  return IPADDR;
};


/**
 Checks to see if the IP address is valid
 */
function IPVALID (ip) {
  return true;
};

/**
 * IPDEC2DD
 *
 *
 * Converts decimal number to IP address in dotted decimal notation.
 *
 * @param {string} ip - IP address as an integer
 * @returns {string} IP address in dotted decimal notation
 *
 * @customfunction
 */
function IPDEC2DD (ip) {
  var IPHEX, IPDD="";
  var octets=[];

  IPHEX = ("00000000" + ip.toString(16)).substr(-8);

  for (var i=1;i<5;i+=1) {
    IPDD = IPDD + parseInt(IPHEX.substr(0,2),16).toString() + ".";
    IPHEX = IPHEX.substr(-IPHEX.length+2);
  }

  return IPDD.substr(0,IPDD.length-1);
}

/**
 * IPDD2HEX
 *
 *
 * Converts IP in dotted decimal notation to HEX string.
 *
 * @param {string} ip - IP address in dotted decimal notation
 * @returns {string} IP address as a hexidecimal string
 *
 * @customfunction
 */

function IPDD2HEX(ip) {
  var octet;
  var IPHEX="";
  var octets=[];
  var i;

  octets = IPOCTET(ip);

  for (i=1;i<5;i++) {
    IPHEX = IPHEX + ("00" + octets[i].toString(16)).substr(-2);
  }

  return IPHEX;
};

/**
 * IPDD2BIN
 *
 *
 * Converts an IP address in dotted decimal notation to 32-bit binary (0’s and 1’s
 * string).
 *
 * @param {string} ip - IP address in dotted decimal notation
 * @returns {string} IP address in 32-bit binary
 *
 * @customfunction
 */
function IPDD2BIN (ip) {
  var IPBIN="";
  var octets=[];

  octets = IPOCTET(ip);

  for (i=1;i<5;i++) {
    IPBIN = IPBIN + ("00000000" + octets[i].toString(2)).substr(-8);
  }

  return IPBIN;
}

/**
 * IPDD2DEC
 *
 *
 * Converts IP in dotted decimal notation to decimal number. Useful for sorting and
 * mathematical operations.
 *
 * @param {string} ip - IP address in dotted decimal notation
 * @returns {string} IP address as an integer
 *
 * @customfunction
 */
function IPDD2DEC (ip) {
  var octet;
  var IPHEX="";
  var octets=[];
  var i;

  return parseInt(IPDD2HEX(ip),16);

}


/**
 * IPBIN2DD
 *
 *
 * Converts 32-bit binary (0’s and 1’s string) to an IP address in dotted decimal
 * notation.
 *
 * @param {string} ip - IP address in 32-bit binary
 * @returns {string} IP address in dotted decimal notation
 */
function IPBIN2DD (ip) {
  if (ip.len<32) {ip = ("0".repeat(ip.len-32) + ip) }
  else if (ip.length>32) { ip = ip.substr(-32) }

  return parseInt(ip.substr(0,8),2) + "." + parseInt(ip.substr(8,8),2) + "."
          + parseInt(ip.substr(16,8),2) + "." + parseInt(ip.substr(24,8),2)

}
String.prototype.repeat = function(count) {
    if (count < 1) return '';
    var result = '', pattern = this.valueOf();
    while (count > 0) {
        if (count & 1) result += pattern;
        count >>= 1, pattern += pattern;
    }
    return result;
};

Array.prototype.toLowerCase= function(){
	var L= this.length, tem;
	while(L){
		tem= this[--L] || '';
		if(tem.toLowerCase) this[L]= tem.toLowerCase();
	}
	return this;
}


/**
 Sorts a column of IP addresses or subnets by IP order
 */
function IPSORT () {
  var sub1, sub2;

  ssActive = SpreadsheetApp.getActiveSheet();
  rgMyRange = ssActive.getActiveRange();

  var numRows = rgMyRange.getNumRows();
  var numCols = rgMyRange.getNumColumns();

  ip = (rgMyRange.getCell(1,1).getValue());
  sub1 = ip;

  var selection = rgMyRange.getValues();

  for (var i=0;i<selection.length;i+=1) {
    selection[i] = ([parseInt(IPDD2DEC(selection[i].toString()))]);
  }

  selection.sort(function(a,b){return a-b});

  for (var i=0;i<selection.length;i+=1) {
    selection[i] = ([IPDEC2DD(parseInt(selection[i]))]);
  }

  rgMyRange.setValues(selection);
}


/**
 * Fills a column with subnets incrementally. If the range is a single row,
 * then will fill horizontally.
 */
function SUBNETFILL () {
  var sub1, sub2;

  ssActive = SpreadsheetApp.getActiveSheet();
  rgMyRange = ssActive.getActiveRange();

  var numRows = rgMyRange.getNumRows();
  var numCols = rgMyRange.getNumColumns();

  ip = (rgMyRange.getCell(1,1).getValue());
  sub1 = ip;

  if (numRows>1) {
    var subnets = new Array([ip]);
    for (var i=1; i<numRows;i+=1) {
      sub2 = IPNEXTNET(sub1,1);
      subnets.push([sub2]);
      sub1 = sub2;
    };
    rgMyRange.setValues(subnets);
  }
  else if (numCols>1) {
    var subnets = new Array([[ip]]);
    for (var i=1; i<numCols;i+=1) {
      sub2 = IPNEXTNET(sub1,1);
      subnets[0][i] = sub2;
      sub1 = sub2;
    }
    rgMyRange.setValues(subnets);
  }
  else {
    Browser.msgBox("Please select a range")
  }
}


/**
 * Fills a column with IP addresses. If only one cell is selected it will
 * fill in the subnet as specified by the mask. If a range is selected it
 * will fill in the selected range incrementally.
 */
function IPFILL_UTIL () {
  var ipaddresses = [];

  ssActive = SpreadsheetApp.getActiveSheet();
  rgMyRange = ssActive.getActiveRange();

  var numRows = rgMyRange.getNumRows();
  var numCols = rgMyRange.getNumColumns();

  ip = (rgMyRange.getCell(1,1).getValue());

  //Browser.msgBox(ip + "," + IPADD(ip,1))

  var ipnum = (IPDD2DEC(IPBROADCAST(ip))-IPDD2DEC(ip)+1);

  if (numRows==1 && numCols==1) {
    for (var i=1; i<ipnum;i+=1) {
      ipaddresses.push([IPADD(ip,i)]);
    }
    rgMyRange.offset(1, 0, ipaddresses.length, 1).setValues(ipaddresses);
  }
}



function TOLOWER () {
  var sheet = SpreadsheetApp.getActiveSheet();
  var selection = sheet.getActiveRange();
  var array = selection.getValues();

  array = array.toLowerCase();
  selection.setValues(array);
}



function REMOVE_FORMULAS () {
  var sheet = SpreadsheetApp.getActiveSheet();
  var selection = sheet.getActiveRange();
  //var array = selection.getValues();

  selection.copyTo(selection, {contentsOnly: true});
}
