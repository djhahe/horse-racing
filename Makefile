PINNED_TOOLCHAIN := $(shell cat rust-toolchain)
VERSION := $(shell cat rust-version)

prepare:
	cd contracts && rustup default ${PINNED_TOOLCHAIN}-x86_64-unknown-linux-gnu
	cd contracts && rustup target add wasm32-unknown-unknown
	cd contracts && rustup component add clippy --toolchain ${PINNED_TOOLCHAIN}
	cd contracts && rustup component add rustfmt --toolchain ${PINNED_TOOLCHAIN}

clippy:
	cd contracts && cargo clippy --all-targets -- -D warnings

check-lint: clippy
	cd contracts && cargo fmt -- --check

lint: clippy
	cd contracts && cargo fmt

clean:
	cd contracts && cargo clean

build-contracts:
	cd contracts && cargo build --release --workspace --exclude tests --target wasm32-unknown-unknown
	mkdir -p res/contracts/archive/${VERSION}

	wasm-strip contracts/target/wasm32-unknown-unknown/release/horse-racing.wasm
	cp contracts/target/wasm32-unknown-unknown/release/horse-racing.wasm res/contracts/horse-racing-${VERSION}.wasm
	cp res/contracts/horse-racing-${VERSION}.wasm res/contracts/archive/${VERSION}/horse-racing-${VERSION}.wasm

	wasm-strip contracts/target/wasm32-unknown-unknown/release/horse-racing-play.wasm
	cp contracts/target/wasm32-unknown-unknown/release/horse-racing-play.wasm res/contracts/horse-racing-play-${VERSION}.wasm
	cp res/contracts/horse-racing-play-${VERSION}.wasm res/contracts/archive/${VERSION}/horse-racing-play-${VERSION}.wasm

	wasm-strip contracts/target/wasm32-unknown-unknown/release/horse-racing-topup.wasm
	cp contracts/target/wasm32-unknown-unknown/release/horse-racing-topup.wasm res/contracts/horse-racing-topup-${VERSION}.wasm
	cp res/contracts/horse-racing-topup-${VERSION}.wasm res/contracts/archive/${VERSION}/horse-racing-topup-${VERSION}.wasm

# Alias
build-contract: build-contracs
buildcontract: build-contracts
buildcontracts: build-contracts
