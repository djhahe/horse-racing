use alloc::boxed::Box;

use alloc::string::String;
use alloc::vec;
use alloc::vec::Vec;
use casper_contract::contract_api::system;
use casper_contract::{contract_api::runtime, unwrap_or_revert::UnwrapOrRevert};
use casper_types::account::AccountHash;
use casper_types::{
    CLType, CLTyped, CLValue, EntryPoint, EntryPointAccess, EntryPointType,
    EntryPoints, Parameter, U512, U256,
};

use crate::admin::PermissionTypes;
use crate::data::RaceConfig;
use crate::{admin, constants, engine, utils};

#[no_mangle]
pub extern "C" fn set_admins() {
    admin::require(PermissionTypes::Deployer);

    let accounts: Vec<AccountHash> = runtime::get_named_arg(constants::ARG_ADMINS);
    admin::set_admins(accounts);
}

#[no_mangle]
pub extern "C" fn register_race_config() {
    admin::require(PermissionTypes::Admin);

    let name: String = runtime::get_named_arg(constants::ARG_NAME);
    let racers: u32 = runtime::get_named_arg(constants::ARG_RACERS);
    let fee_percent: u32 = runtime::get_named_arg(constants::ARG_FEE_PERCENT);
    let min_bet: U512 = runtime::get_named_arg(constants::ARG_MIN_BET);
    let max_bet: U512 = runtime::get_named_arg(constants::ARG_MAX_BET);

    engine::register_race_config(
        RaceConfig {
            name,
            racers,
            fee_percent,
            min_bet,
            max_bet,
        },
    );
}

#[no_mangle]
pub extern "C" fn quick_play() {
    let id: U256 = runtime::get_named_arg(constants::ARG_ID);
    let bet_amount: U512 = runtime::get_named_arg(constants::ARG_BET_AMOUNT);
    let bet_on: u32 = runtime::get_named_arg(constants::ARG_BET_ON);
    engine::quick_play(id, bet_amount, bet_on);
}

#[no_mangle]
pub extern "C" fn claim_credits() {
    admin::require(PermissionTypes::Admin);

    let purse = admin::get_purse();
    let balance = system::get_purse_balance(purse).unwrap_or_revert();

    let _ = system::transfer_from_purse_to_account(
        purse,
        utils::get_caller().into_account().unwrap_or_revert(),
        balance,
        Some(constants::TRANSFER_ID_CLAIM_CREDITS),
    );

    admin::update_purse_info(
        constants::STORAGE_PURSE_BALANCE,
        U512::zero(),
        admin::UpdatePurposeMode::Set,
    );
}

#[no_mangle]
pub extern "C" fn get_transfer_purse() {
    let purse = admin::get_purse();
    runtime::ret(CLValue::from_t(purse.into_add()).unwrap_or_revert());
}

pub fn load(entry_points: &mut EntryPoints) {
    entry_points.add_entry_point(EntryPoint::new(
        String::from(constants::ENTRY_POINT_SET_ADMINS),
        vec![Parameter::new(
            constants::ARG_ADMINS,
            CLType::List(Box::new(CLType::ByteArray(32u32))),
        )],
        <()>::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));

    entry_points.add_entry_point(EntryPoint::new(
        String::from(constants::ENTRY_POINT_CLAIM_CREDITS),
        vec![],
        <()>::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));

    entry_points.add_entry_point(EntryPoint::new(
        String::from(constants::ENTRY_POINT_GET_TRANSFER_PURSE),
        vec![],
        CLType::URef,
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));

    entry_points.add_entry_point(EntryPoint::new(
        String::from(constants::ENTRY_POINT_REGISTER_RACE_CONFIG),
        vec![
            Parameter::new(constants::ARG_NAME, CLType::String),
            Parameter::new(constants::ARG_RACERS, CLType::U32),
            Parameter::new(constants::ARG_FEE_PERCENT, CLType::U32),
            Parameter::new(constants::ARG_MIN_BET, CLType::U512),
            Parameter::new(constants::ARG_MAX_BET, CLType::U512),
        ],
        <()>::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));

    entry_points.add_entry_point(EntryPoint::new(
        String::from(constants::ENTRY_POINT_QUICK_PLAY),
        vec![
            Parameter::new(constants::ARG_ID, CLType::U256),
            Parameter::new(constants::ARG_BET_ON, CLType::U32),
            Parameter::new(constants::ARG_BET_AMOUNT, CLType::U512),
        ],
        <()>::cl_type(),
        EntryPointAccess::Public,
        EntryPointType::Contract,
    ));
}
