#![no_std]
#![no_main]

#[cfg(not(target_arch = "wasm32"))]
compile_error!("target arch should be wasm32: compile with '--target wasm32-unknown-unknown'");

extern crate alloc;

use casper_contract::{
    contract_api::{account, runtime, system},
    unwrap_or_revert::UnwrapOrRevert,
};

use casper_types::{runtime_args, ContractHash, RuntimeArgs, URef, U512, U256};

const ENTRY_POINT_GET_TRANSFER_PURSE: &str = "get_transfer_purse";
const ENTRY_POINT: &str = "quick_play";

const ARG_HOST: &str = "host";
const ARG_ID: &str = "id";
const ARG_BET_ON: &str = "bet_on";
const ARG_BET_AMOUNT: &str = "bet_amount";

#[no_mangle]
pub extern "C" fn call() {
    let host: ContractHash = runtime::get_named_arg(ARG_HOST);
    let id: U256 = runtime::get_named_arg(ARG_ID);
    let bet_on: u32 = runtime::get_named_arg(ARG_BET_ON);
    let bet_amount: U512 = runtime::get_named_arg(ARG_BET_AMOUNT);

    let purse: URef =
        runtime::call_contract(host, ENTRY_POINT_GET_TRANSFER_PURSE, runtime_args! {});

    system::transfer_from_purse_to_purse(account::get_main_purse(), purse, bet_amount, Some(8910014))
        .unwrap_or_revert();

    let _: () = runtime::call_contract(
        host,
        ENTRY_POINT,
        runtime_args! {
            ARG_ID => id,
            ARG_BET_ON => bet_on,
            ARG_BET_AMOUNT =>  bet_amount,
        },
    );
}
