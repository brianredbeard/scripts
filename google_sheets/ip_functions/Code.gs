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
 * Last update 8/18/2016 with new onOpen function
 */



function onOpen() {
  SpreadsheetApp.getUi()
     .createMenu('IPFunctions')
     .addItem('Subnet Fill', "SUBNETFILL")
     .addItem("IP Sort", "IPSORT")
     .addSeparator()
     .addItem("To Lower", "TOLOWER")
     .addItem("Remove Formulas", "REMOVE_FORMULAS")
     .addSeparator()
     .addItem("IPFunctions Help", "OPEN_HELP")
     .addToUi();
}


function OPEN_HELP(){
  var href = "https://docs.google.com/document/d/18uB0Cbs37WOe1C-em5Rae6Hu8y5rUOvrMo2MoOyVlG4/edit?usp=sharing"
  var title = "IP Functions Help"
  var app = UiApp.createApplication().setHeight(50).setWidth(200);
  app.setTitle(title);
  var link = app.createAnchor("OPEN HELP FILE", href).setId("link");
  app.add(link);  
  var doc = SpreadsheetApp.getActive();
  doc.show(app);
}





function IPFILL (ip) {
  var ipaddresses = [];
  
  var ipnum = (IPDD2DEC(IPBROADCAST(ip))-IPDD2DEC(ip)+1);
  
  ipaddresses.push([ip]);

  for (var i=1; i<ipnum;i+=1) {
    ipaddresses.push([IPADD(ip,i)]);
  }
  
    return ipaddresses;
  }

function IPNETWORK(ip) {
  var mask = IPMASK(ip);
  var ipnet=""
  
  if (ip.indexOf("/") <= 0){return "no mask"}
  
  for (var i=1;i<5;i+=1) {
    ipnet = ipnet + (IPOCTET(ip,i) & IPOCTET(mask,i)) + ".";
  }
  
  return ipnet.substr(0,ipnet.length-1);
}



function IPNEXTNET (ip) {
  var masklen;
  
  if (ip.indexOf("/") <= 0){return "no mask"}

  masklen = ip.substr(ip.indexOf("/")+1);
  
  return IPADD(IPBROADCAST(ip),1) + "/" + masklen;
}


function IPISIN (ip1, ip2) {
  var ipnet;
  
  if (IPMASKLEN(ip1)<IPMASKLEN(ip2)) {
    return false;
  }
  
  if (IPNETWORK(ip2)==IPNETWORK(IPADDR(ip1)+"/"+IPMASKLEN(ip2))) {
    return true;
  }
  
  return "unkown";
}

  
function IPBROADCAST (ip) {
  var masklen;
  
  masklen = ip.substr(ip.indexOf("/")+1);
  
  ip = IPDD2BIN(ip)
  
  return IPBIN2DD(ip.substr(0,masklen) + "1".repeat(32-masklen))
}
    

function IPMASKLEN (ip) {
  if (ip.indexOf("/")!=-1) {
    return parseInt(ip.substr(ip.indexOf("/")+1));
  }
  else {return 32}
}

function IPMASK (ip) {
  var masklen;
  masklen = ip.substr(ip.indexOf("/")+1);
  return IPDEC2DD(parseInt(("1".repeat(masklen) + "0".repeat(32-masklen)),2));
}


function IPMASKWILD (ip) {
  var masklen;
  masklen = ip.substr(ip.indexOf("/")+1);
  return IPDEC2DD(parseInt(("0".repeat(masklen) + "1".repeat(32-masklen)),2));
}


function IPHOSTS (ip) {
  var masklen;
  
  masklen = ip.substr(ip.indexOf("/")+1);
  
  return (Math.pow(2, (32-masklen))-2);
}



/**
 Takes and IP address and adds an integer.
 */
function IPADD(ip, x) {
  x = x || 1;
  ip = IPDD2DEC(IPADDR(ip));
  return IPDEC2DD(ip + x);
}

/**
 Takes an IP and returns an array of the octets, if octet is specified,
   then only returns that specific octet, 1 through 4.
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
 Strips the subnet from the end of an ip/mask
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
 Converts decimal IP to Dotted Decimal
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
 Converts dotted decimal IP to Hexadecimal
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
 Converts dotted decimal IP to Binary
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
 Converts dotted decimal IP to Decimal
 */
function IPDD2DEC (ip) {
  var octet;
  var IPHEX="";
  var octets=[];
  var i;
  
  return parseInt(IPDD2HEX(ip),16);
  
}

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
 Fills a column with subnets incrementally. If the range is a single row, then will fill horizontally.
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
 Fills a column with IP addresses. If only one cell is selected it will fill
 in the subnet as specified by the mask. If a range is selected it will fill in the 
 selected range incrementally.
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
