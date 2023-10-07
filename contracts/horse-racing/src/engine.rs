use core::ops::{Add, Mul, Sub};

use alloc::{format, vec};
use alloc::string::{ToString, String};
use alloc::vec::Vec;
use casper_contract::contract_api::{runtime, system};
use casper_contract::unwrap_or_revert::UnwrapOrRevert;
use casper_types::{U512, U256};
use crate::data::{RaceConfig, Race};
use crate::errors::Error;
use crate::{constants, utils, admin};

pub(crate) fn register_race_config(config: RaceConfig) {
    let id: U256 = admin::get_next_race_config_id() ;
    let dic_ref = utils::get_uref(constants::STORAGE_RACES_CONFIG);
    utils::write_storage_dic(dic_ref, &id.to_string(), config);
}

pub(crate) fn get_race_config(id: U256) -> RaceConfig {
    let dic_ref: casper_types::URef = utils::get_uref(constants::STORAGE_RACES_CONFIG);
    let config: Option<RaceConfig> = utils::get_storage_dic(dic_ref, &id.to_string());
    config.unwrap_or_revert_with(Error::ConfigNotAvailable)
}

pub(crate) fn quick_play(race_config_id: U256, bet_amount: U512, bet_on: u32) -> U256 {
    let config = get_race_config(race_config_id);
    let config_id_str = race_config_id.to_string();

    if bet_on > config.racers {
        runtime::revert(Error::InvalidBetOn);
    }

    // First, create a list of racers (1, 2, 3, 4)
    let mut racers = Vec::with_capacity(config.racers as usize);
    for idx in 1..=config.racers {
        racers.push(idx);
    }

    // Then random pick a racer from a random index, until we have no more racers
    let mut racers_index = Vec::with_capacity(config.racers as usize);
    for _ in 1..=config.racers {
        let seed = runtime::random_bytes(); // 200 motes
        let index = U512::from_big_endian(&seed).div_mod(U512::from(racers_index.len())).1.add(1).as_usize();
        racers_index.push(racers.remove(index));
    }

    // The first one is the winner
    let winner = racers_index[0];
    
    let purse = admin::get_purse();
    let caller_account = runtime::get_caller();

    // Win or loose?
    if winner == bet_on {
        let total = bet_amount.mul(U512::from(config.racers - 1));
        let fee = utils::calculate_percentage(total, config.fee_percent);
        let award = total.sub(fee);

        system::transfer_from_purse_to_account(
            purse,
            caller_account,
            award,
            Some(constants::TRANSFER_ID_AWARD_TO_USER),
        )
        .unwrap_or_revert();
    } else {
        // Do nothing, keep the money in purse
    }

    let races_counter_ref = utils::get_uref(constants::STORAGE_RACES_COUNTER);
    let race_id = {
        let race_id_opt: Option<U256> = utils::get_storage_dic(races_counter_ref, &config_id_str);
        if let Some(temp) = race_id_opt {
            temp + 1
        } else {
            U256::one()
        }
    };
    utils::write_storage_dic(races_counter_ref, &config_id_str, race_id);

    // Store the result
    let race: Race = Race {
        player: caller_account,
        bet_amount,
        bet_on,
        racers: racers_index
    };

    let user_race_id = format!("{config_id_str}_{race_id}");

    let races_ref = utils::get_uref(constants::STORAGE_RACES);
    utils::write_storage_dic(races_ref, &user_race_id, race);

    // Push the race to user's storge
    let user_races_ref = utils::get_uref(constants::STORAGE_USER_RACES);
    let mut user_races: Option<Vec<String>> = utils::get_storage_dic(races_counter_ref, &config_id_str);
    if let Some(ref mut races) = user_races {
        races.push(user_race_id.clone());
        utils::write_storage_dic(user_races_ref, &user_race_id, races.clone());
    } else {
        utils::write_storage_dic(user_races_ref, &user_race_id, vec![ user_race_id.clone() ]);
    }

    race_id
}