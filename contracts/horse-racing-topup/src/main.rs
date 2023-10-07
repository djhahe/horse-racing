#![no_std]
#![no_main]

#[cfg(not(target_arch = "wasm32"))]
compile_error!("target arch should be wasm32: compile with '--target wasm32-unknown-unknown'");

extern crate alloc;

use casper_contract::{
    contract_api::{account, runtime, system},
    unwrap_or_revert::UnwrapOrRevert,
};

use casper_types::{runtime_args, ContractHash, RuntimeArgs, URef, U512};

const ENTRY_POINT_GET_TRANSFER_PURSE: &str = "get_transfer_purse";

const ARG_HOST: &str = "host";
const ARG_AMOUNT: &str = "amount";

#[no_mangle]
pub extern "C" fn call() {
    let host: ContractHash = runtime::get_named_arg(ARG_HOST);
    let amount: U512 = runtime::get_named_arg(ARG_AMOUNT);

    let purse: URef =
        runtime::call_contract(host, ENTRY_POINT_GET_TRANSFER_PURSE, runtime_args! {});

    system::transfer_from_purse_to_purse(account::get_main_purse(), purse, amount, Some(8910015))
        .unwrap_or_revert();
}
