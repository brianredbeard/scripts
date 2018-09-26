#!/usr/bin/env python

from rackspace_monitoring.providers import get_driver
from rackspace_monitoring.types import Provider
from raxmon_cli.utils import get_config

def get_instance(username, api_key, url, auth_url=None, auth_token=None):
    driver = get_driver(Provider.RACKSPACE)

    kwargs = {}
    kwargs['ex_force_base_url'] = url
    kwargs['ex_force_auth_url'] = auth_url
    kwargs['ex_force_auth_token'] = auth_token
    instance = driver(username, api_key, **kwargs)

    return instance

result = get_config()
username, api_key = result['username'], result['api_key']
auth_token, api_url = result['auth_token'], result['api_url']
auth_url = result['auth_url']
ssl_verify = result['ssl_verify']

instance = get_instance(username, api_key, api_url, auth_url, auth_token)

entities = instance.list_entities()

for entity in entities:
    print("Entity: ({}):\t{:20}".format(entity.id, entity.label))
    for check in instance.list_checks(entity=entity):
        print("  Check: ({}):\t{:20}".format(check.id, check.label))
