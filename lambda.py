import boto3
import logging
from urlparse import parse_qs
from string import Template

def handler(event, context):
    params = parse_qs(event['body'])
    log = logging.getLogger()
    log.setLevel(logging.DEBUG)
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
    return "All good!"
