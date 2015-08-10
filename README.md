# Hiof Queuesystem package

## About

A package with the required files for the it-services views.

## Copyright

This project is distributed under a GNU General Public License v3 - Take a look at the COPYING file for details.

## Install

Install [Git](http://git-scm.com) if it's not already installed on your computer. Then run (this will download this project to the folder the shell has open):

```
$ git clone https://github.com/hiof/itservices-view.git
```

Install [io.js](https://iojs.org) (or [Node.js](http://nodejs.org)) if it's not already installed on your computer. Then run (this will install the project dependencies):

```
$ sudo npm install -g grunt-cli
$ npm install
$ bower install
```

You then have to build the odomoter plugin(require Ruby and rubygems):

```
$ cd vendor/odometer
$ npm install
$ gem install compass
$ grunt
```

## Build

`$ grunt build`: Compiles and builds the Queuesystem package

## Deploy

1. Rename secret-template.json to secret.json and add your credentials.
2. Deploy and test your code on the staging server `$ grunt deploy-staging`
3. Deploy to production `$ grunt deploy-www`

## Releases

[Github releases](https://github.com/hiof/queuesystem/releases)

### Roadmap

v1.0.0 - Initial Queuesystem
