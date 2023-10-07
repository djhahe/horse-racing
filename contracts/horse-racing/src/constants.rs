pub const TRANSFER_ID_CLAIM_CREDITS: u64 = 8910200;
pub const TRANSFER_ID_AWARD_TO_USER: u64 = 8910201;

pub const ARG_ID: &str = "id";
pub const ARG_NAME: &str = "name";
pub const ARG_ADMINS: &str = "admins";

pub const ARG_RACERS: &str = "racers";
pub const ARG_MIN_BET: &str = "min_bet";
pub const ARG_MAX_BET: &str = "max_bet";
pub const ARG_FEE_PERCENT: &str = "fee_percent";

pub const ARG_BET_ON: &str = "bet_on";
pub const ARG_BET_AMOUNT: &str = "bet_amount";

pub const ENTRY_POINT_SET_ADMINS: &str = "set_admins";
pub const ENTRY_POINT_REGISTER_RACE_CONFIG: &str = "register_race_config";
pub const ENTRY_POINT_GET_TRANSFER_PURSE: &str = "get_transfer_purse";
pub const ENTRY_POINT_CLAIM_CREDITS: &str = "claim_credits";
pub const ENTRY_POINT_QUICK_PLAY: &str = "quick_pay";

pub const STORAGE_NAME: &str = "name";
pub const STORAGE_DEPLOYER: &str = "deployer";
pub const STORAGE_ADMINS: &str = "admins";

pub const STORAGE_PURSE: &str = "purse";
pub const STORAGE_PURSE_BALANCE: &str = "purse_balance";

pub const STORAGE_RACE_CONFIG_COUNTER: &str = "race_config_counter";

pub const STORAGE_RACES_CONFIG: &str = "races_config";
pub const STORAGE_RACES_COUNTER: &str = "races_counter";
pub const STORAGE_RACES: &str = "races"; // race_config_id + race_id
pub const STORAGE_USER_RACES: &str = "uses_races";

// pub const STORAGE_PAYMENTS_PROGRESS: &str = "payments_progress";
