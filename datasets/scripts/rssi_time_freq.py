#!/usr/bin/python

# ============================= description ===================================

# This script generates a new dataset for each channel with:
#   X: the list of transaction start times
#   Y: the list of RSSI
#
# The generated files are located:
#   inside processed/<site>/<date>/rssi_time_freq/one_to_one/<src_mac>/<dst_mac>/<channel>.json
#   inside processed/<site>/<date>/rssi_time_freq/one_to_many/<src_mac>/<dst_mac>/<channel>.json
#
# the format is json:
# {
#   'x': [],
#   'y': [],
#   'label': "<channel>"
# }

# ============================== imports ======================================

import os
import argparse
import json
import pandas as pd
import datetime

import DatasetHelper

# ============================== defines ======================================

RAW_PATH = "../raw"
OUT_PATH = "../processed"

# ============================== chart ========================================

chart_config = {
  "ChartType": "line",
  "ChartOptions": {
    "fill": False,
    "scales": {
      "xAxes": [{
        "scaleLabel": {
            "display": True,
            "labelString": 'Date'
        },
      }],
      "yAxes": [{
        "scaleLabel": {
            "display": True,
            "labelString": 'RSSI (dBm)'
        },
        "ticks": {
          "min": 0,
          "max": 100
        },
      }]
    },
  }
}

# ============================== main =========================================


def main():

    # parsing user arguments

    parser = argparse.ArgumentParser()
    parser.add_argument("testbed", help="The name of the testbed data to process", type=str)
    parser.add_argument("-o2o", "--one_to_one", help="Group by pair of nodes", action="store_true")
    parser.add_argument("-o2m", "--one_to_many", help="Group by transmitting node", action="store_true")
    parser.add_argument("-m2m", "--many_to_many", help=" for every node", action="store_true")
    parser.add_argument("date", help="The date of the dataset", type=str)
    args = parser.parse_args()

    # load the dataset

    raw_file_path = "{0}/{1}/{2}.csv".format(RAW_PATH, args.testbed, args.date)
    df = pd.read_csv(raw_file_path)
    dtsh = DatasetHelper.helper(df, args.testbed)

    if args.one_to_one:
        one_to_one(dtsh, args.date)
    if args.one_to_many:
        one_to_many(dtsh, args.date)
    if args.many_to_many:
        many_to_many(dtsh, args.date)

    if not(args.one_to_one or args.one_to_many or args.many_to_many):
        one_to_one(dtsh, args.date)
        one_to_many(dtsh, args.date)
        many_to_many(dtsh, args.date)


def one_to_many(dtsh, date):

    # for each source (tx) node
    group_srcmac = dtsh["data"].groupby("srcmac")
    for srcmac, df_srcmac in group_srcmac:

        # for each channel
        group_freq = df_srcmac.groupby("frequency")
        for freq, df_freq in group_freq:
            list_rssi = []
            list_time = []

            # for each transaction
            group_trans = df_freq.groupby("transctr")
            for transctr, df_trans in group_trans:
                t = datetime.datetime.strptime(df_trans["timestamp"].iloc[0], "%Y-%m-%d_%H.%M.%S")
                for rssi in df_freq["rssi"].tolist():
                    list_time.append(t)
                    list_rssi.append(rssi)

            # write result
            path = "{0}/{1}/{2}/rssi_time_freq/one_to_many/{3}/".format(OUT_PATH, dtsh["testbed"], date, srcmac)
            if not os.path.exists(path):
                os.makedirs(path)
            json_data = {
                  "x": map(str, list_time),
                  "y": list_rssi,
                  "label": freq,
            }
            with open(path + "{0}.json".format(freq), 'w') as output_file:
                json.dump(json_data, output_file)

    # write chart_config
    path = "{0}/{1}/{2}/rssi_time_freq/one_to_many/".format(OUT_PATH, dtsh["testbed"], date)
    with open(path + "chart_config.json", 'w') as chart_config_file:
        json.dump(chart_config, chart_config_file)


def one_to_one(dtsh, date):

    # for each pair of nodes
    group_link = dtsh["data"].groupby(["srcmac", "mac"])
    for link, df_link in group_link:
        srcmac = link[0]
        dstmac = link[1]

        # for each frequency
        group_freq = df_link.groupby("frequency")
        for freq, df_freq in group_freq:
            list_rssi = []
            list_time = []

            # for each transaction
            group_trans = df_freq.groupby("transctr")
            for transctr, df_trans in group_trans:
                t = datetime.datetime.strptime(df_trans["timestamp"].iloc[0], "%Y-%m-%d_%H.%M.%S")
                for rssi in df_freq["rssi"].tolist():
                    list_time.append(t)
                    list_rssi.append(rssi)

            # write result

            path = "{0}/{1}/{2}/rssi_time_freq/one_to_one/{3}/{4}/".format(
                OUT_PATH, dtsh["testbed"], date, srcmac, dstmac)
            if not os.path.exists(path):
                os.makedirs(path)
            json_data = {
                "x": map(str, list_time),
                "y": list_rssi,
                "label": freq,
            }
            with open(path + "{0}.json".format(freq), 'w') as output_file:
                json.dump(json_data, output_file)

    path = "{0}/{1}/{2}/rssi_time_freq/one_to_one/".format(OUT_PATH, dtsh["testbed"], date)
    with open(path + "chart_config.json", 'w') as chart_config_file:
        json.dump(chart_config, chart_config_file)


def many_to_many(dtsh, date):

    # for each frequency
    group_freq = dtsh["data"].groupby("frequency")
    for freq, df_freq in group_freq:
        list_rssi = []
        list_time = []

        # for each transaction
        group_trans = df_freq.groupby("transctr")
        for transctr, df_trans in group_trans:
            t = datetime.datetime.strptime(df_trans["timestamp"].iloc[0], "%Y-%m-%d_%H.%M.%S")
            for rssi in df_freq["rssi"].tolist():
                list_time.append(t)
                list_rssi.append(rssi)

        # write result

        path = "{0}/{1}/{2}/rssi_time_freq/many_to_many/".format(OUT_PATH, dtsh["testbed"], date)
        if not os.path.exists(path):
            os.makedirs(path)
        json_data = {
            "x": map(str, list_time),
            "y": list_rssi,
            "label": freq,
        }
        with open(path + "{0}.json".format(freq), 'w') as output_file:
            json.dump(json_data, output_file)

    path = "{0}/{1}/{2}/rssi_time_freq/many_to_many/".format(OUT_PATH, dtsh["testbed"], date)
    with open(path + "chart_config.json", 'w') as chart_config_file:
        json.dump(chart_config, chart_config_file)


if __name__ == '__main__':
    main()
