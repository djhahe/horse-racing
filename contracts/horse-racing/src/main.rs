#![no_std]
#![no_main]

#[cfg(not(target_arch = "wasm32"))]
compile_error!("target arch should be wasm32: compile with '--target wasm32-unknown-unknown'");

// Explicitly import the std alloc crate and `alloc::string::String` as we're in a `no_std` environment.
extern crate alloc;

use alloc::boxed::Box;
use alloc::string::{String, ToString};
use alloc::vec::Vec;
use alloc::{format, vec};

use casper_contract::contract_api::{runtime, storage, system};
use casper_contract::unwrap_or_revert::UnwrapOrRevert;
use casper_types::{account::AccountHash, EntryPoints};
use casper_types::{contracts::NamedKeys, U256};
use casper_types::{
    runtime_args, CLType, CLTyped, ContractHash, EntryPoint, EntryPointAccess, EntryPointType,
    Parameter, RuntimeArgs, U512,
};

use errors::Error;

mod admin;
mod constants;
mod controllers;
mod data;
mod errors;
mod engine;
mod utils;

fn install_contract_specific(contract_hash: ContractHash) {
    // runtime::put_key("__debug__", storage::new_uref("").into());

    let name: String = runtime::get_named_arg(constants::ARG_NAME);
    let admins: Vec<AccountHash> = runtime::get_named_arg(constants::ARG_ADMINS);

    // Call contract to initialize
    runtime::call_contract::<()>(
        contract_hash,
        "init",
        runtime_args! {
            constants::ARG_NAME => name,
            constants::ARG_ADMINS => admins
        },
    );
}

fn init_contract_specific() {
    let admins: Vec<AccountHash> = runtime::get_named_arg(constants::ARG_ADMINS);
    runtime::put_key(constants::STORAGE_ADMINS, storage::new_uref(admins).into());

    // Define the default purse to transfer credits
    runtime::put_key(constants::STORAGE_PURSE, system::create_purse().into());
    runtime::put_key(
        constants::STORAGE_PURSE_BALANCE,
        storage::new_uref(U512::zero()).into(),
    );

    // Initialize tokens pull
    _ = storage::new_dictionary(constants::STORAGE_RACES_CONFIG).unwrap_or_revert();
    _ = storage::new_dictionary(constants::STORAGE_RACES_COUNTER).unwrap_or_revert();
    _ = storage::new_dictionary(constants::STORAGE_RACES).unwrap_or_revert();
    _ = storage::new_dictionary(constants::STORAGE_USER_RACES).unwrap_or_revert();

    // Initialize storage of contracts
    runtime::put_key(
        constants::STORAGE_RACE_CONFIG_COUNTER,
        storage::new_uref(U256::zero()).into(),
    );
}

fn upgrade_contract_specific() {}

#[no_mangle]
pub extern "C" fn call() {
    let id: String = runtime::get_named_arg(constants::ARG_ID);
    match runtime::get_key(&id) {
        None => {
            install_contract(id);
        }
        Some(_contract_key) => {
            upgrade_contract(id);
        }
    }
}

fn install_contract(id: String) {
    let mut entry_points = EntryPoints::new();
    controllers::load(&mut entry_points);

    entry_points.add_entry_point(EntryPoint::new(
        String::from("init"),
        vec![
            Parameter::new(constants::ARG_NAME, CLType::String),
            Parameter::new(
                constants::ARG_ADMINS,
                CLType::List(Box::new(CLType::ByteArray(32u32))),
            ),
        ],
        <()>::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));

    // Named keys
    let mut named_keys = NamedKeys::new();
    named_keys.insert(
        constants::STORAGE_DEPLOYER.to_string(),
        storage::new_uref(runtime::get_caller()).into(),
    );

    // Initialize the contract
    let (contract_hash, contract_version) = storage::new_contract(
        entry_points,
        Some(named_keys),
        Some(format!("{id}_pkg")),
        Some(format!("{id}_access_url")),
    );

    runtime::put_key(&id, contract_hash.into());
    runtime::put_key(
        &format!("{id}_version"),
        storage::new_uref(contract_version).into(),
    );

    install_contract_specific(contract_hash);
}

fn upgrade_contract(id: String) {
    let mut entry_points = EntryPoints::new();
    controllers::load(&mut entry_points);

    let contract_package_hash = runtime::get_key(&format!("{id}_pkg"))
        .unwrap_or_revert()
        .into_hash()
        .unwrap()
        .into();

    let (contract_hash, contract_version) =
        storage::add_contract_version(contract_package_hash, entry_points, NamedKeys::default());

    // Update contract hash and version
    runtime::put_key(&id, contract_hash.into());
    runtime::put_key(
        &format!("{id}_version"),
        storage::new_uref(contract_version).into(),
    );

    upgrade_contract_specific();
}

#[no_mangle]
pub extern "C" fn init() {
    // Allows to init once
    // Check and set a name to contract
    let name = runtime::get_key(constants::STORAGE_NAME);
    if name.is_some() {
        runtime::revert(Error::AlreadyInitialized);
    } else {
        let name: String = runtime::get_named_arg(constants::ARG_NAME);
        if name.is_empty() {
            runtime::revert(Error::InvalidArgument0);
        }
        runtime::put_key(constants::ARG_NAME, storage::new_uref(name).into());
    }

    init_contract_specific();
}
