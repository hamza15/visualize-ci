FROM giantswarm/tiny-tools:3.12

RUN  apk --no-cache add bash

WORKDIR /var/opt

COPY . /var/opt/

ENTRYPOINT ["./create_pr.sh"]
