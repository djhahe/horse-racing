use core::ops::{Div, Mul};

use alloc::borrow::ToOwned;

use casper_contract::{
    contract_api::{runtime, storage},
    unwrap_or_revert::UnwrapOrRevert,
};
use casper_types::{
    bytesrepr::{FromBytes, ToBytes},
    system::CallStackElement,
    ApiError, CLTyped, Key, URef, U512,
};

pub(crate) fn get_caller() -> Key {
    match *runtime::get_call_stack()
        .iter()
        .nth_back(1)
        .to_owned()
        .unwrap_or_revert()
    {
        CallStackElement::Session {
            account_hash: calling_account_hash,
        } => Key::Account(calling_account_hash),
        CallStackElement::StoredSession { contract_hash, .. }
        | CallStackElement::StoredContract { contract_hash, .. } => contract_hash.into(),
    }
}

/**
 * Percent in format 3 digits, 100 for 10%, 105 for 10.5%
 */
pub(crate) fn calculate_percentage(value: U512, percent: u32) -> U512 {
    match percent == 0 {
        true => U512::zero(),
        false => {
            // percent in format of xxx
            // e.g 100 is for 10%, 105 is for 10.5%
            // 500 and 10.5%
            // 500 - (500 * 105 / 1000) = 500 - 52.5 = 447.5
            value.mul(U512::from(percent)).div(U512::from(1000))
        }
    }
}

#[inline]
pub(crate) fn get_uref(key: &str) -> URef {
    let key = runtime::get_key(key)
        .ok_or(ApiError::MissingKey)
        .unwrap_or_revert();
    key.into_uref().unwrap_or_revert()
}

#[inline]
pub(crate) fn get_storage<T: CLTyped + FromBytes>(name: &str) -> T {
    storage::read(get_uref(name))
        .unwrap_or_revert()
        .unwrap_or_revert()
}

#[inline]
pub(crate) fn write_storage<T: CLTyped + ToBytes>(name: &str, value: T) {
    storage::write(get_uref(name), value);
}

#[inline]
pub(crate) fn get_storage_dic<T: CLTyped + FromBytes + ToBytes>(dic: URef, key: &str) -> Option<T> {
    storage::dictionary_get(dic, key).unwrap_or(None)
}

#[inline]
pub(crate) fn write_storage_dic<T: CLTyped + FromBytes + ToBytes>(dic: URef, key: &str, value: T) {
    storage::dictionary_put(dic, key, value);
}

// pub(crate) fn debug_write_line<T: string::ToString>(value: T) {
//     let mut info: String = get_storage("__debug__");
//     if new {
//         info.push_str("\r\n=====");
//     }
//     info.push_str(value.to_string().as_str());
//     write_storage("__debug__", info);
// }
