export enum CarrierStatus {
  None = 'None', New = 'New', Approved = 'Approved', Deleted = 'Deleted'
}

export namespace CarrierStatus {

  export function toCarrierStatus(status: any) {
    switch (status) {
      case 0:
        return CarrierStatus.None;
      case 1:
        return CarrierStatus.New;
      case 2:
        return CarrierStatus.Approved;
      case 3:
        return CarrierStatus.Deleted;
    }
  }

}
