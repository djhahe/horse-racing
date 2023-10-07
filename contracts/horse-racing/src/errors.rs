use casper_types::ApiError;

#[repr(u16)]
pub enum Error {
    AlreadyInitialized = 10,
    PermissionDenied = 100,
    MissingDeployerRight = 101,
    MissingAdminRights = 102,
    InvalidBetOn = 103,
    SessionIsNotContract = 104,
    CallerIsNotOwner = 105,
    TokenConfigNotAvailable = 106,
    ConfigNotAvailable = 107,
    OverDueDate = 108,
    ContractEnded = 109,
    UnknownPlanLen = 110,
    InsufficientAmount = 111,
    InsufficientDownPaymentAmount = 112,
    CannotTransferToHoldPurse = 113,
    CannotTransferToPurse = 114,
    PaymentIsNotActive = 115,
    MissingArgument0 = 400,
    MissingArgument1 = 401,
    MissingArgument2 = 402,
    MissingArgument3 = 403,
    MissingArgument4 = 404,
    InvalidArgument0 = 450,
    InvalidArgument1 = 451,
    InvalidArgument2 = 452,
    InvalidArgument3 = 453,
    InvalidArgument4 = 454,
    UnsupportedNumberOfArguments = 499,
}

impl Error {
    pub fn missing_argument(i: u32) -> Error {
        match i {
            0 => Error::MissingArgument0,
            1 => Error::MissingArgument1,
            2 => Error::MissingArgument2,
            3 => Error::MissingArgument3,
            4 => Error::MissingArgument4,
            _ => Error::UnsupportedNumberOfArguments,
        }
    }

    pub fn invalid_argument(i: u32) -> Error {
        match i {
            0 => Error::InvalidArgument0,
            1 => Error::InvalidArgument1,
            2 => Error::InvalidArgument2,
            3 => Error::InvalidArgument3,
            4 => Error::InvalidArgument4,
            _ => Error::UnsupportedNumberOfArguments,
        }
    }
}

impl From<Error> for ApiError {
    fn from(error: Error) -> ApiError {
        ApiError::User(error as u16)
    }
}
