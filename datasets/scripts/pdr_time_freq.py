#!/usr/bin/python

#============================== description ===================================

# This script generates a new dataset with:
#   X: the time
#   Y: the PDR
#
# The generated files are located:
#   inside processed/<site>/<date>/pdr_time_freq/one_to_one/<src_mac>/<dst_mac>/<channel>.json
#   inside processed/<site>/<date>/pdr_time_freq/one_to_many/<src_mac>/<dst_mac>/<channel>.json

# the format is json:
#  TODO

#=============================== imports ======================================

import os
import argparse
import json
import pandas as pd
import datetime

import DatasetHelper

#=============================== defines ======================================

RAW_PATH = "../raw"
OUT_PATH = "../processed"

#=============================== main =========================================


def main():

    # parsing user arguments

    parser = argparse.ArgumentParser()
    parser.add_argument("testbed", help="The name of the testbed data to process", type=str)
    parser.add_argument("-o2o", "--one_to_one", help="The name of the testbed data to process", action="store_true")
    parser.add_argument("-e", "--emitter", help="The emitting node", type=str)
    parser.add_argument("date", help="The date of the dataset", type=str)
    args = parser.parse_args()

    # load the dataset

    raw_file_path = "{0}/{1}/{2}.csv".format(RAW_PATH, args.testbed, args.date)
    df = pd.read_csv(raw_file_path)
    dtsh = DatasetHelper.helper(df, args.testbed)

    if args.one_to_one:
        one_to_one(dtsh, args.date)
    else:
        one_to_many(df, dtsh, args.emitter)


def one_to_many(df, dtsh, emitter=None):

    # select emitters

    if emitter:
        list_emitters = emitter
    else:
        list_emitters = df["srcmac"].drop_duplicates().tolist()

    # compute result

    for emitter in list_emitters:
        df_emitter = df[df["srcmac"] == emitter]
        df_emitter['timestamp'] = pd.to_datetime(df_emitter['timestamp'], format='%Y-%m-%d_%H.%M.%S')
        df_emitter.set_index('timestamp', inplace=True)
        for n, g in df_emitter.groupby(df_emitter["transctr"]):
            gg = g.groupby(pd.TimeGrouper(freq='3S'))
            rx_count = gg.size()
            #times = gg.size().index.tolist()
            times = gg.size().index.get_level_values('timestamp').strftime("%Y-%m-%d %H:%M:%S")
            #print rx_count
            #print times
            pdr = (rx_count * 100 / ((dtsh["node_count"] - 1) * dtsh["tx_count"])).sum()
            print pdr



        # write result

        path = "{0}/{1}/pdr_time_freq/one_to_many/".format(OUT_PATH, dtsh["testbed"])
        if not os.path.exists(path):
            os.makedirs(path)
        json_data = {
              "x": map(str, times),
              "y": pdr,
              "xtitle": "Time",
              "ytitle": "PDR"
        }
        with open(path + "{0}.json".format(emitter), 'w') as output_file:
            json.dump(json_data, output_file)


def one_to_one(dtsh, date):

    group_link = dtsh["data"].groupby([dtsh["data"]["srcmac"], dtsh["data"]["mac"]])
    for link, df_link in group_link:
        srcmac = link[0]
        dstmac = link[1]
        group_freq = df_link.groupby(df_link["frequency"])
        for freq, df_freq in group_freq:
            pdr_list = []
            time_list = []
            group_trans = df_freq.groupby(df_link["transctr"])
            for transctr, df_trans in group_trans:
                # pdr
                rx_count = len(df_trans.index)
                pdr = rx_count * 100 / dtsh["tx_count"]
                pdr_list.append(pdr)

                # time
                t = datetime.datetime.strptime(df_trans["timestamp"].iloc[0], "%Y-%m-%d_%H.%M.%S")
                time_list.append(t)

            # write result

            path = "{0}/{1}/{2}/pdr_time_freq/one_to_one/{3}/{4}/".format(OUT_PATH, dtsh["testbed"], date, srcmac, dstmac)
            if not os.path.exists(path):
                os.makedirs(path)
            json_data = {
                "x": map(str, time_list),
                "y": pdr_list,
                "xtitle": "Date",
                "ytitle": "PDR"
            }
            with open(path + "{0}.json".format(freq), 'w') as output_file:
                json.dump(json_data, output_file)


if __name__ == '__main__':
    main()
