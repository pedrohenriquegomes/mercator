#!/usr/bin/python

#============================== description ===================================

# This script generates a new dataset with:
#   X: the distance
#   Y: the PDR
#
# The generated file are located here:
#    processed/<site>/pdr_dist/pdr_dist.json

# the format is json:
# {
#   'x': [],
#   'y': [],
#   'xtitle': "distance (m)"
#   'ytitle': "PDR (%)"
# }

#=============================== imports ======================================

import os
import argparse
import pandas as pd
import json

import DatasetHelper

#=============================== defines ======================================

RAW_PATH = "../raw"
OUT_PATH = "../processed"

#=============================== main =========================================


def main():

    # parsing user arguments

    parser = argparse.ArgumentParser()
    parser.add_argument("testbed", help="The name of the testbed data to process", type=str)
    args = parser.parse_args()

    # load the dataset

    df = pd.read_csv("{0}/{1}.csv".format(RAW_PATH, args.testbed))
    dtsh = DatasetHelper.helper(df, args.testbed)

    # get nodes info

    node_list = DatasetHelper.get_nodes_info(args.testbed)

    # init results

    list_results = []

    # compute PDR and distance for each link

    group_link = dtsh["data"].groupby([dtsh["data"]["srcmac"], dtsh["data"]["mac"]])
    for name, df_link in group_link:
        dtsh_link = DatasetHelper.helper(df_link, args.testbed)
        rx_count = len(df_link)
        pdr = (rx_count * 100) / (dtsh_link["tx_count"] * dtsh_link["transaction_count"])
        dist = DatasetHelper.get_dist(node_list, name[0], name[1])
        list_results.append((dist,pdr))

    # write result

    path = "{0}/{1}/pdr_dist/".format(OUT_PATH, args.testbed)
    if not os.path.exists(path):
        os.makedirs(path)
    list_results.sort(key=lambda tup: tup[0]) # sort list
    json_data = {
        "x": map(str,[res[0] for res in list_results]),
        "y": [res[1] for res in list_results],
        "xtitle": "distance (m)",
        "ytitle": "PDR (%)"
    }

    with open(path + "pdr_dist.json", 'w') as output_file:
        json.dump(json_data, output_file)

if __name__ == '__main__':
    main()
