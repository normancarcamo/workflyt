# Workflyt

This boilepate is designed to work behind a proxy server like NGINX, so be mindful that the next tasks are not handled by Node.js directly.

1. Compression (gzip).
2. Cache (using a dedicated partition for this).
3. Serving static files.
4. Error pages 40x & 50x.
5. Load balancing.
6. Server monitoring logging (with logrotate or using a syslog server like rsyslog in another machine).
7. Security SSL.
8. And more...
