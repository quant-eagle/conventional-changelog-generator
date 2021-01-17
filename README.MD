[![version](https://img.shields.io/badge/version-1.0.6-yellow.svg)](https://semver.org)

### :pencil2: :page_with_curl: Conventional Commit Changelog Generator (GitHub Action)

Automatically generate the changelog based on your commit convention for your latest tagged version with [Changelog Generator](https://github.com/Helmisek/conventional-changelog-generator).

The changelog is accessible as action output available to other actions via [output](#outputs).

## Example usage

```yaml
uses: Helmisek/conventional-changelog-generator@v1.0.6
with:
  token: ${{ secrets.GITHUB_TOKEN }}
```

## Inputs

| Name            | Description                          | Required | Example                       |
| --------------- | ------------------------------------ | -------- | ----------------------------- |
| `commit-types`  | Commit -> changelog mapping          | Yes      | `feat:Features,bug:Bug Fixes` |
| `current-tag`   | Currently selected tag               | No       | `v1.0.0+1-internal`           |
| `template-path` | Path to a custom template to use     | No       | `CHANGELOG.tpl.md`            |
| `tag-regex`     | A custom regex to filter versions by | No       | `internal`                    |

## Outputs

| Name        | Description                       |
| ----------- | --------------------------------- |
| `changelog` | Contents of generated change log. |

## Modifications

If you want to use your own custom template, just copy the `CHANGELOG.tpl.md` into your project, modify it and
add the file path to the action configuration.
