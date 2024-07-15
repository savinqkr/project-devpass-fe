import { useState } from "react";
import { ICompanyDetail } from "./CompanyDetail.interface";
import VCompanyDetail from "./CompanyDetail.view";
import { useRecoilState } from "recoil";
import downloadModalState from "@recoils/download-modal.atom";

const CompanyDetail: React.FC<ICompanyDetail.IProps> = props => {
    const [attachment, setAttachment] = useState<ICompanyDetail.IAttachment>();

    const [isOpen, setIsOpen] = useRecoilState(downloadModalState);
    const handleOpen = (attachment: ICompanyDetail.IAttachment) => {
        setAttachment(attachment);
        setIsOpen(true);
    };
    const handleClose = () => {
        setIsOpen(false);
        setAttachment(undefined);
    };

    return (
        <VCompanyDetail
            {...props}
            isOpen={isOpen}
            handleOpen={handleOpen}
            handleClose={handleClose}
            attachment={attachment}
        />
    );
};

export default CompanyDetail;
