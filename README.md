# Sails-JSON-API-Blueprints

[![NPM version](https://badge.fury.io/js/sails-json-api-blueprints.svg)](http://badge.fury.io/js/sails-json-api-blueprints) &nbsp; [![Build Status](https://travis-ci.org/dynamiccast/sails-json-api-blueprints.svg?branch=master)](https://travis-ci.org/dynamiccast/sails-json-api-blueprints)

Sails hook to automatically turn a Sails.js API into a [JSON API](http://jsonapi.org/) compatible interface.

### This hook is still in intense development. See the *Roadmap* section for more information on what is yet to be implemented

While this module will provide your API with a generic implementation of JSON API, it was primarily intented to ease the communication between Sails.js and Ember.js. Ember works by default with JSON API. Here is a demonstration of *sails-json-api-blueprints* working with an Ember application : https://github.com/dynamiccast/sails-ember-super-rentals-example

# Install

Being a sails hook. There is not much thing to do to make your sails app JSON API compatible. all you have to do is install this node module.

````
npm install --save sails-json-api-blueprints
````

Please note the following :
- Default policies (`'*': 'somePolicy'`) will not work by default for update requests. See *Usage:Policies are not applied on custom actions for updates (PATCH method)* for details on how to fix it.
- Being a set of blueprints this only works if `sails.config.blueprints.rest` is set to true (is it by default)
- `sails.config.blueprints.pluralize` will be set to true to match the JSON API specification
- Default responses will be overridden to respond with valid JSON API errors
- `autoCreatedAt` and `autoUpdatedAt` will not work. See #25 for more information

# Usage

With the hook being installed, all your auto generated controller actions will be JSON API compliant.
This module also injects a service available as `JsonApiService` in your controllers to help you deal with JSON API.

## Serialize data

`res.ok()` and `res.created()` will handle JSON API serialization for you. Simply call them as usual when you are done with your custom action.

As shown in [tests/dummy/api/controllers/UserController.js:14](https://github.com/dynamiccast/sails-json-api-blueprints/blob/master/tests/dummy/api/controllers/UserController.js#L14), `JsonApiService.serialize` also allows to serialize any waterline data into a JSON API compliant format. Just call :

````
JsonApiService(modelName, DataObject);
````

## Call blueprints from custom action

As shown in [tests/dummy/api/controllers/UserController.js:24](https://github.com/dynamiccast/sails-json-api-blueprints/blob/master/tests/dummy/api/controllers/UserController.js#L24), `JsonApiService` proxies blueprints to be accessible from any controller. Simply call the following with `req` and `res` as parameter:

- `findRecords` GET /{model}
- `findOneRecord` GET /{model}/{id}
- `createRecord` POST /{model}
- `destroyOneRecord` DELETE /{model}
- `updateOneRecord` PATCH /{model}/{id}

## Policies are not applied on custom actions for updates (PATCH method)

By default, due to the fact updates are handled with PUT methods and not PATCH methods in sails,

To fix this, first we create a new route in `config/routes.js` for each model to be patched; replace <model1> with the model name:

````
'PATCH /api/<model1>/:id': '<Model1>Controller.update',
````

Then we must add PATCH to the list of methods in `config/cors.js`:

````
  methods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH',
````

This way you are guaranteed incoming requests go through default policies before being redirected to the update blueprint.

## Data validation

This module is compatible with default Sails.js waterline validations and *sails-hook-validation*. It will produce a JSON API error compliant object.

When a validation error object is returned by Waterline, you can reject the request with `res.invalid(err)` where `err` is your response object.
`res.negociate(err)` will also forward the request to the `invalid` response as expected.

## Customize serialized JSON models' attributes keys case

While JSON API recommends multiple words variable to use a '-' as separator (http://jsonapi.org/recommendations/#naming) *sails-json-api-blueprints* remains open to `kebab-case` (the preferred), `snake_case`, `camelCase` or simply no change at all during serialization.

In a `config/jsonapi.js`, add the following key to customize behavior:

````
attributesSerializedCase: 'kebab-case', // Default is undefined, a.k.a no tranformation during serialization
````

This will output JSON with attributes keys formatted in 'kebab-case'.

## Have a different sails models' attributes keys case than JSON payload

Sails Model attributes keys can follow a different naming convention than the JSON payload. In this case, *sails-json-api-blueprints* should be aware of that when deserializing data.

In a `config/jsonapi.js`, add the following key to customize behavior:

````
attributesDeserializedCase: 'camelCase', // Default is undefined, a.k.a no tranformation during serialization
````

This will expect sails Model attributes keys to follow the camelCase naming convention.

# Roadmap

- JSON API implementation
  - [X] GET all resources
  - [X] POST resource
  - [X] DELETE resource
  - [X] PATCH resource
  - [X] Return proper error if any
  - Relationships
    - [X] One to one
    - [ ] One way associations
    - [ ] Many to many
    - [ ] One to many
    - [X] Through relationships
  - [ ] Fields
  - [ ] Sorting
  - [ ] Pagination
  - [ ] Filtering
- Sails integration
  - [X] Allow the use of auto CreatedAt and UpdatedAt (see #3)
  - [ ] Allow the use of custom CreatedAt and UpdatedAt values (see #25)
  - [ ] Pubsub integration
  - [X] Provide a service to serialize as JSON API for custom endpoints
  - [X] Compatible with waterline data validation
- Repository
  - [X] Add tests on travis
  - [X] Provide status on the build on Github

# Tests

Simply run `npm test`

Tests expect the database to be empty. Local disk is used in the dummy app and can be deleted with `rm tests/dummy/.tmp/localDiskDb.db`.

# Thanks

This work is greatly inspired from https://github.com/mphasize/sails-generate-ember-blueprints
@mphasize did no longer actively maintain this repositiory, so I decided to fork it and to focus on JSON API compatibility.
