import urllib3
from urllib import urlencode
import os
import time

GOOGLE_TRENDS_URL = "http://www.google.com/trends/trendsReport?hl=en-US&cmpt=q&content=1&export=1&"

# open the file and read it line by line
names = open("distinct-names-sample.txt", "r").read().split('\n')

# fetch the trends file for each name
http = urllib3.PoolManager()
for name in names:
	print urlencode({'q': name.lower()})
	os.system("/usr/bin/open -a Google\ Chrome '" + GOOGLE_TRENDS_URL + urlencode({'q': name.lower()}) + "'")
	time.sleep(4)