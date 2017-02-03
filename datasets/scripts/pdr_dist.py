#!/usr/bin/python

# ============================= description ===================================

# This script generates a new dataset with:
#   X: the distance
#   Y: the PDR
#
# The generated file are located here:
#    processed/<site>/pdr_dist/pdr_dist.json
#
# the format is json:
# {
#   'x': [],
#   'y': [],
#   'label': ""
# }

# ============================== imports ======================================

import os
import argparse
import pandas as pd
import json

import DatasetHelper

# ============================== defines ======================================

RAW_PATH = "../raw"
OUT_PATH = "../processed"

# ============================== chart ========================================

chart_config = {
  "ChartType": "line",
  "ChartOptions": {
    "scales": {
      "xAxes": [{
        "type": 'linear',
        "position": 'bottom',
        "scaleLabel": {
            "display": True,
            "labelString": 'distance (m)'
        },
      }],
      "yAxes": [{
        "scaleLabel": {
            "display": True,
            "labelString": 'PDR (%)'
        },
        "ticks": {
          "min": 0,
          "max": 100
        }
      }]
    },
    "showLines": False,
  }
}

# ============================== main =========================================


def main():

    # parsing user arguments

    parser = argparse.ArgumentParser()
    parser.add_argument("testbed", help="The name of the testbed data to process", type=str)
    parser.add_argument("date", help="The date of the dataset", type=str)
    args = parser.parse_args()

    # load the dataset

    raw_file_path = "{0}/{1}/{2}.csv".format(RAW_PATH, args.testbed, args.date)
    df = pd.read_csv(raw_file_path)
    dtsh = DatasetHelper.helper(df, args.testbed)

    # get nodes info

    node_list = DatasetHelper.get_nodes_info(args.testbed)

    # init results

    list_pdr = []
    list_dist = []

    # compute PDR and distance for each link

    group_link = dtsh["data"].groupby(["srcmac", "mac"])
    for name, df_link in group_link:
        dtsh_link = DatasetHelper.helper(df_link, args.testbed)
        rx_count = len(df_link)
        tx_count = dtsh_link["tx_count"] * dtsh_link["transaction_count"] * dtsh_link["channel_count"]
        pdr = rx_count * 100 / tx_count
        dist = DatasetHelper.get_dist(node_list, name[0], name[1])
        list_pdr.append(pdr)
        list_dist.append(dist)

    # write result

    path = "{0}/{1}/{2}/pdr_dist/many_to_many/".format(OUT_PATH, args.testbed, args.date)
    if not os.path.exists(path):
        os.makedirs(path)

    json_data = {
        "x": list_dist,
        "y": list_pdr,
        "label": "PDR over distance"
    }

    with open(path + "pdr_dist.json", 'w') as output_file:
        json.dump(json_data, output_file)

    with open(path + "chart_config.json", 'w') as chart_config_file:
        json.dump(chart_config, chart_config_file)

if __name__ == '__main__':
    main()
