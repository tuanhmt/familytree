ARG PHP_VERSION=8.0
ARG SETUID=7000


#droptica/php-apache
FROM droptica/php-apache:$PHP_VERSION

ARG SETUID
ENV DOCUMENT_ROOT /var/www/html/web

# mariadb-client is needed to run drush updb
RUN apt-get update && \
    apt-get install -y mariadb-client && \
    apt-get --purge -y autoremove && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /var/www/html/drupal_config &&\
    mkdir -p /var/www/html/web/sites/default/files/translations &&\
    mkdir -p /var/www/html/web/sites/default/files/languages &&\
    mkdir -p /var/www/html/web/sites/default/private_files &&\
    mkdir -p /var/www/html/web/sites/default/files/styles/content_card &&\
    chmod 777 -Rf /var/www/html/web/sites/default/files &&\
    chmod 777 -Rf /var/www/html/web/sites/default/files/translations &&\
    chmod 777 -Rf /var/www/html/web/sites/default/files/languages &&\
    chmod 777 -Rf /var/www/html/web/sites/default/private_files &&\
    chmod 777 -Rf /var/www/html/web/sites/default/files/styles/content_card &&\
    chmod 777 -Rf /var/www/html/drupal_config &&\
    chown ${SETUID}:${SETUID} -Rf /var/www/html/web/sites &&\
    chown ${SETUID}:${SETUID} -Rf /var/www/html/drupal_config

VOLUME ${DOCUMENT_ROOT}/sites/default/files
VOLUME ${DOCUMENT_ROOT}/sites/default/private_files

WORKDIR /var/www/html/
