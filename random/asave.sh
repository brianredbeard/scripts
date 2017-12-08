#!/bin/bash

URL="$@"

curl -sIL "http://web.archive.org/save/${URL}"


