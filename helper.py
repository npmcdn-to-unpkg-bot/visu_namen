import decimal
import json


def decimal_default(obj):
    """
    Conversion function for converting decimal.decimals into float.
    This is required because MySQL returns Decimals for AVG() and similar functions
    but json.dumps() does not understand them.
    Pass this function as default-parameter to
    json.dumps(rows, default = helper.decimal_default )
    to convert rows with decimals to JSON
    :param obj:
    :return:
    """
    if isinstance(obj, decimal.Decimal):
        return float(obj)
    raise TypeError

