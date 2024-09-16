# EUDI Wallet Provider Backend (WP)

This repository contains the code to implement the wallet provider backend (WP), see [section 4.2 of EUDIW Architecture and Reference Framework](https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework/blob/v1.4.1/docs/arf.md#42-reference-architecture).

## Requirements

This project requires specific versions of the following tools. To make sure your development setup matches with production follow the recommended installation methods.

- **Node.js**

  Use [nodenv](https://github.com/nodenv/nodenv) to install the [required version](.node-version) of `Node.js`.

  ```sh
  nodenv install
  node --version
  ```

- **Yarn**

  Yarn must be installed using [Corepack](https://yarnpkg.com/getting-started/install), included by default in `Node.js`.

  ```sh
  corepack enable
  yarn --version
  ```

- **Terraform**

  Use [tfenv](https://github.com/tfutils/tfenv) to install the [required version](.terraform-version) of `terraform`.

  ```sh
  tfenv install
  terraform version
  ```

- **pre-commit**

  [Follow the official documentation](https://pre-commit.com/) to install `pre-commit` in your machine.

  ```sh
  pre-commit install
  ```

## Tasks

Tasks are defined in the `turbo.json` and `package.json` files. To execute a task, just run the command at the project root:

```sh
yarn <cmd>
```

`Turborepo` will execute the task for all the workspaces that declare the same command in their `package.json` file; it also applies caching policies to the command according to the rules defined in `turbo.json`.

To define a new task:

- add the definition to `turbo.json` under `pipeline`;
- add a script with the same name in `package.json` as `turbo <cmd name>`.

Defined tasks are _lint_, _test_, and _typecheck_.

## Dependencies

> [!IMPORTANT]  
> This project uses Yarn Plug'n'Play as installation strategy for dependencies. [Check out](https://yarnpkg.com/features/pnp) the official Yarn documentation to lean about pnp and its difference from the classic `node_modules` approach.

```sh
# install all dependencies for the project
yarn

# install a dependency to a workspace
#   (workspace name is the name in the package.json file)
yarn workspace <workspace name> add <package name>
yarn workspace <workspace name> add -D <package name>

# install a dependency for the monorepo
#   (ideally a shared dev dependency)
yarn add -D <package name>
```

To add a dependency to a local workspace, manually edit the target workspace's `package.json` file adding the dependency as

```json
"dependencies": {
    "my-dependency-workspace": "workspace:*"
}
```

### Yarn SDKS (.yarn/sdks)

Smart IDEs (such as VSCode or IntelliJ) require special configuration for TypeScript to work when using Plug'n'Play installs. That configuration is generated automatically by `yarn` (via `yarn dlx @yarnpkg/sdks vscode vim [other-editor...]`) and commited to `.yarn/sdks`.

## Folder structure

### `/apps`

It contains the applications included in the project.
Each folder is meant to produce a deployable artifact; how and where to deploy it is demanded to a single application.

Each sub-folder is a workspace.

### `/packages`

Packages are reusable TypeScript modules that implement a specific logic of the project. They are meant for sharing implementations across other apps and packages of the same projects, as well as being published in public registries.

Packages that are meant for internal code sharing have `private: true` in their `package.json` file; all the others are meant to be published into the public registry.

Each sub-folder is a workspace.

### `/infra`

It contains the _infrastructure-as-code_ project that defines the resources for the project as well as the executuion environments. Database schemas and migrations are defined here too, in case they are needed.

### `/docs`

Technical documentation about the project. Topics that may be included are architecture overviews, [ADRs](https://adr.github.io/), coding standards, and anything that can be relevant for a developer approaching the project as a contributor or as an auditor.

User documentation doesn't usually go in here. For public packages, it must go in the package's `README` file so that it will also be uploaded to the registry; user-faced documentation websites, when needed by the project, go under the `/apps` folder as they are treated as end-user applications.

## Releases

Releases are handled using [Changeset](https://github.com/changesets/changesets).
Changeset takes care of bumping packages, updating the changelog, and tag the repository accordingly.

#### How it works

- When opening a Pull Request with a change intended to be published, [add a changeset file](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md) to the proposed changes.
- Once the Pull Request is merged, a new Pull Request named `Version Packages` will be automatically opened with all the release changes such as version bumping for each involved app or package and changelog update; if an open `Version Packages` PR already exists, it will be updated and the package versions calculated accordingly (see https://github.com/changesets/changesets/blob/main/docs/decisions.md#how-changesets-are-combined).
  Only apps and packages mentioned in the changeset files will be bumped.
- Review the `Version Packages` PR and merge it when ready. Changeset files will be deleted.
- A Release entry is created for each app or package whose version has been bumped.

## Infrastructure as Code

### Folder structure

The IaC template contains the following projects:

#### identity

Handle the identity federation between GitHub and Azure. The identity defines the grants the GitHub Workflows have on the Azure subscription.
Configurations are intended for the pair (environment, region); each configuration is a Terraform project in the folder `infra/identity/<env>/<region>`
It's intended to be executed once on a local machine at project initialization.

⚠️ The following edits have to be done to work on the repository:

- Define the project in the right env/region folder.
- Edit `locals.tf` according to the intended configuration.
- Edit `main.tf` with the actual Terraform state file location and name.

```sh
# Substitute env and region with actual values
cd infra/identity/<env>/<region>

# Substitute subscription_name with the actual subscription name
az account set --name <subscription_name>

terraform init
terraform plan
terraform apply
```

#### repository

Set up the current repository settings.
It's intended to be executed once on a local machine at project initialization.

⚠️ The following edits have to be done to work on the repository:

- Edit `locals.tf` according to the intended configuration.
- Edit `main.tf` with the actual Terraform state file location and name.

```sh
cd infra/repository

# Substitute subscription_name with the actual subscription name
az account set --name <subscription_name>

terraform init
terraform plan
terraform apply
```

#### resources

Contains the actual resources for the developed applications.
Configurations are intended for the pair (environment, region); each configuration is a Terraform project in the folder `infra/resources/<env>/<region>`

⚠️ The following edits have to be done to work on the repository:

- Edit `locals.tf` according to the intended configuration.
- Edit `main.tf` with the actual Terraform state file location and name.

### Workflow automation

The workflow `pr_infra.yaml` is executed on every PR that edits the `infra/resources` folder or the workflow definition itself. It executes a `terraform plan` and comments the PR with the result. If the plan fails, the workflow fails.
