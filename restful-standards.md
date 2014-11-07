<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

# Yet Another RESTful API Standard (YARAS) - Introduction
  YARAS provides standards, guidelines and conventions for writing a RESTful API and is intended to encourage consistency, maintainability, and consistent use of best practices.

## Table of Contents

- [Why do we need this RESTful Standard?](#why-do-we-need-this-restful-standard)
- [What's in the Standard](#whats-in-the-standard)
- [Open Issues](#open-issues)
- [Versions of this Standards](#versions-of-this-standards)
- [Requests - the Basics](#requests---the-basics)
  - [RESTful URIs - General Guidelines](#restful-uris---general-guidelines)
    - [Good URI examples](#good-uri-examples)
    - [Bad URI examples](#bad-uri-examples)
  - [HTTP Verbs](#http-verbs)
  - [X-HTTP-Method-Override](#x-http-method-override)
- [Responses - the Basics](#responses---the-basics)
  - [The Response Body](#the-response-body)
    - [data](#data)
    - [\_metadata](#\_metadata)
    - [\_links](#\_links)
      - [\_links relations](#\_links-relations)
      - [\_links.item](#\_linksitem)
    - [\_embedded](#\_embedded)
  - [Response Codes](#response-codes)
- [API Discovery and Documentation](#api-discovery-and-documentation)
  - [Hypermedia as the Engine of Application State (HATEOAS)](#hypermedia-as-the-engine-of-application-state-hateoas)
    - [Single Point of Entry and Discovery](#single-point-of-entry-and-discovery)
  - [API Definition](#api-definition)
  - [JSON Schema](#json-schema)
- [Filtering, Sorting, Paging and more...](#filtering-sorting-paging-and-more)
  - [Filtering (where)](#filtering-where)
  - [Sorting (sort)](#sorting-sort)
  - [Pagination](#pagination)
    - [Offset Based Pagination](#offset-based-pagination)
    - [Page Based Pagination](#page-based-pagination)
    - [Pagination and the Response](#pagination-and-the-response)
  - [Including and Excluding Fields](#including-and-excluding-fields)
- [Versioning: Guidelines and Formats](#versioning-guidelines-and-formats)
  - [General Format for Accept Header](#general-format-for-accept-header)
    - [vendorsubtype](#vendorsubtype)
    - [\.version](#\version)
    - [\.property](#\property)
    - [\+format](#\format)
  - [Checking the Response for Media Type](#checking-the-response-for-media-type)
- [Data Integrity and Concurrency Control](#data-integrity-and-concurrency-control)
- [Conditional Requests](#conditional-requests)
- [Auditing and Diagnostic Support](#auditing-and-diagnostic-support)
- [Error handling](#error-handling)
- [Data Types with the payload](#data-types-with-the-payload)
  - [Dates and Times should be Timezone independent.](#dates-and-times-should-be-timezone-independent)
- [Bulk Inserts](#bulk-inserts)
- [Request & Response Examples](#request-&-response-examples)
  - [API Resources](#api-resources)
  - [GET /magazines](#get-magazines)
  - [POST /magazines/[id]/articles](#post-magazinesidarticles)
- [Testability](#testability)
  - [Mock Responses](#mock-responses)
  - [Clients use of HATEOAS - and future proof testing.](#clients-use-of-hateoas---and-future-proof-testing)
- [Implementation recommendations and references.](#implementation-recommendations-and-references)
  - [HATEOAS libraries](#hateoas-libraries)
  - [node.js](#nodejs)
  - [java](#java)
  - [javascript](#javascript)
- [Performance Considerations](#performance-considerations)
  - [Support for field level inclusion/exclusion](#support-for-field-level-inclusionexclusion)
- [References](#references)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Why do we need this RESTful Standard?

Anyone who's spent time writing or using RESTful APIs knows that one size does NOT fit all. REST leaves a tremendous gap between what REST defines and what goes into a full API.

Before I started writing my own I thought I thought I'd be able to find a great RESTful standard that I could use with a quick search or two. In my search I found lots of great APIs, lots of articles on best practices and yes - even a standard or two.

Unfortunately I didn't find anything that captured what I was looking for.  What I found was that some API Standards did what I wanted and some did not. For example I very much liked the documentation for PayPal's API but disliked the use of the version in the url.  However, I very much liked the way that github uses media types for versioning.  The Eve framework uses Mongo DB syntax for filters (e.g. where, sorting and field inclusion). Further these examples where standards so are written in the wrong way to guide RESTful API developers. This standard this is a blend of the best of what I could find that's already out there combined with (very few) of my own ideas.

The bottom line is that nothing out there did quite what I wanted. While nothing was new - it's a combination of what some of the best APIs are doing that I think represents the best practices.

## What's in the Standard

At a very high level I wanted support for these things - though there is much more below:

* A strongly opinionated RESTful structure that while flexible are bounded so that APIs are very consistent.
    * It is absolutely clear how to name resources.
    * It is absolutely clear how to do paging, sorting, filtering, and searching.
    * The standard has an opinion about how errors should be handled.
* Support for versioning using media types.
* Part of the standard is that APIs must have a well known and easy to find specification that developers and consumers can validate requests and responses against (e.g. JSON-schema).
* Supports HATEOAS.

This document borrows heavily from these EXCELLENT sources (many more are at the end of this document):

* [Eve: Python REST API Framework](http://python-eve.org/)
* [Paypal's API](https://developer.paypal.com/docs/api/)
* [GitHub's V3 API](http://developer.github.com/v3/)
* [White House Web API Standards](https://github.com/WhiteHouse/api-standards)
* [HATEOAS](http://en.wikipedia.org/wiki/HATEOAS)

## Open Issues

This is a draft... there are likely many issues with this as well as a number of things I'd like to do - here are a few:

1. We currently allow both offset and simple page based pagination.  Can we collapse this and support just one approach?
2. Consider standards around authentication (e.g. standardize on HMAC Authentication).  When ready take a look at [Eve's Authorization and Authentication models](http://python-eve.org/authentication.html#auth)
3. Consider allowing query filters with YAML-like syntax for improved readability especially after encoding (i.e. 'where={"lastname":"Doe"}&...' is equivalent to 'where=lastname:Doe&...').
4. Take a look at HATEOAS templates - is there a standard process that clearly defines how to name parameters so they can be easily populated/navigated by the client? If so - update the examples herein and reference the model.


## Versions of this Standards

I plan on moving this standard along over time so just as with any other software project I will create branches and versions and encourage you to reference the appropriate version number if you refer to this document so people are aware of what version you speak of.

## Requests - the Basics

### RESTful URIs - General Guidelines

* A URI uniquely identifies a resource.
* URIs should include nouns, not verbs.
* Use plural nouns only for consistency (no singular nouns).
* Some servers ignore case so use lower-case in URI segments, separating words with underscores ('_').
* Use appropriate HTTP verbs (GET, POST, PUT, PATCH, DELETE) to operate on the collections and elements .
* Keep URIs as short as possible, with as few segments as makes sense.
* Parameters in URI versus header:
    * If it changes the logic you write to handle the response, put it in the URI.
    * If it does not change the logic for each response, like OAuth info, put it in the header.

#### Good URI examples

* List of magazines:
    * GET /magazines
* A single magazine:
    * GET /magazines/1234
* All articles in (or belonging to) this magazine:
    * GET /magazines/1234/articles
* Add a new article to a particular magazine:
    * POST /magazines/1234/articles
* Filtering is done via query parameters:
    * GET /magazines?where={"year":2011}
    * GET /articles?where={"topic":"economy","year":2011}
* Two alternative ways you might allow to get to magazines by publisher (though I prefer using the where filter):
    * GET /publishers/somepublisher/magazines
    * GET /magazines?where={"publisher":"somepublisher"}
* Sorting is done via query parameters:
    * GET /magazines?sort=[("year", "asc"),("topic", "desc")]

_Note: the where clauses above are shown un-encoded for clarity._

#### Bad URI examples

* Non-plural noun:
    * /magazine
    * /magazine/1234
    * /publisher/somepublisher/magazine/1234
* Verb in URI:
    * /magazine/1234/create
* Sorting outside of query parameters
    * /magazines/2011/desc

### HTTP Verbs

APIs can support the full range of CRUD operations. Within the same API, you can have a read-only resource accessible at one endpoint, along with a fully editable resource at another endpoint. The following table shows our implementation of CRUD via REST:

<br>
<table border="1" class="docutils">
<colgroup>
<col width="20%">
<col width="26%">
<col width="54%">
</colgroup>
<thead valign="bottom">
<tr class="row-odd"><th class="head">Action</th>
<th class="head">HTTP Verb</th>
<th class="head">Context</th>
</tr>
</thead>
<tbody valign="top">
<tr class="row-even"><td>Create</td>
<td>POST</td>
<td>Collection</td>
</tr>
<tr class="row-odd"><td>Read</td>
<td>GET, HEAD</td>
<td>Collection/Document</td>
</tr>
<tr class="row-even"><td>Update</td>
<td>PATCH</td>
<td>Document</td>
</tr>
<tr class="row-odd"><td>Replace</td>
<td>PUT</td>
<td>Document</td>
</tr>
<tr class="row-even"><td>Delete</td>
<td>DELETE</td>
<td>Collection/Document</td>
</tr>
</tbody>
</table>

### X-HTTP-Method-Override

As a fallback for the odd client not supporting any of these methods, the API should honor X-HTTP-Method-Override requests. For example a client not supporting the PATCH method could send a POST request with a X-HTTP-Method-Override: PATCH header. This indicates that the server should perform a PATCH, overriding the original request method.

## Responses - the Basics


### The Response Body

The overall JSON response for this standard follows the HAL standard with a couple additional elements:

Part of the HAL standard:
* \_links - required - part of the HAL standard - provides for HATEOAS links.
* \_embedded - optional - part of the HAL standard - used to embed resources in the response. When used properly can improve read performance and reduce application chattiness.

Compatible with but not part of the HAL Standard:
* data - required - not part of HAL - data specific to the resource in question is grouped under the 'data' element to make it clear what is related to the resource.
* \_metadata - required - includes various elements that describe the data included in the parent object including but not limited to sorting, filtering, pagination data and field exclusion.

At the top level every HATEAOS response looks like this (though \_embedded is optional):

    {
        "data" : {
        },
        "_metadata" : {
        },
        "_links" : {
        },
        "_embedded" : {
        }
    }

#### data

The data for every resource falls within the data element. As an API designer this where the resource model is populated and is the meat of what you'll be defining. If there is a single resource the data object represents that resource.  If there is more than one resource data may be an array or map of resources.

Generally follow [Google JSON Style Guide](http://google-styleguide.googlecode.com/svn/trunk/jsoncstyleguide.xml) when building out JSON objects. This is because tools will tend to follow these guides.

Required Fields:

* id - (required) yep - this is the only required field - this is an id that uniquely identifies this resource vs other resources of the same type. Some may opt to use guids in this field - still it must be called an 'id'.


Beyond that here are some guidelines for building sensible JSON response bodies:

* No values as keys.
* No internal-specific names (e.g. "node" and "taxonomy term")
* May exclude computationally expensive or rarely used fields by default.
* JSON elements should be meaningful but short if possible
* no values in keys (i.e. {"id": "125", "name": "Health concerns related to increased use of cellphones"} not {"125", "Health concerns related to increased use of cellphones"})
* to make the API consistent consider using common suffixes to denote the type of information in the field e.g.:
    * _dt : DATE information
    * _ts : TIMESTAMP information
    * _id : An identifier column (including surrogate key columns)
    * _guid : A GUID column
    * _cd : A 'code' value which can be referenced in a lookup table
    * _desc : A description column


Example: http://example.gov/api/magazines/{id}

Response body within a data element:

    data : {
        "id": "2",
        "type": "magazine",
        "title": "Newsweak",
        "articles": [
            {"id": "125", "name": "Health concerns related to eating yellow snow"},
            {"id": "834", "name": "Water Quality downstream of cows is an issue mayor says"}
        ],

        ...
    }

#### \_metadata

Borrowing from HAL style syntax this standard adopts the \_metadata object as a means of isolating metadata from other response elements. Any object may have "\_metadata".  \_metadata at the root of the response object refers to the requested resource, while \_metadata found within an \_embedded object for example will refer to that object.

Example uses are to standardize resource responses including the means to page, filter, and sort resources consistently (more on this later) are of this form:

          "_metadata": {
                "status"     : "200",
                "response-schema-uri" : "/schemas/api.schema.json",
                "data-schema-uri" : "/schemas/api.schema.json#magazine_GET",
                "created_at" : "1994-11-05T13:15:30Z",
                "updated_at" : "1994-11-05T13:15:30Z",
                "etag"       : "749093d334ebd05cf7f2b7dbfb7868605578db2c",

                "pagination" : {
                    "page" : 1,
                    "total_pages" : 12,
                    "size" : 5,
                    "offset" : 0
                },
                "sort" : [("lastname", "asc")],
                "where" : {"lastname": "Doe"},
                "fields" : { "includes" : ["articles"], "excludes" : ["categories"] },
                "messages" : {
                },
          },

The metadata properties include:

* status     : (required) the HTTP status code of the response - here to allow for consistency in client logic when handling bulk operations.
* created_at : (optional) the timestamp at which the resource was created.
* updated_at : (required for modifiable objects) the timestamp at which the resource was most recently updated.
* etag       : (required for modifiable objects) the unique identifier used to version the object (see [Data Integrity and Concurrency Control](#data_integrity_and_concurrency_control)).
* data-schema-uri       : (required) the JSON-Schema (see below) that defines the data section of the response.
* response-schema-uri   : (optional) the JSON-Schema (see below) that defines the top level structure of the response (included here in the yaras.schema.json file).

Details on pagination, sort, filter, and where clauses follow in the advanced topics below.

All APIs should have responses defined via a [JSON-Schema](http://json-schema.org) that must be made available to the client. There is a top level yaras.schema.json included with this project though it is not yet validated. Each response will have a unique body and these too should be defined via a JSON-schema. The swagger 2.0 specification allows for this and may be a good way to satisfy this requirement.

#### \_links

Required for to support HALEOAS and defined per the [HAL](http://tools.ietf.org/html/draft-kelly-json-hal) standard.

          "_links": {
            "self": { "href": "/magazines/1?page=1&size=5" },
            "up": { "href": "/magazines" },
            "next": { "href": "/magazines/uid1?page=2" },
            "findById": { "href": "/magazines?id={id}", "templated": true },
            "findByName": { "href": "/magazines?name={name}", "templated": true },
            "byPage": { "href": "/magazines?page={page},size={size}", "templated": true },
            "byOffset": { "href": "/magazines?offset={offset},size={size}", "templated": true },
            "item" : [
                {
                    "Title": "Newsweak",
                    "_links": {
                        "self": { "href": "/magazines/2?summary=true" }
                    }
                },
                {
                    "Title": "People",
                    "_links": {
                        "self": { "href": "/magazines/3?summary=true" }
                    }
                },

            ]
          },

Every \_links object has one or more actions and optionally may include item elements.

##### \_links relations

These are suggestions for standardized link actions but these may vary depending upon the API:

* self - required as per the standard is always present and refers to the object itself
* next - when applicable is a link to the next page or object.
* previous - when applicable is a link to the previous page or object.
* up - an action used in a hierarchies to navigate upward toward the root of a tree.
* down - an action used to navigate downward toward leaves of a tree.
* full - an action from a summary to get to full details.

We use the following standard properties within our link relations:

* href -  (required) - the URI to get the referenced resource.  Please note that in HATEOAS style services should attempt to make use of the href rather than a separate uuid attribute which helps to facilitate select and multi-select use cases of link properties.
* templated -  (required if the relation is a template) - defaults to false - true or false to indicate if this relation is a template.
* title - (optional but highly recommended) - the title to display to the end user - reminder that I18N would be handled by configuration or browser locale and hence could result in different title values for the same resource from different locales or application configurations.
* media - (optional) is by our APIs to add a bit of additional information to add navigational clues (e.g. allowing us to add a '+' for tree nodes instead of requiring an additional query to discern that).

_Note: we're likely compromising the intended use of the ['media' property]((http://tools.ietf.org/html/rfc5988#section-5.4)) within this spec. Whether we use this or another attribute we see a need to include additional attributes to give navigational clues that are not otherwise evident from just a plain link._

##### \_links.item

When a resource has one or more elements or children resources they should be included within the \_links.item array. This JSON representation based upon the [IANA 'item' relation](https://www.iana.org/assignments/link-relations/link-relations.xhtml).

            "item" : [
                {
                    "Title": "Newsweak",
                    "_links": { "self": { "href": "/magazines/2?summary=true" } }
                },
                {
                    "Title": "People",
                    "_links": { "self": { "href": "/magazines/3?summary=true" } }
                },
            ]

If an inner collection is not itself a resource it should instead be included as a part of the basic JSON object - like the articles element mentioned above:

         "articles": [
             {"id": "125", "name": "Health concerns related to eating yellow snow"},
             {"id": "834", "name": "Water Quality downstream of cows is an issue mayor says"}
         ],

#### \_embedded

Mike Kelly, author of Hal has commented that it is intended as a "read optimisation for clients to avoid chatty-ness" but care must be taken when using it as it can have consequences on cache-ability. Clients should search \_embedded elements before making external requests.

Care should be taken with the \_embedded element.  Specifically \_embedded elements can introduce problems in applications because lower level embedded resources that change frequently can cause cache invalidations of higher level objects.

Note the use of query parameters like the 'fields' parameter within \_embedded objects' link actions to minimize the content within them. Below we do so with a "summary" attribute.

APIs should return a map of the elements to remove the need for clients to do lots of work



          "_embedded": {
                "magazines": [
                    {
                        "id": "2",
                        "type": "magazine"
                        "description": "Newsweak",
                        "_links": {
                            "self": { "href": "/magazines/2?summary=true" },
                            "full": { "href": "/magazines/2" }
                        }
                    },
                    {
                        "id": "3",
                        "type": "magazine"
                        "description": "People",
                        "_links": {
                            "self": { "href": "/magazines/3?summary=true" },
                            "full": { "href": "/magazines/3" }
                        }
                    }
                    ...
                ]
          },


Note the 'magazines' level above is entirely optional. All objects are mapped using the 'self' actions above (not the "id" actions) and therefore are part of a global map whether they are divided within the \_embedded object or placed in a single top level array - i.e. the first element above would be "/magazines/2?summary=true" below as well as above.

          "_embedded": {
                "/magazines/2?summary=true":
                    {
                        "id": "2",
                        "type": "magazine"
                        "description": "Newsweak",
                        "_links": {
                            "self": { "href": "/magazines/2?summary=true" },
                            "full": { "href": "/magazines/2" }
                        }
                    },
                "/magazines/3?summary=true":
                    {
                        "id": "3",
                        "type": "magazine"
                        "description": "People",
                        "_links": {
                            "self": { "href": "/magazines/3?summary=true" },
                            "full": { "href": "/magazines/3" }
                        }
                    }
                    ...
                ]
          },

The same set of resources could have been represented this way:

### Response Codes

Should be as specific as we can make them.  Refer to the full list of [HTTP Status Codes](http://www.restapitutorial.com/httpstatuscodes.html)- most APIs should use at least these 10:

* 200 OK - General status code. Most common code used to indicate success.
* 201 CREATED - Successful creation occurred (via either POST or PUT). Set the Location header to contain a link to the newly-created resource (on POST). Response body content may or may not be present.
* 204 NO CONTENT - Indicates success but nothing is in the response body, often used for DELETE and UPDATE operations.
* 400 BAD REQUEST - General error when fulfilling the request would cause an invalid state. Domain validation errors, missing data, etc. are some examples.
* 401 UNAUTHORIZED - Error code response for missing or invalid authentication token.
* 403 FORBIDDEN - Error code for user not authorized to perform the operation or the resource is unavailable for some reason (e.g. time constraints, etc.).
* 404 NOT FOUND- Used when the requested resource is not found, whether it doesn't exist or if there was a 401 or 403 that, for security reasons, the service wants to mask.
* 405 METHOD NOT ALLOWED - Used to indicate that the requested URI exists, but the requested HTTP method is not applicable. For example, POST /users/12345 where the API doesn't support creation of resources this way (with a provided ID). The Allow HTTP header must be set when returning a 405 to indicate the HTTP methods that are supported. In the previous case, the header would look like "Allow: GET, PUT, DELETE"
* 409 CONFLICT - Whenever a resource conflict would be caused by fulfilling the request. Duplicate entries, such as trying to create two customers with the same information, and deleting root objects when cascade-delete is not supported are a couple of examples.
* 500 INTERNAL SERVER ERROR - Never return this intentionally. The general catch-all error when the server-side throws an exception. Use this only for errors that the consumer cannot address from their end.


## API Discovery and Documentation

In order to ensure that our APIs are consistently documented, easily understood and used our RESTful services should be HATEOAS compliant.

However - at this point we believe it is still necessary to provide a more human readable form of documentation which should be published with the service as it evolves (e.g. via tools like swagger).

### Hypermedia as the Engine of Application State (HATEOAS)

In short HATEOAS constraint decouples client and server in a way that allows the server functionality to evolve and change without breaking the client and allowing clients to discover the API - much the way HTML is used by browsers today.  Our RESTful services are required to be constrained by HATEOAS unless specific approval to exclude this requirement is obtained.

* [Why HATEOAS?](http://www.slideshare.net/trilancer/why-hateoas-1547275)
* [Wikipedia: HATEOAS](http://en.wikipedia.org/wiki/HATEOAS)
* [Spring Framework provides a nice abstraction to assist](http://spring.io/guides/gs/rest-hateoas)

#### Single Point of Entry and Discovery

Each RESTful API should have a single point of entry and discovery. In general this is provided by way of our HATEOAS requirement (see below) but single point of entry warrants some special consideration. From this clients can learn how to navigate through the api - and in fact a generalized client could be written to navigate the api without construction of a specialized website.  When combined with a 'API Definition' as mentioned below it should be possible to write tests (or programs) that walk through the tree without needing to understand all the details of the api.

Obviously clients still need to write code to do something with endpoints - this allows the server evolve independently from the client without breaking the client - see testing for future-proofing below.

Minimally we suggest something like what GitHub does to give a client developer a starting point:

    https://api.github.com

For producing an outward facing API we recommend adding a human readable page like what PayPal is doing here:

    https://developer.paypal.com/docs/api/

### API Definition

During release and test we may have differences in our APIs and related schemas. In order to ensure that these differences are clearly visible and available API services should publish a documentation page at this relative address:

	{hostname}/docs

This documentation should be considered part of the code and should change as the code changes.  This is an important part of our code reviews.

Currently to satisfy this requirement we're recommending the [Swagger UI](https://github.com/wordnik/swagger-ui) to display our documentation which is done by way of [Swagger](https://helloreverb.com/developers/swagger) and the related [Swagger Spring Annotations](https://github.com/martypitt/swagger-springmvc).

### JSON Schema

Although Swagger does allow definition of models - version 1.2 is not currently a reliable means to describe differences between the body of POST, PUT, PATCH, GET... requests. As long as this is the case - each API should make a schema available to describe each requests and response.

This schema shall be provided to the client in two ways:

* for humans
    * a link on the api definition page: {hostname}/docs
* for machines
    * by way of the 'response-schema-uri' and the 'data-schema-uri' in the \_metadata element in every response.
    * the overall structure of the api/response: {hostname}/schemas/api.schema.json

This gives clients a formal definition of how requests and responses need to be structured.  These formal definitions can be used for general validation routines both in production and during QA activities.

Of course all requests and responses should follow the guidelines established herein. By way of example - all api definitions should be able to conform to and extend the 'standardResponseStructure' using '$ref' links shown below.

## Filtering, Sorting, Paging and more...

All of these concepts are handled by way of query parameters.

### Filtering (where)

_Concept borrowed in whole or in part from [Eve](http://python-eve.org/)._

Resource endpoints returning multiple results may require greater sophistication.  For these endpoints filtering may be supported on any given resource.  If it is the API should use a subset of the [mongo query syntax](http://docs.mongodb.org/manual/tutorial/query-documents/) within a 'where' parameter:


Let's suppose we wanted to query for all users named "Doe" we would assemble a URL with a where clause like so:

    http://example.com/people?where={"lastname":"Doe"}

Note: the where clauses are shown un-encoded for clarity - here's what they'd really look like encoded:

    $ curl -i -g http://example.com/people?where={%22lastname%22:%20%22Doe%22}
    HTTP/1.1 200 OK

Filters may be enabled or disabled on certain fields as necessary to prevent denial of service attacks on non-indexed fields, etc.  The subset of the syntax supported may be determined by the needs of the API.


### Sorting (sort)

_Concept borrowed in whole or in part from [Eve](http://python-eve.org/)._

Sorting is supported as well:

    http://example.com/people?sort=[("lastname","asc")]

and descending...

    http://example.com/people?sort=[("lastname","desc")]

If directional (asc, desc) flag is not supplied the list is sorted ascending. Multiple fields may of course be specified in the array.

If sorting is not specified the sort order may either be
* returned unsorted
* or returned using a default sort order determined by the server and if so will include the 'sort' field(s) within the metadata element.

### Pagination

_Note: we currently allow both offset and simple page based pagination.  We could probably collapse this by supporting just one of them._

* Some resources are sets of items. If these items are themselves resources (in the RESTFUL sense) they may be included in summary or detail form as appropriate - but in either case must appear in the '_embedded' section.
* Sets of items that do not specify pagination, filtering or sorting will use default values for these parameters and will return details on the values used within the metadata element.

Support for either (or both) pagination by 'offset' and 'page' are detailed in the following sections as are sorting and filtering.

#### Offset Based Pagination

Offset based pagination allows paging by specifying 'offset' and 'size' query parameters.

* If no size is specified, return results with a default number of records.
* If no offset is specified, return results will start with offset=0

* To get records 51 through 75 do this:

    http://example.gov/magazines?offset=50&size=25

Above, offset=50 means, ‘skip the first 50 records’ and size=25 means, ‘return a maximum of 25 records’.


#### Page Based Pagination

Page based pagination is a bit simpler but less flexible than offset based pagination. It takes 'page' and 'size' query parameters.

* If no size is specified, return results with a default number of records.
* If no page is specified, return results will start with page=1

* To get the 3rd page of records with 25 records per page (records 51 through 75):

    http://example.gov/magazines?page=3&size=25

Above, page=3 means, ‘skip the first 2 pages’ and size=25 means, ‘each page size is 25 records’.


#### Pagination and the Response

If pagination is performed the _metadata element must supply pagination details as follows:

        "pagination" : {
            "offset" : 0,
            "page" : 3,
            "size" : 25,
            "total_pages" : 12,
            "total_count" : 315
        },

The client SHOULD specify either offset or page based pagination. If both sets of pagination parameters are supplied the implementation should return an error indicating that the request was malformed.

### Including and Excluding Fields

Minimizing the number of fields generated in the response sometimes desirable as an optimization for rich datasets. The server side of a RESTful resource may choose to (by default) exclude fields that are expensive to generate, render or calculate.  Likewise clients may choose to specify the fields they intend to use to cut down on bandwidth consumption, to include a value that is excluded by default or to make them future proof to changes in the API.

If supported by an API it is specified using by using a comma separated set of values in the 'fields' parameter which is of this form:

    "fields" : { "includes" : ["type"], "excludes" : ["articles"] }

* includes - a list of fields that should be included in the response.
* excludes - a list of fields that should be excluded from the response.

If fields are specified _and used_ by the implementation they must be listed in a 'fields' object enclosed within the metadata object.

Here's an example: /api/magazines/1234?fields={"includes":["type"],"excludes":["articles"]}

Response body:

    {
        "id": "1234",
        "type": "magazine",
        "title": "Public Water Systems",

        _metadata {
            "status"     : "200",
            "data-schema-uri" : "/schemas/api.schema.json#magazines_GET",
            "created_at" : "1994-11-05T13:15:30Z",
            "updated_at" : "1994-11-05T13:15:30Z",
            "etag"       : "749093d334ebd05cf7f2b7dbfb7868605578db2c",
            "fields" : { "includes" : ["type"], "excludes" : ["articles"] }
        }
    }

If a resource doesn't support field inclusion/exclusion the implementation should ignore the fields parameter and exclude the fields object from the metadata results.  This allows an implementation to safely specify fields support in advance of resource support for it.  It also makes clients more resilient to changes to default field exclusions (which may only change in major versions of the API).

When fields are not recognized the server as part of an include a warning is published in the messages section of the metadata object. If it is part of an exclude it should be ignored altogether (since it was supposed to be included anyway).

## Versioning: Guidelines and Formats

_The versioning scheme is to follow the GitHub API model which uses Media Types and was located here as of this writing: http://developer.github.com/v3/media/#beta-v3-and-the-future.  We've extracted and modified what we needed to describe how this model works for us._

Because we make use of HATEOAS certain classes of change, e.g. relocation of resources, should not cause client problems. However versioning of the API remains important in particular as resources change. Here are some guidelines when considering versioning:

* An API should never be released without a version number.
* Minor changes to the API should be backwards compatible and should increase the minor version number.  Examples of minor changes include:
    * Fields added to JSON objects.
    * New links added to responses.
    * Fields deprecated.
* Breaking changes should be avoided if possible but when necessary the major version number must be updated. Generally major changes are structural and include:
    * Fields removed from JSON objects (either permanently or excluded by default).
    * Fields renamed in JSON objects.
    * Links removed from responses.
* If the client requests a specific version the API must respond with the version requested if it is available. If it is not available it should respond with the closest available API version.
* If no version is specified the server should respond with an error detailing the problem and (as with all errors) how to correct the problem (i.e. where to find valid versions).
* Every API should maintain at least one major version back, but maintaining previous minor versions is not required.

### General Format for Accept Header

We use a custom vendor media types to allow us to provide for different versions of the API and differently formatted responses. The general form of our media type for versioning is:

    application/vnd.vendorsubtype.version[.property][+format]

The vendorsubtype, version, property, format are all variables and are detailed in the sections below. The items in brackets are optional.

Clients must use this within an 'Accept' header to request a specific version of the API which is in this form:

* Accept: application/vnd.vendorsubtype.version[.property][+format]

So if you wanted to specify 'v3' of vnd.vendorsubtype's API it would be like so:

* Accept: application/vnd.vendorsubtype.v3

#### vendorsubtype

Throughout this document we use 'vendorsubtype' as the vendor specific mediatype subtype.  You should officially register your 'vnd' and use that instead.  Do so by filling out a request here: http://www.iana.org/cgi-bin/mediatypes.pl.

#### \.version

* Version numbers _for releases_ should be of the form "v{major}":
    * Where {major} is an integer representing the major release number.
    * Good: v1, v2...
    * Bad: 1, 1.0, v1-0a
* Version numbers _non-releases_ must be prefixed with a 'v' followed by any characters except for period or plus characters:
    * Good: v1, vBeta, v1beta, v1a1, v1a2, v1-xyz, v2
    * Bad: v1+Beta, v1.2, 1.3

#### \.property

Resources may also be modified by specifying a version property. This is done by putting a period after the version and then specifying a property ('raw' in this example):

* Accept : application/vnd.vendorsubtype.v3.raw+json

Properties may not contain period or '+' characters however, what exactly the property values are and do is application specific.

_[GitHub's API simply calls these 'properties' and uses them to allow the client to fetch results as html, text or raw markdown for comments.](http://developer.github.com/v3/media/#comment-body-properties)_

#### \+format

All APIs MUST support json+hal which will be the default.

The most basic media types the API supports are:

* application/vnd.vendorsubtype.version+hal+json - (required) same as hal+json but allows for versioning.
* application/vnd.vendorsubtype.version+json - (optional) support for the raw JSON payload (non-HATEOAS) resource representation.

For example:

    application/vnd.vendorsubtype.v3+json+hal

### Checking the Response for Media Type

You can check the format, version, and params through every response’s headers. Look for the Media-Type header:

    $ curl https://api.vendorsubtype.com/users/technoweenie -I
    HTTP/1.1 200 OK
    Media-Type: version=vendorsubtype; major=3; minor=beta; build=uid

    $ curl https://api.vendorsubtype.com/users/technoweenie -I \
      -H "Accept: application/vnd.vendorsubtype.full+json"
    HTTP/1.1 200 OK
    Media-Type: version=vendorsubtype; major=3; minor=beta; property=full; format=json; build=uid

    $ curl https://api.vendorsubtype.com/users/technoweenie -I \
      -H "Accept: application/vnd.vendorsubtype.v3.full+json"
    HTTP/1.1 200 OK
    Media-Type: version=vendorsubtype; major=3; minor=1; property=full; format=json; build=uid


The value of Media-Type is a set of {name} '=' {value} pairs separated by ';'.  The fields above may appear in any order and are defined as follows:

* version - (required) tells the client what version of media it's receiving as well as the major [version](#Version) of the API it's receiving.
* major - (required) the major portion of the [version](#Version) format.
* minor - (required) includes a minor version number.
* format - (required) tells what [format](#Format) the response is in.
* build - (required) a build uid that links the server to a specific build of the RESTful service.
* property - (required if present) tells what [property](#Property) was used to render the page.

## Data Integrity and Concurrency Control

_Concept borrowed in whole or in part from [Eve](http://python-eve.org/)._

API responses must include the [standard HTTP ETag header](http://en.wikipedia.org/wiki/HTTP_ETag) which also allows for proper concurrency control. An ETag is a hash value representing the current state of the resource on the server. Consumers are not allowed to edit or delete a resource unless they provide an up-to-date ETag (via the If-Match header) for the resource they are attempting to edit. This prevents overwriting items with obsolete versions.

Consider the following workflow:

    $ curl -X PATCH -i http://example.com/people/521d6840c437dc0002d1203c -d '{"firstname": "ronald"}'
    HTTP/1.1 403 FORBIDDEN

We attempted an edit (PATCH), but we did not provide an ETag for the item so we got a 403 FORBIDDEN back. Let’s try again:

    $ curl -H "If-Match: 1234567890123456789012345678901234567890" -X PATCH -i http://example.com/people/521d6840c437dc0002d1203c -d '{"firstname": "ronald"}'
    HTTP/1.1 412 PRECONDITION FAILED

What went wrong this time? We provided the mandatory If-Match header, but it’s value did not match the ETag computed on the representation of the item currently stored on the server, so we got a 412 PRECONDITION FAILED. Again!

    $ curl -H "If-Match: 80b81f314712932a4d4ea75ab0b76a4eea613012" -X PATCH -i http://example.com/people/50adfa4038345b1049c88a37 -d '{"firstname": "ronald"}'
    HTTP/1.1 200 OK

Finally! And the response payload looks something like this:

    {
        "_metadata" {
            "status"     : "200",
            "schema-href" : "/docs/api.schema.json",
            "created_at" : "1994-11-05T13:15:30Z",
            "updated_at" : "1994-11-05T13:15:30Z",
            "etag"       : "749093d334ebd05cf7f2b7dbfb7868605578db2c",
        },
        "_links": {"self": "..."}
    }

This time we got our patch in, and the server returned the new ETag. We also get the new _updated value, which eventually will allow us to perform subsequent conditional requests.

Concurrency control applies to all edition methods: PATCH (edit), PUT (replace), DELETE (delete).

## Conditional Requests

_Concept borrowed in whole or in part from [Eve](http://python-eve.org/)._

Each resource representation provides information on the last time it was updated (Last-Modified), along with an hash value computed on the representation itself (ETag). These headers allow clients to perform conditional requests, only retrieving new or modified data, by using the If-Modified-Since header:

    $ curl -H "If-Modified-Since: Wed, 05 Dec 2012 09:53:07 GMT" -i http://example.com/people
    HTTP/1.1 200 OK

or the If-None-Match header:

    $ curl -H "If-None-Match: 1234567890123456789012345678901234567890" -i http://example.com/people
    HTTP/1.1 200 OK

## Auditing and Diagnostic Support

In Http Requests:

* X-TRACE - (Optional) to enable and/or disable trace options for diagnostic purposes.
    * Trace options will be specified via a semi-colon separated list including:
        * enable-request-id - turns on request ids.
        * log-level=x - sets the log-level for the request as described.
* X-CLIENT-REQUEST-ID - (Optional) is a UID that can tie specific request(s) to server logs and other audit trails. Although this ID is chosen by the client it should be unique on the server in order to allow strict tracing to log records. Because of this we recommend that this ID be a composition of the X-USER-ID and a unique client specific ID. For example: {Session-Id}-{client-number} where client number is chosen by the client side or perhaps a simple UUID. Although this identifier is called a 'X-CLIENT-REQUEST-ID' it may span as many HTTP requests as the client desires.

In Http Responses:

* X-CLIENT-REQUEST-ID - (Required if present in the request) per above - returned by the server when a X-CLIENT-REQUEST-ID header is specified on the incoming request.
* X-REQUEST-ID - (Optional) is a GUID that may be generated on the server side to tie specific request(s) back to server logs and other audit trails. This is turned on if the X-TRACE option 'enable-request-id' appears in the request.
* X-TRACE - (Optional) per above - returns the trace options that were enabled for the associated request.

## Error handling

Error responses should include a common HTTP status code, message for the developer, message for the end-user (when appropriate), internal error code (corresponding to some specific internally determined ID), links where developers can find more info.

All of this information is provided using the [vnd.error](https://github.com/blongden/vnd.error) Media Type.  Specifically the API must support the json variant of the media type: 'application/vnd.error+json'

Errors json may include non-conflicting properties beyond what are specified in vnd.error. This is especially useful for common recoverable application specific errors.

##  Data Types with the payload

### Dates and Times should be Timezone independent.

In order to comply with ISO 8601 as recommended by W3C dates and times are expected to allow for timezone independence using [W3C's Date and Time Formats](http://www.w3.org/TR/NOTE-datetime):

    1994-11-05T08:15:30-05:00 corresponds to November 5, 1994, 8:15:30 am, US Eastern Standard Time.
    1994-11-05T13:15:30Z corresponds to the same instant.

## Bulk Inserts

_Concept borrowed in whole or in part from [Eve](http://python-eve.org/)._

A client may submit a single document for insertion:

    $ curl -d '{"firstname": "barack", "lastname": "obama"}' -H 'Content-Type: application/json' http://example.com/people
    HTTP/1.1 201 OK

In this case the response payload will just contain the relevant document metadata:

    {
        "_metadata" {
            "status"     : "200",
            "data-schema-uri" : "/schemas/api.schema.json#empty",
            "created_at" : "1994-11-05T13:15:30Z",
            "updated_at" : "1994-11-05T13:15:30Z",
            "etag"       : "749093d334ebd05cf7f2b7dbfb7868605578db2c",
        },
        "_links": {"self": {"href": "example.com/people/50ae43339fa12500024def5b", "title": "person"}}
    }

However, in order to reduce the number of requests, a client might also submit multiple documents with a single request. All it needs to do is enclose the documents in a JSON list:

    $ curl -d '[{"firstname": "barack", "lastname": "obama"}, {"firstname": "mitt", "lastname": "romney"}]' -H 'Content-Type: application/json' http://example.com/people
    HTTP/1.1 201 OK

The response will be a list itself, with the state of each document:

    [
        {
            "_metadata" {
                "status"     : "200",
                "data-schema-uri" : "/schemas/api.schema.json#empty",
                "created_at" : "1994-11-05T13:15:30Z",
                "updated_at" : "1994-11-05T13:15:30Z",
                "etag"       : "749093d334ebd05cf7f2b7dbfb7868605578db2c",
            },
            "_links": {"self": {"href": "example.com/people/50ae43339fa12500024def5b", "title": "barak obama"}}
        },
        {
            "_metadata" {
                "status"     : "200",
                "data-schema-uri" : "/schemas/api.schema.json#empty",
                "created_at" : "1994-11-05T13:15:30Z",
                "updated_at" : "1994-11-05T13:15:30Z",
                "etag"       : "62d356f623c7d9dc864ffa5facc47dced4ba6907d",
            },
            "_links": {"self": {"href": "example.com/people/50ae43339fa12500024def5e", "title": "mitt romney"}}
        }
    ]

## Request & Response Examples

### API Resources

  - [GET /magazines](#get-magazines)
  - [POST /magazines/[id]/articles](#post-magazinesidarticles)

### GET /magazines

Response body:

    {
        "data": [
            {
                "id": "22",
                "type": "Class"
                "description": "Newsweak",
                ...
            },
            {
                "id": "23",
                "type": "Class"
                "description": "People",
                ...
            }
            ...
        ],

          "_metadata": {
                "status"     : "200",
                "data-schema-uri" : "/schemas/api.schema.json#magazines_GET",
                "pagination" : {
                    "offset" : 0,
                    "page" : 3,
                    "size" : 25,
                    "total_pages" : 12,
                    "total_count" : 315
                },
                "messages" : {
                },
          },

          "_links": {
            "self": { "href": "/magazines/1?page=3&size=25" },
            "up": { "href": "/magazines" },
            "next": { "href": "/magazines/uid1?page=4" },
            "findById": { "href": "/magazines?id={id}", "templated": true },
            "findByName": { "href": "/magazines?name={name}", "templated": true },
            "byPage": { "href": "/magazines?page={page},size={size}", "templated": true },
            "byOffset": { "href": "/magazines?offset={offset},size={size}", "templated": true },
            "magazines" : [
                {
                    "href": "/magazines/{id}"
                },
                {
                    "title": "People",
                    "href": "/magazines/{id}"
                },
            ]
          },
    }

Here we demonstrate the use of the optional \_embedded section.  Note the relationship between the 'magazines' link actions and the magazine resources defined in the \_embedded section.  The client should check the \_embedded section for existence of the object before doing an HTTP fetch of the object.  This said the client should behave the same way without the embedded section - though it'll make more server requests without it.

### POST /magazines/[id]/articles

Example: Create – POST  http://example.gov/api/magazines/[id]/articles

Response body:

        {
            "articles": [
                {
                    "id" : 141,
                    "title": "Raising Revenue",
                    "author_first_name": "Jane",
                    "author_last_name": "Smith",
                    "author_email": "jane.smith@example.gov",
                    "year": "2012",
                    "month": "August",
                    "day": "18",
                    "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget ante ut augue scelerisque ornare. Aliquam tempus rhoncus quam vel luctus. Sed scelerisque fermentum fringilla. Suspendisse tincidunt nisl a metus feugiat vitae vestibulum enim vulputate. Quisque vehicula dictum elit, vitae cursus libero auctor sed. Vestibulum fermentum elementum nunc. Proin aliquam erat in turpis vehicula sit amet tristique lorem blandit. Nam augue est, bibendum et ultrices non, interdum in est. Quisque gravida orci lobortis... "
                },
                ...
            ],

          "_metadata" : {...},
          "_links": { "self": { "href": "/magazines/[id]/articles" } }

        }

## Testability

### Mock Responses

It is suggested that each resource accept a 'mock' parameter on the test/development servers. Passing this parameter should return a mock data response (bypassing the backend). Implementing this feature early in development ensures that the API will exhibit consistent behavior, supporting a test driven development methodology.

Note: If the mock parameter is included in a request to the production environment, an error should be raised.

### Clients use of HATEOAS - and future proof testing.

Clients are required to support the use of HATEOAS, should not use hard-coded links and should be tested to ensure that they are resilient to API changes on the server side. For this reason we recommend the server side offer a configuration option that switches paths for future-proof testing (e.g. by changing the overall path to resources) to ensure that clients are not hard-coding paths and constructing URIs.

There are HAL browsers available (use Google) that might be able to help with automated testing.

## Implementation recommendations and references.

### HATEOAS libraries

### node.js
On the server side you might be able to get started quickly with this nodejs project:
* [node-rest-boilerplate](https://github.com/darrin/node-rest-boilerplate)
    * This project has pulled together most of the technologies you'll need with the notable exception of HATEOAS.
* HATEOAS?

### java
In your using Java - consider the use of [Spring-HATEOAS](https://github.com/spring-projects/spring-hateoas) which can handle HAL as required and promises support for other hypermedia formats in the future.

### javascript
On the javascript/client side we recommend looking into [hyperagent](http://weluse.github.io/hyperagent) though there are others available.

## Performance Considerations

### Support for field level inclusion/exclusion

API implementers should be aware that use of field level inclusion/exclusion results in decreased cache performance of full HTTP responses in two possible ways:

1. query parameter differences at minimum result in double-storing objects even if they're the same.
2. inclusions/exclusions could change the response resource structure - in these cases two different object must be assembled.

If caching is desireable consider caching at the object model level.


## References

In no particular order.

* [Eve: Python REST API Framework](http://python-eve.org/)
* [Paypal's API](https://developer.paypal.com/docs/api/)
* [GitHub's V3 API](http://developer.github.com/v3/)
* [White House Web API Standards](https://github.com/WhiteHouse/api-standards)
* [HATEOAS](http://en.wikipedia.org/wiki/HATEOAS)
* [Github Media Type Properties](https://developer.github.com/v3/media/#comment-body-properties)
* [Best Practices for Designing a Pragmatic RESTful API](http://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api)
* [Custom HTTP headers : naming conventions](http://stackoverflow.com/questions/3561381/custom-http-headers-naming-conventions)
* [Why HATEOAS?](http://www.slideshare.net/trilancer/why-hateoas-1547275)
* [Wikipedia: HATEOAS](http://en.wikipedia.org/wiki/HATEOAS)
* [Spring Framework provides a nice abstraction to assist](http://spring.io/guides/gs/rest-hateoas)
* [Swagger UI](https://github.com/wordnik/swagger-ui)
* [Swagger](https://helloreverb.com/developers/swagger)
* [Swagger Spring Annotations](https://github.com/martypitt/swagger-springmvc).
* [HAL](http://tools.ietf.org/html/draft-kelly-json-hal)
