#!/bin/sh

set -e

tag=bottlenose-9396c507

fetch_scrypto() {
  if [ ! -d radixdlt-scrypto ] ; then
    mkdir radixdlt-scrypto
    pushd radixdlt-scrypto
    git init
    git remote add origin https://github.com/radixdlt/radixdlt-scrypto.git
    git fetch --depth 1 origin $tag
    git checkout FETCH_HEAD
    popd
  fi
}

build_scrypto() {
  cargo build --manifest-path radixdlt-scrypto/radix-clis/Cargo.toml
}

build_examples() {
  scrypto="cargo run --manifest-path radixdlt-scrypto/radix-clis/Cargo.toml --bin scrypto $@ --"

  # Get Cargo.toml for each example (those with [package] marker).
  # Exclude:
  # - radixdlt-scrypto
  # - examples, which won't buiild by design
  find . \( \
      -path './radixdlt-scrypto' -o \
      -path './step-by-step/18-candy-store-external-component/2-candy-store' \
    \) -prune \
    -o -name Cargo.toml -print | xargs grep -l '\[package]' | while read path ; do

    echo "Building $(dirname $path)"
    $scrypto build --path $path
    cargo clean --manifest-path $path
  done
}

fetch_scrypto

build_scrypto

build_examples
