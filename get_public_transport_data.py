import json
import os
import requests

ORIGINAL = "https://geo.rug.nl/arcgis/rest/services/VerkeerInfra/PublicTransportStopsNetherlands/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&orderByFields=id%20ASC&resultOffset={}&resultRecordCount=1000"

offset = 0
if not os.path.exists("halts"):
    os.mkdir("halts")


while True:
    print("offset is : {}".format(offset))
    host = ORIGINAL.format(offset)
    res = requests.get(host)
    json_loaded = json.loads(res.text)
    counts = len(json_loaded["features"])
    print("length of halts: {}".format(counts))
    offset = offset + 1000
    if counts <= 0:
        print("done!")
        break

    json_str = json.dumps(json_loaded, indent=4)

    with open("halts/halts_offset_{}.json".format(offset), "wb") as writer:
        writer.write(json_str.encode())
# json_data = json.dumps(res.text)
