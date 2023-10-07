use core::ops::{Add, Sub};

use alloc::vec::Vec;
use casper_contract::{contract_api::runtime, unwrap_or_revert::UnwrapOrRevert};
use casper_types::{account::AccountHash, KeyTag, Tagged, URef, U256, U512};

use crate::{constants, errors::Error, utils};

#[derive(PartialEq)]
pub enum PermissionTypes {
    Deployer,
    Admin,
}

pub enum UpdatePurposeMode {
    Add,
    Remove,
    Set,
}

pub(crate) fn get_deployer_account() -> AccountHash {
    utils::get_storage(constants::STORAGE_DEPLOYER)
}

pub(crate) fn set_admins(value: Vec<AccountHash>) {
    utils::write_storage(constants::STORAGE_ADMINS, value);
}

pub(crate) fn get_admins() -> Vec<AccountHash> {
    utils::get_storage(constants::STORAGE_ADMINS)
}

pub(crate) fn get_next_race_config_id() -> U256 {
    let id: U256 = utils::get_storage(constants::STORAGE_RACE_CONFIG_COUNTER);
    let next_id = id + 1;

    // Write back to storage
    utils::write_storage(constants::STORAGE_RACE_CONFIG_COUNTER, next_id);

    next_id
}

pub(crate) fn get_purse() -> URef {
    runtime::get_key(constants::STORAGE_PURSE)
        .unwrap_or_revert()
        .into_uref()
        .unwrap_or_revert()
}

pub(crate) fn update_purse_info(key: &str, amount: U512, mode: UpdatePurposeMode) {
    match mode {
        UpdatePurposeMode::Add => {
            let value: U512 = utils::get_storage(key);
            utils::write_storage(key, value.add(amount));
        }
        UpdatePurposeMode::Remove => {
            let value: U512 = utils::get_storage(key);
            utils::write_storage(key, value.sub(amount));
        }
        UpdatePurposeMode::Set => {
            utils::write_storage(key, amount);
        }
    };
}

pub(crate) fn require(permissions: PermissionTypes) {
    let caller = utils::get_caller();
    match caller.tag() {
        KeyTag::Account => {
            let caller_account = runtime::get_caller();
            let deployer_account = get_deployer_account();
            if deployer_account == caller_account {
                return;
            }
            if PermissionTypes::Deployer == permissions {
                runtime::revert(Error::MissingDeployerRight)
            }
            let accounts = get_admins();
            if accounts.contains(&caller_account) {
                return;
            }
            if PermissionTypes::Admin == permissions {
                runtime::revert(Error::MissingAdminRights)
            }
            runtime::revert(Error::PermissionDenied)
        }
        _ => runtime::revert(Error::PermissionDenied),
    }
}
