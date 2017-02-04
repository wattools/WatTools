import boto3
import logging
from urlparse import parse_qs
from string import Template

def handler(event, context):
    log = logging.getLogger()
    log.setLevel(logging.DEBUG)
    body = parse_qs(event['body'])
    params = {
        "name": body.get("name", ["Null"])[0],
        "email": body.get("email", ["Null"])[0],
        "message": body.get("message", ["Null"])[0],
    }
    log.debug(params)
    msg = Template("""New message from $name ($email):
$message""").safe_substitute(params)
    client = boto3.client('ses', region_name='us-west-2')
    client.send_email(
        Source='-source-',
        Destination={
            'ToAddresses': [
                '-dest-',
            ]
        },
        Message={
            'Subject': {
                'Data': 'Uwaterloo.xyz feedback'
            },
            'Body': {
                'Text': {
                    'Data': msg
                }
            }
        }
    )
    # Format as per https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html#api-gateway-simple-proxy-for-lambda-output-format
    return {
        "statusCode": 200,
        "headers": {},
        "body": "All good!"
    }
