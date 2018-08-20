#/usr/bin/env python

# Document : GetComics.py
# Date : 2018-08-18
# Developer : Prashant Shrestha

import requests
import sys

baseLink = "http://mybox:1338/short"
toShortenLink = sys.argv[1]

def shorten():
    if len(toShortenLink) > 0:
        req = requests.post(baseLink, data={"auth": "pms", "link": toShortenLink})
        print(req.text)

shorten()
