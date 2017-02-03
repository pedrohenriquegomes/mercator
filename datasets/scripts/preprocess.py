#!/usr/bin/python

# ============================= description ===================================

# ============================== imports ======================================

import os
import argparse

# ============================== defines ======================================

RAW_PATH = "../raw"
SCRIPTS = [
    "pdr_freq",
    "rssi_freq",
    "pdr_rssi",
    "pdr_time_freq",
    "pdr_dist",
    "rssi_dist",
    "rssi_time_freq",
]

# ============================== main =========================================


def main():

    # parsing user arguments

    parser = argparse.ArgumentParser()
    parser.add_argument("site", help="The name of the site to process", type=str)
    parser.add_argument("-d", "--date", help="The date of the site to process", type=str, default="")
    args = parser.parse_args()

    # get site list
    site_list = []
    if args.site:
        site_list.append(args.site)
    else:
        site_list = os.listdir(RAW_PATH + "/")

    # run scripts
    for script in SCRIPTS:
        for site in site_list:
            for date in os.listdir(RAW_PATH + "/" + site):
                date_list = date.split('.')
                if date_list[-1] == "csv":
                    if (args.date != "" and args.date == ".".join(date_list[:-1])) or (args.date == ""):
                        command = "python {0}.py {1} {2}".format(script, site, ".".join(date.split(".")[:-1]))
                        print command
                        os.system(command)


if __name__ == '__main__':
    main()
