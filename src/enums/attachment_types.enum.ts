export enum AttachmentType {
    NONE = "none",
    LICENSE = "license",
    PASSBOOK = "passbook",
    SEAL = "seal",
    CONTRACT = "contract",
    INSPECTION = "inspection",
    REPAIR_REPORT = "repair_report",
    LICENSE_CERTIFICATE = "license_certificate",
}

export function stringToAttachmentTypeEnum(type: string) {
    switch (type) {
        case "license":
            return AttachmentType.LICENSE;
        case "passbook":
            return AttachmentType.PASSBOOK;
        case "seal":
            return AttachmentType.SEAL;
        case "contract":
            return AttachmentType.CONTRACT;
        case "inspection":
            return AttachmentType.INSPECTION;
        case "repair_report":
            return AttachmentType.REPAIR_REPORT;
        case "license_certificate":
            return AttachmentType.LICENSE_CERTIFICATE;
        default:
            return AttachmentType.NONE;
    }
}
