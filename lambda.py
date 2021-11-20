#!/usr/bin/env python3
import boto3
import logging
import os
from urllib.parse import parse_qs


def handler(event, context):
    log = logging.getLogger()
    log.setLevel(logging.INFO)
    body = parse_qs(event["body"])
    params = {
        "name": body.get("name", ["Null"])[0],
        "email": body.get("email", ["Null"])[0],
        "message": body.get("message", ["Null"])[0],
    }
    log.info(f"Received params: {params}")
    msg = f'New message from {params["name"]} ({params["email"]}): {params["message"]}'
    client = boto3.client("ses", region_name=os.environ["AWS_REGION"])
    dest_addr = os.environ["dest_addr"]
    src_addr = os.environ["src_addr"]
    client.send_email(
        Source=src_addr,
        Destination={
            "ToAddresses": [
                dest_addr,
            ]
        },
        Message={
            "Subject": {"Data": "wattools feedback"},
            "Body": {"Text": {"Data": msg}},
        },
    )
    # Format as per https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html#api-gateway-simple-proxy-for-lambda-output-format
    return {"statusCode": 200, "headers": {}, "body": {"res": "All good!"}}
