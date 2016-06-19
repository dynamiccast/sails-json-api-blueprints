# Sails-JSON-API-Blueprints

Sails hook to automatically turn a Sails.js API into a [JSON API](http://jsonapi.org/) compatible interface.

### This hook is still in intense development. See the *Roadmap* section for more information on what is yet to be implemented

# Install

Being a sails hook. There is not much thing to do to make your sails app JSON API compatible. all you have to do is install this node module.

````
npm install --save sails-json-api-blueprints
````

Please note the following :
- Being a set of blueprints this only works if `sails.config.blueprints.rest` is set to true (is it by default)
- `sails.config.blueprints.pluralize` will be set to true to match the JSON API specification
- Auto `createdAt` and `UpdatedAt` fields will be disable. These are not JSON API compliant because of their camel case name. See [open issue](https://github.com/dynamiccast/sails-json-api-blueprints/issues/3).

# Roadmap

- JSON API implementation
  - [X] GET all resources
  - [X] POST resource
  - [X] DELETE resource
  - [X] PATCH resource
  - [ ] Return proper error if any
  - [ ] Relationships
  - [ ] Compound Document
  - [ ] Links
  - [ ] Fields
  - [ ] Sorting
  - [ ] Pagination
  - [ ] Filtering
- Sails integration
  - [ ] Allow the use of auto CreatedAt and UpdatedAt (see #3)
  - [ ] Pubsub integration
  - [ ] Provide a service to serialize as JSON API for custom endpoints
- Repository
  - [ ] Add tests on travis
  - [ ] Provide status on the build on Github

# Tests

Simply run `npm test`

# Thanks

This work is greatly inspired from https://github.com/mphasize/sails-generate-ember-blueprints
@mphasize did no longer actively maintain this repositiory, so I decided to fork it and to focus on JSON API compatibility.
