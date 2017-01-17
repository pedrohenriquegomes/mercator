from scipy.spatial import distance
import urllib
import json


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
    helper["tx_count"]= df["txnumpk"].iloc[0]
    helper["transaction_count"] = len(df.groupby([df["transctr"], df["srcmac"]]))

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