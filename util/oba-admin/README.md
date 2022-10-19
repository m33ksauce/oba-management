oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g oba-admin
$ oba-admin COMMAND
running command...
$ oba-admin (--version)
oba-admin/0.0.0 darwin-arm64 node-v18.6.0
$ oba-admin --help [COMMAND]
USAGE
  $ oba-admin COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`oba-admin help [COMMAND]`](#oba-admin-help-command)
* [`oba-admin plugins`](#oba-admin-plugins)
* [`oba-admin plugins:install PLUGIN...`](#oba-admin-pluginsinstall-plugin)
* [`oba-admin plugins:inspect PLUGIN...`](#oba-admin-pluginsinspect-plugin)
* [`oba-admin plugins:install PLUGIN...`](#oba-admin-pluginsinstall-plugin-1)
* [`oba-admin plugins:link PLUGIN`](#oba-admin-pluginslink-plugin)
* [`oba-admin plugins:uninstall PLUGIN...`](#oba-admin-pluginsuninstall-plugin)
* [`oba-admin plugins:uninstall PLUGIN...`](#oba-admin-pluginsuninstall-plugin-1)
* [`oba-admin plugins:uninstall PLUGIN...`](#oba-admin-pluginsuninstall-plugin-2)
* [`oba-admin plugins update`](#oba-admin-plugins-update)
* [`oba-admin publish-media [FILEID]`](#oba-admin-publish-media-fileid)
* [`oba-admin publish-metadata FILE`](#oba-admin-publish-metadata-file)

## `oba-admin help [COMMAND]`

Display help for oba-admin.

```
USAGE
  $ oba-admin help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for oba-admin.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.15/src/commands/help.ts)_

## `oba-admin plugins`

List installed plugins.

```
USAGE
  $ oba-admin plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ oba-admin plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.4/src/commands/plugins/index.ts)_

## `oba-admin plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ oba-admin plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ oba-admin plugins add

EXAMPLES
  $ oba-admin plugins:install myplugin 

  $ oba-admin plugins:install https://github.com/someuser/someplugin

  $ oba-admin plugins:install someuser/someplugin
```

## `oba-admin plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ oba-admin plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ oba-admin plugins:inspect myplugin
```

## `oba-admin plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ oba-admin plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ oba-admin plugins add

EXAMPLES
  $ oba-admin plugins:install myplugin 

  $ oba-admin plugins:install https://github.com/someuser/someplugin

  $ oba-admin plugins:install someuser/someplugin
```

## `oba-admin plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ oba-admin plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ oba-admin plugins:link myplugin
```

## `oba-admin plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ oba-admin plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ oba-admin plugins unlink
  $ oba-admin plugins remove
```

## `oba-admin plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ oba-admin plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ oba-admin plugins unlink
  $ oba-admin plugins remove
```

## `oba-admin plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ oba-admin plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ oba-admin plugins unlink
  $ oba-admin plugins remove
```

## `oba-admin plugins update`

Update installed plugins.

```
USAGE
  $ oba-admin plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

## `oba-admin publish-media [FILEID]`

Send metadata to prod

```
USAGE
  $ oba-admin publish-media [FILEID] -f <value>

ARGUMENTS
  FILEID  File ID to use

FLAGS
  -f, --file=<value>  (required) File to upload

DESCRIPTION
  Send metadata to prod

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/publish-media/index.ts](https://github.com/m33ksauce/oba-admin/blob/v0.0.0/dist/commands/publish-media/index.ts)_

## `oba-admin publish-metadata FILE`

Send metadata to prod

```
USAGE
  $ oba-admin publish-metadata [FILE] --useFirebase --useAws [--includeAudio]

ARGUMENTS
  FILE  Metadata file to upload

FLAGS
  --includeAudio  Include Audio?
  --useAws        (required) Uses AWS for storage
  --useFirebase   (required) Uses firebase for storage

DESCRIPTION
  Send metadata to prod

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/publish-metadata/index.ts](https://github.com/m33ksauce/oba-admin/blob/v0.0.0/dist/commands/publish-metadata/index.ts)_
<!-- commandsstop -->
