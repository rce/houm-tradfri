#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

repo="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

function init_node {
  export NVM_DIR="$repo/.nvm"
  source "$repo/nvm.sh"
  nvm install 8.11.3
}

init_node

cd "$repo"
npm "$@"
