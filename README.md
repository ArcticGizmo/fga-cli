# fga-cli
A simple OpenFGA cli tool to help init and manage OpenFGA container instances for local development

# Start Container
You can start an OpenFGA container via the cli
```fga-cli start```

once it is started, you can navigate to localhost:3000/playground to use the UI

# Setup

## Create store
```fga-cli store create {name}```

## Create model
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

```fga-cli model create --store {name} fga.model.dsl```

## Add tuples
You can add the tuples directly
```
```

or add a bunch to a file




# Help
For a full list of commands, try
```fga-cli --help```