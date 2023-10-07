use alloc::{string::String, vec::Vec};
use casper_types::{
    bytesrepr::{self, FromBytes, ToBytes},
    CLType, CLTyped, U512, account::AccountHash,
};

#[derive(Clone, Debug)]
pub struct RaceConfig {
    pub name: String,
    pub racers: u32,
    pub fee_percent: u32,
    pub min_bet: U512,
    pub max_bet: U512
}

impl CLTyped for RaceConfig {
    fn cl_type() -> CLType {
        CLType::Any
    }
}

impl ToBytes for RaceConfig {
    #[inline(always)]
    fn to_bytes(&self) -> Result<Vec<u8>, bytesrepr::Error> {
        let mut result: Vec<u8> = Vec::new();

        result.append(&mut self.name.to_bytes().unwrap());
        result.append(&mut self.racers.to_bytes().unwrap());
        result.append(&mut self.fee_percent.to_bytes().unwrap());
        result.append(&mut self.min_bet.clone().to_bytes().unwrap());
        result.append(&mut self.max_bet.clone().to_bytes().unwrap());
        Ok(result)
    }

    #[inline(always)]
    fn serialized_length(&self) -> usize {
        self.racers.serialized_length()
            + self.fee_percent.serialized_length()
            + self.min_bet.serialized_length()
            + self.max_bet.serialized_length()
    }

    fn into_bytes(self) -> Result<Vec<u8>, casper_types::bytesrepr::Error>
    where
        Self: Sized,
    {
        self.to_bytes()
    }
}

impl FromBytes for RaceConfig {
    fn from_bytes(bytes: &[u8]) -> Result<(Self, &[u8]), bytesrepr::Error> {
        let (name, bytes) = String::from_bytes(bytes).unwrap();
        let (count, bytes) = u32::from_bytes(bytes).unwrap();
        let (fee, bytes) = u32::from_bytes(bytes).unwrap();
        let (min_bet, bytes) = U512::from_bytes(bytes).unwrap();
        let (max_bet, bytes) = U512::from_bytes(bytes).unwrap();

        Ok((
            RaceConfig {
                name,
                racers: count,
                fee_percent: fee,
                min_bet,
                max_bet,
            },
            bytes,
        ))
    }
}

#[derive(Clone, Debug)]
pub struct Race {
    pub player: AccountHash,
    pub bet_amount: U512,
    pub bet_on: u32,
    pub racers: Vec<u32>
}

impl CLTyped for Race {
    fn cl_type() -> CLType {
        CLType::Any
    }
}

impl ToBytes for Race {
    #[inline(always)]
    fn to_bytes(&self) -> Result<Vec<u8>, bytesrepr::Error> {
        let mut result: Vec<u8> = Vec::new();

        result.append(&mut self.player.to_bytes().unwrap());
        result.append(&mut self.bet_amount.to_bytes().unwrap());
        result.append(&mut self.bet_on.to_bytes().unwrap());
        result.append(&mut self.racers.to_bytes().unwrap());
        Ok(result)
    }

    #[inline(always)]
    fn serialized_length(&self) -> usize {
        self.player.serialized_length()
            + self.bet_amount.serialized_length()
            + self.bet_on.serialized_length()
            + self.racers.serialized_length()
    }

    fn into_bytes(self) -> Result<Vec<u8>, casper_types::bytesrepr::Error>
    where
        Self: Sized,
    {
        self.to_bytes()
    }
}

impl FromBytes for Race {
    fn from_bytes(bytes: &[u8]) -> Result<(Self, &[u8]), bytesrepr::Error> {
        let (player, bytes) = AccountHash::from_bytes(bytes).unwrap();
        let (bet_amount, bytes) = U512::from_bytes(bytes).unwrap();
        let (bet_on, bytes) = u32::from_bytes(bytes).unwrap();
        let (racers, bytes) = Vec::<u32>::from_bytes(bytes).unwrap();

        Ok((
            Race {
                player,
                bet_amount,
                bet_on,
                racers,
            },
            bytes,
        ))
    }
}