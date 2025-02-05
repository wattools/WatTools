#!/usr/bin/env python3
import base64
import logging
import os
from urllib.parse import parse_qs

import boto3


def handler(event, context):
    log = logging.getLogger()
    log.setLevel(logging.INFO)
    log.info(f"Received event: {event}")
    body_str = event["body"]
    if event.get("isBase64Encoded", False):
        body_str = base64.b64decode(body_str).decode("utf-8")
    body = parse_qs(body_str)
    params = {
        "name": body.get("name", ["Null"])[0],
        "email": body.get("email", ["Null"])[0],
        "message": body.get("message", [None])[0],
    }
    log.info(f"Received params: {params} from body {event['body']}")
    if not params["message"]:
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json"},
            "body": '{"res": "No message!"}',
        }
    msg = f'New message from {params["name"]} ({params["email"]}): {params["message"]}'
    client = boto3.client("ses", region_name=os.environ["AWS_REGION"])
    dest_addr = os.environ["dest_addr"]
    src_addr = os.environ["src_addr"]
    log.info(f"Sending {msg}, from {src_addr} to {dest_addr}")
    try:
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
    except Exception as e:
        log.error(f"Failed to send email: {e}")
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": '{"res": "Failed to send!"}',
        }
    # Format as per https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html#api-gateway-simple-proxy-for-lambda-output-format
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": '{"res": "All good!"}',
    }
