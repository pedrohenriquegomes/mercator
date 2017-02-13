#!/usr/bin/python

# ============================= description ===================================

# This script generates a new dataset with:
#   X: the distance
#   Y: the RSSI
#
# The generated file are located here:
#    processed/<site>/<date>/rssi_dist/many_to_many/rssi_dist.json
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
            "labelString": 'RSSI (dBm)'
        },
        "ticks": {
          "min": -100,
          "max": 0
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

    list_rssi = []
    list_dist = []

    # compute RSSI and distance for each link

    group_link = dtsh["data"].groupby(["srcmac", "mac"])
    for name, df_link in group_link:
        dist = DatasetHelper.get_dist(node_list, name[0], name[1])

        for rssi in df_link["rssi"].tolist():
            list_dist.append(dist)
            list_rssi.append(rssi)

    # compute average values

    df_avg = pd.DataFrame({"y": list_rssi, "x": list_dist}).groupby("x", as_index=False).mean().round(1)

    # write result

    path = "{0}/{1}/{2}/rssi_dist/many_to_many/".format(OUT_PATH, args.testbed, args.date)
    if not os.path.exists(path):
        os.makedirs(path)

    json_data = {
        "x": list_dist,
        "y": list_rssi,
        "avg": [{'x': x, 'y': y} for (x, y) in df_avg.to_dict("split")["data"]],
        "label": "RSSI over distance"
    }

    with open(path + "rssi_dist.json", 'w') as output_file:
        json.dump(json_data, output_file)

    # write chart configuration

    with open(path + "chart_config.json", 'w') as chart_config_file:
        json.dump(chart_config, chart_config_file)

if __name__ == '__main__':
    main()
