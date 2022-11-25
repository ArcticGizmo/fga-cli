A simple OpenFGA cli tool to help init and manage OpenFGA container instances for local development

## Installation
I have not had time to validate, test and upload this to npm, so you can install this directly from github via
```
npm install -g ArcticGizmo/fga-cli
```

## Quick Start
(you will need docker installed for this)
```
fga-cli init all && fga-cli start -d && fga-cli state set fga.state.json
```
open the playground dashboard from http://localhost:3000/playground. When you are done, you can stop your instance via
```
fga-cli stop
```

## Components
The cli provides the ability to configure `connnection`, `store`, `model`, `tuples` and `state`, as well as start and stop a docker instance (great for local development)

### Start Container
You can start an OpenFGA container via the cli
```
fga-cli start
```

once it is started, you can navigate to localhost:3000/playground to use the UI. To stop the container, just abort the process (ctrl+c)

#### Detached Container
If you would like to run the instance in the background (great for chaining commands)
```
fga-cli start -d
```
And then to stop the instance
```
fga-cli stop
```

#### Authenticated
The CLI currently only supports preshared keys, if you would like to use any other authentication method you will have to spin up the docker instance manually ([docs](https://openfga.dev/docs/getting-started/setup-openfga#configuring-the-server)). To add preshared keys
```
fga-cli start --preshared-keys {key1} {key2}
```

## Setup

### Generate Configuration
To help use the cli, there are a couple of files that can be auto-generated for you with example configuration
```
fga-cli init config --api-scheme {default: http} --api-host {default: localhost:8080} --preshared-key {optional}
fga-cli init model
fga-cli init tuples
fga-cli init state
fga-cli init all {same options as above}
```

### Store
```
fga-cli store create {store}   // create a new store
fga-cli store delete {store}   // delete store by name
fga-cli store delete-id {id}  // delete store by id
fga-cli store list            // list all available stores
```

### Model
To create a model, add the dsl representation of your model to a file. For example, in the file `fga.model.dsl`, add
```
type user
type file
  relations
    define can_read as owner or viewer
    define can_edit as owner
    define can_delete as owner
    define owner as self
    define viewer as self
```

then commit the model

```
fga-cli model create --store {store} --model fga.model.dsl
```

### Add tuples (Direct)
```
fga-cli tuples add --store {store} -u {user} -r {relation} -o {object}
```

### Add Tuples (File)
Initialise a tuple file using
```
fga-cli init tuples
```
and then edit the `fga.tuples.json` file accordingly. Then commit via
```
fga-cli tuples add -f fga.tuples.json
```

### Check
Simple checks can be performed via
```
fga-cli check --store {store} {user} {relation} {object}
```
or with contextual tuples
```
fga-cli check --store {store} {user} {relation} {object} \
-c "{userA} {relationA} {objectA}" \
-c "{userB} {relationB} {objectA}"
```
NB: the quotes are important for contextual tuples


### Query
When making a query, the only required options are the <store> and <object> flags. Eg.
```
fga-cli query --store {store} -o {object} -u {user}
```

If the request has more options to show, you can include the continuation token `-t, --token <token>` in the next request


## Help
For a full list of commands, try
```fga-cli --help```
