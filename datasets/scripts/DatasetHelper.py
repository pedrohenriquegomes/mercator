from scipy.spatial import distance
import urllib
import json
import datetime


def helper(df, testbed=None):
    helper = {
        "node_count": -1,
        "tx_count": None,
        "channel_count": None,
        "testbed": testbed,
        "data":  None,
    }

    # remove wrong values

    df.drop_duplicates(inplace=True)
    helper["data"] = df[(df.crc == 1) & (df.expected == 1)]

    # extract dataset properties

    helper["node_count"] = len(df.groupby(df["mac"]))
    helper["channel_count"] = len(df.groupby(df["frequency"]))
    if "nbpackets" in df.keys():
        helper["tx_count"]= df["nbpackets"].iloc[0]
    else:
        helper["tx_count"] = df["txnumpk"].iloc[0]
    helper["tx_ifdur"] = df["txifdur"].iloc[0]
    if "txpksize" in df.keys():
        helper["tx_length"] = df["txpksize"].iloc[0]
    else:
        helper["tx_length"] = df["txlength"].iloc[0]
    helper["transaction_count"] = len(df.groupby([df["transctr"], df["srcmac"]]))
    start_time = datetime.datetime.strptime(df["timestamp"].iloc[0], "%Y-%m-%d_%H.%M.%S")
    end_time = datetime.datetime.strptime(df["timestamp"].iloc[-1], "%Y-%m-%d_%H.%M.%S")
    helper["duration"] = (end_time - start_time).seconds/3600.0

    return helper


def get_nodes_info(testbed):
    target_url = "https://raw.githubusercontent.com/openwsn-berkeley/mercator/data/metas/{0}.json".format(testbed)
    node_list = json.loads(urllib.urlopen(target_url).read())
    return node_list


def get_coords(node_list, mac):
    for node in node_list:
        if "mac" in node and node["mac"] == mac:
            return float(node["x"]), float(node["y"]), float(node["z"])
    return 0, 0, 0


def get_dist(node_list, mac1, mac2):
    mac1_coords = get_coords(node_list, mac1)
    mac2_coords = get_coords(node_list, mac2)
    dist = distance.euclidean(mac1_coords,mac2_coords)
    return dist