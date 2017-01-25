#!/usr/bin/python

# ============================= description ===================================

# This script generates a new dataset with:
#   X: the 16 channels
#   Y: the PDR
#
# The generated files are located:
#   inside processed/<site>/<date>/<pdr_freq>/one_to_many/<srcmac>.json
#   inside processed/<site>/<date>/<pdr_freq>/one_to_one/<srcmac>/<dstmac>.json
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

#=============================== defines ======================================

RAW_PATH = "../raw"
OUT_PATH = "../processed"

#=============================== chart ========================================

chart_config = {
  "ChartType": "bar",
  "ChartOptions": {
    "scales": {
      "xAxes": [{
        "type": 'linear',
        "position": 'bottom',
        "scaleLabel": {
            "display": True,
            "labelString" : 'Channels'
        },
      }],
      "yAxes": [{
        "scaleLabel": {
            "display": True,
            "labelString" : 'PDR (%)'
        },
        "ticks": {
          "min": 0,
          "max": 100
        }
      }]
    }
  }
}

#=============================== main =========================================


def main():

    # parsing user arguments

    parser = argparse.ArgumentParser()
    parser.add_argument("testbed", help="The name of the testbed data to process", type=str)
    parser.add_argument("-o2o", "--one_to_one", help="Run for every pair of node", action="store_true")
    parser.add_argument("-o2m", "--one_to_many", help="Run for every transmitting node", action="store_true")
    parser.add_argument("date", help="The date of the dataset", type=str)
    args = parser.parse_args()

    # load the dataset

    raw_file_path = "{0}/{1}/{2}.csv".format(RAW_PATH, args.testbed, args.date)
    df = pd.read_csv(raw_file_path)
    dtsh = DatasetHelper.helper(df, args.testbed)

    if args.one_to_one and not args.one_to_many:
        one_to_one(dtsh, args.date)
    elif args.one_to_many and not args.one_to_one:
        one_to_many(dtsh, args.date)
    else:
        one_to_one(dtsh, args.date)
        one_to_many(dtsh, args.date)


def one_to_many(dtsh, date):

    # for each source (tx) node
    group_srcmac = dtsh["data"].groupby(dtsh["data"]["srcmac"])
    for srcmac, df_srcmac in group_srcmac:

        # for each frequency, compute pdr
        list_freq = []
        list_pdr = []
        group_freq = df_srcmac.groupby(df_srcmac["frequency"])
        for freq, df_freq in group_freq:
            rx_count = len(df_freq)
            pdr = rx_count * 100 / ((dtsh["node_count"]-1)*dtsh["tx_count"])
            list_freq.append(freq)
            list_pdr.append(pdr)

        # write result

        path = "{0}/{1}/{2}/pdr_freq/one_to_many/".format(OUT_PATH, dtsh["testbed"], date)
        if not os.path.exists(path):
            os.makedirs(path)
        json_data = {
              "x": map(str, list_freq),
              "y": list_pdr,
              "label": srcmac
        }
        with open(path + "{0}.json".format(srcmac), 'w') as output_file:
            json.dump(json_data, output_file)

    path = "{0}/{1}/{2}/pdr_freq/one_to_many/".format(OUT_PATH, dtsh["testbed"], date)
    with open(path + "chart_config.json", 'w') as chart_config_file:
        json.dump(chart_config, chart_config_file)


def one_to_one(dtsh, date):

    # for each pair of node
    group_link = dtsh["data"].groupby([dtsh["data"]["srcmac"], dtsh["data"]["mac"]])
    for link, df_link in group_link:
        srcmac = link[0]
        dstmac = link[1]

        # for each frequency compute pdr
        list_freq = []
        list_pdr = []
        group_freq = df_link.groupby(df_link["frequency"])
        for freq, df_freq in group_freq:
            rx_count = len(df_freq)
            pdr = (rx_count * 100 / dtsh["tx_count"])
            list_freq.append(freq)
            list_pdr.append(pdr)

        # write result

        path = "{0}/{1}/{2}/pdr_freq/one_to_one/{3}/".format(OUT_PATH, dtsh["testbed"], date, srcmac)
        if not os.path.exists(path):
            os.makedirs(path)
        json_data = {
            "x": map(str, list_freq),
            "y": list_pdr,
            "label": dstmac
        }
        with open(path + "{0}.json".format(dstmac), 'w') as output_file:
            json.dump(json_data, output_file)

    path = "{0}/{1}/{2}/pdr_freq/one_to_one/".format(OUT_PATH, dtsh["testbed"], date)
    with open(path + "chart_config.json", 'w') as chart_config_file:
        json.dump(chart_config, chart_config_file)


if __name__ == '__main__':
    main()
