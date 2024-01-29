 [![Gitter](https://img.shields.io/badge/Available%20on-Intersystems%20Open%20Exchange-00b2a9.svg)](https://openexchange.intersystems.com/package/iris-fhir-template)

# AI Query
## Overview
Revolutionize patient care with our groundbreaking app, AIQuery, which turns complex data queries into simple, natural language requests, leveraging the power of AI. In the fast-paced world of healthcare, identifying patients with gaps in care is crucial for enhancing care quality, patient satisfaction, and achieving superior outcomes. Yet, many organizations struggle with outdated systems, relying on inefficient manual processes that are costly and error-prone.
Clinovera addresses these challenges head-on by enabling healthcare professionals to effortlessly identify patients in need of attention and suitable candidates for clinical trials. 

Our AI-based eligibility query tool dramatically simplifies finding patients with gaps in care and identifying cohorts of patients for clinical trials and studies. We loaded FHIR resources for test patients into IRIS and exposed them to the AI query tool using IRIS FHIR SQL builder. The AI tool recognizes requests against heterogeneous data sources, asks clarifying questions and executes asynchronous tasks.

## Usage
Utilizing AIQuery is straightforward and designed with the user in mind. Begin by simply typing or speaking your query into the app, using natural language as if you were asking a colleague.

Here's how our solution stands out:
- **Simplify complexity:** Forget navigating complex databases. Say what you need in plain language, like "Find me all Hispanic patients with diabetes born after January 1, 1960, with elevated blood pressure, who are obese and on statins."
- **Incremental queries:** Start with a broad request and refine it as you go, such as adding "I only want female patients" to your initial query, making data exploration intuitive and dynamic.
- **Smart classification:** Our AI doesn't just take your words at face value. It understands medical terminology, turning a query for "statin" into a search across all relevant medications.
- **Interactive clarification:** When queries are ambiguous, AIQuery seeks clarity. If you mention "ibuprofen," the app confirms whether you're referring to the drug specifically or its broader class.
- **Effortless asynchronicity:** Request your data and move on with your day. AIQuery works in the background, delivering results when you're ready, even if it's "by tomorrow morning."

## Components
### Container 1: InterSystems FHIR Database
Functionality: This container runs an InterSystems FHIR database. The database schema is meticulously crafted using the FHIR SQL Builder, ensuring an optimized structure for storing and retrieving patient information efficiently and securely.

### Container 2: .NET Application
Front-End Interface: The .NET application features a user-friendly front-end interface. Users can input their data queries into a text box, making the process of data retrieval straightforward and accessible.
Integration with OpenAI: Utilizing the OpenAI API, the application translates natural language queries into precise SQL commands. This innovative approach allows users without SQL knowledge to interact with the database effortlessly.
Data Retrieval: The generated SQL queries interact with the InterSystems FHIR database to fetch requested patient data, demonstrating a seamless integration between the front-end interface and the database.


## Prerequisites
Make sure you have [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [Docker desktop](https://www.docker.com/products/docker-desktop) installed.

## Installation 

### Docker (e.g. for dev purposes)

Clone/git pull the repo into any local directory

```
$ git clone https://github.com/flnaves-firstline/ai-query.git
```

The application requires an OpenAI API key to work. Insert the key to the [src/app/PatientQuery.Back/appsettings.json](https://github.com/intersystems-community/iris-fhir-server-template/tree/master/src/app/PatientQuery.Back/appsettings.json) config file in the `OpenAi.ApiKey` field

```
  ...
  "OpenAi": {
    "Url": "https://api.openai.com",
    "ApiKey": "your-openai-api-key-here",
  ...
```

Open the terminal in this directory and run:

```
$ docker-compose up -d
```

## Patient data
The template goes with 19 preloaded patents in [/data/fhir](https://github.com/intersystems-community/iris-fhir-server-template/tree/master/data/fhir) folder which are being loaded during [docker build](https://github.com/intersystems-community/iris-fhir-server-template/blob/8bd2932b34468f14530a53d3ab5125f9077696bb/iris.script#L26)
You can generate more patients doing the following. Open shel terminal in repository folder and call:
```
docker run --rm -v $PWD/output:/output --name synthea-docker intersystemsdc/irisdemo-base-synthea:version-1.3.4 -p 10
```
this will create 10 more patients in data/fhir folder.
Then open IRIS terminal in FHIRSERVER namespace with the following command:
```
docker-compose exec iris iris session iris -U FHIRServer
```
and call the loader method:
```
do ##class(HS.FHIRServer.Tools.DataLoader).SubmitResourceFiles("/home/irisowner/irisdev/app/output/fhir/", "FHIRSERVER", "/fhir/r4")
```

 with using the [following project](https://github.com/intersystems-community/irisdemo-base-synthea)

## Testing FHIR R4 API

Open URL http://localhost:52773/fhir/r4/metadata
you should see the output of fhir resources on this server

## Testing Postman and FHIR SQL calls
Open Postman and make a GET call for all preloaded Patient:
```
http://localhost:52773/fhir/r4/Patient
```
<img width="1018" alt="Screenshot 2024-01-24 at 18 27 30" src="https://github.com/flnaves/fhir-contest/assets/20970112/dda9e5ad-67f7-4a2b-8720-f58741bb84a2">

Access the FHIR SQL Builder view at http://localhost:52773/csp/fhirsql/index.html#/ to verify if all settings have been uploaded:
<img width="1430" alt="Screenshot 2024-01-26 at 10 38 43" src="https://github.com/flnaves/fhir-contest/assets/20970112/afa66fae-07eb-455b-8b82-8bd43b8fcb94">

Open Intersystems SQL Editor http://localhost:52773/csp/sys/exp/%25CSP.UI.Portal.SQL.Home.zen?$NAMESPACE=FHIRSERVER and perform the following query:
```
SELECT 
ID, BirthDate, DeceasedDateTime, Gender, IdentifierValue, Key, UsCoreEthnicityOmbCategoryValueCodingDisplay, UsCoreEthnicityTextValueString, UsCoreEthnicityUrl, UsCoreRaceOmbCategoryValueCodingDisplay, UsCoreRaceTextValueString, UsCoreRaceUrl
FROM TransformationSparta.Patient
```
<img width="1430" alt="Screenshot 2024-01-24 at 18 37 03" src="https://github.com/flnaves/fhir-contest/assets/20970112/262a814f-7b27-46f5-b094-9b33c56a20c6"> 

## Troubleshooting
**ERROR #5001: Error -28 Creating Directory /usr/irissys/mgr/FHIRSERVER/**
If you see this error it probably means that you ran out of space in docker.
you can clean up it with the following command:
```
docker system prune -f
```
And then start rebuilding image without using cache:
```
docker-compose build --no-cache
```
and start the container with:
```
docker-compose up -d
```

This and other helpful commands you can find in [dev.md](https://github.com/intersystems-community/iris-fhir-template/blob/cd7e0111ff94dcac82377a2aa7df0ce5e0571b5a/dev.md)

## Demo
Experience AIQuery in action through these simple steps:
- **Basic query execution:**
Begin with a straightforward request. For example, you might ask for "all patients with diabetes."
![AIQuery 1](https://github.com/flnaves-firstline/ai-query/assets/157819189/70a4e7dc-e193-4c70-ad0a-79267b0d0987)
- **Refining your search:**
Add details to narrow down your search: "Show me those who were born after 1960”
![AIQuery 2](https://github.com/flnaves-firstline/ai-query/assets/157819189/5b2e5b9b-9b75-431e-a874-5b4e341382e2)
- **Complex queries simplified:**
Use natural language for complex requests. "Find patients who take simvastatin":
![AIQuery 3](https://github.com/flnaves-firstline/ai-query/assets/157819189/33f020a0-f888-4365-9dd3-bbc6ba9ba4da)
- **Interactive Clarifications:**
When clarification is needed, AIQuery interacts with you. If you ask to find all patients who take aspirin, AIQuery will specify if it is a brand name or a drug generic / class name:
![AIQuery 4](https://github.com/flnaves-firstline/ai-query/assets/157819189/aaa64ede-cb83-4490-bb70-259af7ae2fef)

AIQuery isn't just an app; it's a revolution in healthcare data management. By translating free-form human requests into precise SQL queries against the FHIR database, it opens up a world of possibilities without the need for technical expertise or understanding complex data models.
Transform the way you manage healthcare data with AIQuery. Dive into a seamless, efficient, and user-friendly experience that puts powerful data queries at your fingertips, all through the simplicity of natural language. Try AIQuery today and step into the future of healthcare analytics.

**Team**
- Intersystems certified BE developer: Flavio Naves
- Full stack developer: Denis Kiselev
- Data analyst: Maria Ogienko
- BA: Anastasia Samoilova
- QA: Kseniya Hoar
