#!/usr/bin/python

# ============================= description ===================================

# This script generates a new dataset with:
#   X: the RSSI
#   Y: the PDR
#
# The generated file is located here:
#    processed/<site>/<date>/pdr_rssi/many_to_many/pdr_rssi.json
#
# the format is json:
#  { x: [], y: [], label:""}

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
        "scaleLabel": {
            "display": True,
            "labelString": 'mean RSSI (dBm)'
        },
        "type": 'linear',
        "position": 'bottom',
        "ticks": {"max": -20, "min": -100}
      }],
      "yAxes": [{
        "scaleLabel": {
            "display": True,
            "labelString": 'PDR (%)'
        },
        "ticks": {
          "beginAtZero": True,
          "ticks": {"max": 100, "min": 0}
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

    # init results

    list_rssi = []
    list_pdr = []

    # compute PDR and average RSSI by transaction

    transaction = dtsh["data"].groupby(["transctr", "srcmac"])
    for name, group in transaction:
        mean_rssi = int(group["rssi"].mean().round())
        rx_count = len(group)
        tx_count = (dtsh["node_count"] - 1) * dtsh["tx_count"] * dtsh["channel_count"]
        pdr = (rx_count * 100) / tx_count
        list_pdr.append(pdr)
        list_rssi.append(mean_rssi)

    # compute average values

    df_avg = pd.DataFrame({"y": list_pdr, "x": list_rssi}).groupby("x", as_index=False).mean().round()

    # write result

    path = "{0}/{1}/{2}/pdr_rssi/many_to_many/".format(OUT_PATH, args.testbed, args.date)
    if not os.path.exists(path):
        os.makedirs(path)
    json_data = {
        "x": map(str, list_rssi),
        "y": list_pdr,
        "avg": [{'x': x, 'y': y} for (x, y) in df_avg.to_dict("split")["data"]],
        "label": "Waterfall plot"
    }

    with open(path + "pdr_rssi.json", 'w') as output_file:
        json.dump(json_data, output_file)

    with open(path + "chart_config.json", 'w') as chart_config_file:
        json.dump(chart_config, chart_config_file)

if __name__ == '__main__':
    main()
