#!/usr/bin/python

# ============================= description ===================================

# This script generates a file containing the given dataset information:
#   number of nodes
#   number of channels
#   duration
#   size
#
# The generated file are located here:
#    processed/<site>/<data>/info.json
#
# the format is json:
# {
#   'nb_nodes': <int>,
#   'nb_channels': <int>,
#   'duration': <int> (in hours)
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

# ============================== main =========================================


def main():

    # parsing user arguments

    parser = argparse.ArgumentParser()
    parser.add_argument("testbed", help="The name of the testbed data to process", type=str)
    parser.add_argument("date", help="The date of the dataset", type=str)
    args = parser.parse_args()

    # load the dataset

    raw_file_path = "{0}/{1}/{2}".format(RAW_PATH, args.testbed, args.date)
    if os.path.isfile(raw_file_path + ".csv"):
        raw_file_path += ".csv"
    elif os.path.isfile(raw_file_path + ".csv.gz"):
        raw_file_path += ".csv.gz"
    else:
        print "Files supported: .csv and .csv.gz"
        quit()
    df = pd.read_csv(raw_file_path)
    dtsh = DatasetHelper.helper(df, args.testbed)
    file_size = round(os.path.getsize(raw_file_path) / (1024*1024), 2)

    # format collected information

    json_data = {
        "nb_nodes": dtsh["node_count"],
        "nb_channels": dtsh["channel_count"],
        "duration": dtsh["duration"],
        "transaction_count": dtsh["transaction_count"],
        "tx_count": dtsh["tx_count"],
        "tx_ifdur": dtsh["tx_ifdur"],
        "tx_length": dtsh["tx_length"],
        "file_size": file_size,
    }

    # write the information to a file

    path = "{0}/{1}/{2}/".format(OUT_PATH, args.testbed, args.date)
    if not os.path.exists(path):
        os.makedirs(path)
    with open(path + "info.json", 'w') as output_file:
        json.dump(json_data, output_file)


if __name__ == '__main__':
    main()
