#!/usr/bin/env python3

import pathlib
import sys

from lxml import etree



def deleteNode(element):
    for item in element:
        item.getparent().remove(item)

def getNode(element):
    for item in element:
        return item.text

imagefile = pathlib.PurePath(sys.argv[1])

root = etree.parse(imagefile.as_posix()).getroot()
author = root.xpath(".//*[text()[contains(.,'Created by')]]")
site = root.xpath(".//*[text()[contains(.,'the Noun Project')]]")

a = getNode(author)
s = getNode(site)

print(a + ". Retrieved", s)
deleteNode(author)
deleteNode(site)


et = etree.ElementTree(root)
outfile = imagefile.with_suffix('.strip.svg')
et.write(outfile.as_posix(), pretty_print=True)
    
