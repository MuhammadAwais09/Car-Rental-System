export enum DriverType {
    WITH_DRIVER = 'withDriver',
    WITHOUT_DRIVER = 'withoutDriver',
}

export enum OrderStatus {
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
    CANCELED = 'canceled',
    PENDING = 'pending'
}

export enum Feature {
    MANUAL = 'manual',
    AUTO = 'auto'
}

export enum FuelType {
    ELECTRIC = 'electric',
    DIESEL = 'diesel',
    CNG = 'cng',
    PETROL = 'petrol',
}

export enum StatusCodes {
    NotFound = 404,
    Success = 200,
    Accepted = 202,
    BadRequest = 400,
    Created = 201
}

export enum Roles {
    SUPERADMIN = 'superAdmin',
    SHOWROOMOWNER = 'showroomOwner'
}

export enum ShowroomStatus {
    REJECTED = 'rejected',
    APPROVED = 'approved',
    PENDING = 'pending'
}