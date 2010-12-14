#!/bin/bash


#get rhel4
/usr/bin/curl -s  http://public-yum.oracle.com/repo/EnterpriseLinux/EL4/8/base/x86_64/ | grep -e ocfs2 -e oracleasm  | sed 's/.*<a href="\([.a-zA-Z0-9_-]*\).*/\/usr\/bin\/curl -o oracle\/4\/x86_64\/\1 http:\/\/public-yum.oracle.com\/repo\/EnterpriseLinux\/EL4\/8\/base\/x86_64\/\1 /g' 
/usr/bin/curl -s http://public-yum.oracle.com/repo/EnterpriseLinux/EL4/8/base/i386/ | grep -e ocfs2 -e oracleasm  | sed 's/.*<a href="\([.a-zA-Z0-9_-]*\).*/\/usr\/bin\/curl -o oracle\/4\/i386\/\1 http:\/\/public-yum.oracle.com\/repo\/EnterpriseLinux\/EL4\/8\/base\/i386\/\1 /g' 

#get rhel5
/usr/bin/curl -s  http://public-yum.oracle.com/repo/EnterpriseLinux/EL5/5/base/x86_64/ | grep -e ocfs2 -e oracleasm  | sed 's/.*<a href="\([.a-zA-Z0-9_-]*\).*/\/usr\/bin\/curl -o oracle\/5\/x86_64\/\1 http:\/\/public-yum.oracle.com\/repo\/EnterpriseLinux\/EL5\/5\/base\/x86_64\/\1 /g' 
/usr/bin/curl -s http://public-yum.oracle.com/repo/EnterpriseLinux/EL5/5/base/i386/ | grep -e ocfs2 -e oracleasm  | sed 's/.*<a href="\([.a-zA-Z0-9_-]*\).*/\/usr\/bin\/curl -o oracle\/5\/i386\/\1 http:\/\/public-yum.oracle.com\/repo\/EnterpriseLinux\/EL5\/5\/base\/i386\/\1 /g'
