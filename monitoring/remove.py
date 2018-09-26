#!/usr/bin/env python

from rackspace_monitoring.providers import get_driver
from rackspace_monitoring.types import Provider
from raxmon_cli.utils import get_config
from urlparse import urlparse

import sys

NOTIFICATION_PLAN='np56u8WBlT'

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

try:
    resource = urlparse(sys.argv[1])
except:
    print("Error parsing URL")
    sys.exit(1)

entities = instance.list_entities()


if resource.hostname is None:
    if resource.path is not None:
        hostname = resource.path
else:
    hostname = resource.hostname

#print("Processing removal for hostname {}".format(hostname))

for e in entities:
    if e.label == hostname:
        break
else:
    e = None

if e is None:
    print("Entity not found - {}".format(hostname))
else:
    instance.delete_entity(e)
    print("Removing entity {} ({})".format(e.id, e.label))

sys.exit(1)
checks = instance.list_checks(entity=e)

if not checks:
    details={u'body_matches': {},
                 u'follow_redirects': True,
                 u'include_body': False,
                 u'method': u'GET',
                 u'url': resource.geturl()}

    disabled=False
    label=u'HTTP'
    timeout=30
    period=60
    monitoring_zones=[u'mzdfw', u'mzord', u'mzlon']
    target_alias=None
    target_resolver=u'IPv4'
    ctype=u'remote.http'
    metadata=None
    scheduled_suppressions=[]

    check = instance.create_check(label=label, 
            timeout=timeout, 
            period=period,
            entity=e,
            monitoring_zones=monitoring_zones, 
            target_alias=target_alias,
            target_hostname=hostname,
            target_resolver=target_resolver,
            type=ctype,
            details=details,
            metadata=metadata,
            scheduled_suppressions=scheduled_suppressions)
    print("Created new check {} on entity {} ({})".format(check.id, e.id, e.label))
    checks = [check]
    alarms = []
else:
    alarms = instance.list_alarms(entity=e)

print("There are now the following resources on entity {} ({})".format(e.id, e.label))
print("  Checks:")
for c in checks:
    print("{:>15s}    {}".format(c.id,c.label))
    print("     URL: {}".format(c.details['url']))

if not alarms:
    for check in checks:
        alarm = instance.create_alarm(entity=e, label=u"Status Code",
        check_id=check.id,
        criteria=u":set consecutiveCount=1\n:set consistencyLevel=ALL\n\n\n\nif (metric['code'] regex '[45][0-9][0-9]') {\n  return new AlarmStatus(CRITICAL, 'HTTP server responding with status code #{code}');\n}\n\nreturn new AlarmStatus(OK, 'HTTP server is functioning normally');\n",
        metadata={u"ci_alarm_info":'{"count":1,"level":"ALL","id":"remote.http_status_code_and_body_matches","fields":[]}'},
        notification_plan_id=NOTIFICATION_PLAN)

alarms = instance.list_alarms(entity=e)

print("  Alarms:")
for a in alarms:
    print("{:>15s}    {}".format(a.id,a.label))

