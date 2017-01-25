#!/usr/bin/python

# ============================= description ===================================

# This script generates a new dataset with:
#   X: the 16 channels
#   Y: the RSSI
#
# The generated files are located:
#   inside processed/<site>/<date>/<rssi_freq>/one_to_many/<srcmac>.json
#   inside processed/<site>/<date>/<rssi_freq>/one_to_one/<srcmac>/<dstmac>.json
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
  "ChartType": "bar",
  "ChartOptions": {
    "scales": {
      "xAxes": [{
        "scaleLabel": {
            "display": True,
            "labelString" : 'Channels'
        },
      }],
      "yAxes": [{
        "scaleLabel": {
            "display": True,
            "labelString" : 'RSSI Average (dBm)'
        },
        "ticks": {
          "min": -100,
          "max": 20
        }
      }]
    }
  }
}

# ============================== main =========================================


def main():

    # parsing user arguments

    parser = argparse.ArgumentParser()
    parser.add_argument("testbed", help="The name of the testbed data to process", type=str)
    parser.add_argument("-o2o", "--one_to_one", help="The name of the testbed data to process", action="store_true")
    parser.add_argument("date", help="The date of the dataset", type=str)
    args = parser.parse_args()

    # load the dataset

    raw_file_path = "{0}/{1}/{2}.csv".format(RAW_PATH, args.testbed, args.date)
    df = pd.read_csv(raw_file_path)
    dtsh = DatasetHelper.helper(df, args.testbed)

    if args.one_to_one:
        one_to_one(dtsh, args.date)
    else:
        one_to_many(dtsh, args.date)


def one_to_many(dtsh, date):
    # for each source (tx) node
    group_srcmac = dtsh["data"].groupby(dtsh["data"]["srcmac"])
    for srcmac, df_srcmac in group_srcmac:

        # for each frequency, compute rssi
        list_freq = []
        list_avg_rssi = []
        group_freq = df_srcmac.groupby(df_srcmac["frequency"])
        for freq, df_freq in group_freq:
            rx_count = len(df_freq)
            sum_rssi = df_freq.rssi.sum()
            avg_rssi = round(sum_rssi / rx_count, 0)
            list_freq.append(freq)
            list_avg_rssi.append(avg_rssi)

        # write result

        path = "{0}/{1}/{2}/rssi_freq/one_to_many/".format(OUT_PATH, dtsh["testbed"], date)
        if not os.path.exists(path):
            os.makedirs(path)
        json_data = {
            "x": map(str, list_freq),
            "y": list_avg_rssi,
            "label": srcmac
        }
        with open(path + "{0}.json".format(srcmac), 'w') as output_file:
            json.dump(json_data, output_file)

    path = "{0}/{1}/{2}/rssi_freq/one_to_many/".format(OUT_PATH, dtsh["testbed"], date)
    with open(path + "chart_config.json", 'w') as chart_config_file:
        json.dump(chart_config, chart_config_file)


def one_to_one(dtsh, date):

    # for each pair of node
    group_link = dtsh["data"].groupby([dtsh["data"]["srcmac"], dtsh["data"]["mac"]])
    for link, df_link in group_link:
        srcmac = link[0]
        dstmac = link[1]

        # for each frequency compute rssi
        list_freq = []
        list_avg_rssi = []
        group_freq = df_link.groupby(df_link["frequency"])
        for freq, df_freq in group_freq:
            rx_count = len(df_freq)
            sum_rssi = df_freq.rssi.sum()
            avg_rssi = round(sum_rssi / rx_count, 0)
            list_freq.append(freq)
            list_avg_rssi.append(avg_rssi)

        # write result

        path = "{0}/{1}/{2}/rssi_freq/one_to_one/{3}/".format(OUT_PATH, dtsh["testbed"], date, srcmac)
        if not os.path.exists(path):
            os.makedirs(path)
        json_data = {
            "x": map(str, list_freq),
            "y": list_avg_rssi,
            "label": dstmac
        }
        with open(path + "{0}.json".format(dstmac), 'w') as output_file:
            json.dump(json_data, output_file)

    path = "{0}/{1}/{2}/rssi_freq/one_to_one/".format(OUT_PATH, dtsh["testbed"], date)
    with open(path + "chart_config.json", 'w') as chart_config_file:
        json.dump(chart_config, chart_config_file)


if __name__ == '__main__':
    main()
