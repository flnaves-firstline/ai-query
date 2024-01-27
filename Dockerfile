# We are using a snapshot of the database because it's not yet possible to import FHIR SQL Builder programmatically.
# All processes of exporting and importing are manual, as we can see in the documentation here: 
# https://docs.intersystems.com/components/csp/docbook/DocBook.UI.Page.cls?KEY=AFSB
ARG IMAGE=flnaves/fhir-contest:latest
FROM $IMAGE as builder

WORKDIR /home/irisowner/irisdev
#