# Sails-JSON-API-Blueprints

[![NPM version](https://badge.fury.io/js/sails-json-api-blueprints.svg)](http://badge.fury.io/js/sails-json-api-blueprints) &nbsp;  [![Build Status](https://travis-ci.org/dynamiccast/sails-json-api-blueprints.svg)](https://travis-ci.org/dynamiccast/sails-json-api-blueprints)

Sails hook to automatically turn a Sails.js API into a [JSON API](http://jsonapi.org/) compatible interface.

### This hook is still in intense development. See the *Roadmap* section for more information on what is yet to be implemented

While this module will provide your API with a generic implementation of JSON API, it was primarily intented to ease the communication between Sails.js and Ember.js. Ember works by default with JSON API. Here is a demonstration of *sails-json-api-blueprints* working with an Ember application : https://github.com/dynamiccast/sails-ember-super-rentals-example

# Install

Being a sails hook. There is not much thing to do to make your sails app JSON API compatible. all you have to do is install this node module.

````
npm install --save sails-json-api-blueprints
````

Please note the following :
- Being a set of blueprints this only works if `sails.config.blueprints.rest` is set to true (is it by default)
- `sails.config.blueprints.pluralize` will be set to true to match the JSON API specification
- Default responses will be overridden to respond with valid JSON API errors

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

# Roadmap

- JSON API implementation
  - [X] GET all resources
  - [X] POST resource
  - [X] DELETE resource
  - [X] PATCH resource
  - [X] Return proper error if any
  - [ ] Relationships
  - [ ] Compound Document
  - [ ] Links
  - [ ] Fields
  - [ ] Sorting
  - [ ] Pagination
  - [ ] Filtering
- Sails integration
  - [X] Allow the use of auto CreatedAt and UpdatedAt (see #3)
  - [ ] Pubsub integration
  - [X] Provide a service to serialize as JSON API for custom endpoints
  - [ ] Compatible with waterline data validation
- Repository
  - [X] Add tests on travis
  - [X] Provide status on the build on Github

# Tests

Simply run `npm test`

Tests expect the database to be empty. Local disk is used in the dummy app and can be deleted with `rm tests/dummy/.tmp/localDiskDb.db`.

# Thanks

This work is greatly inspired from https://github.com/mphasize/sails-generate-ember-blueprints
@mphasize did no longer actively maintain this repositiory, so I decided to fork it and to focus on JSON API compatibility.
