import { IClientCompanyForm } from "./ClientCompanyForm.interface";
import VClientCompanyForm from "./ClientCompanyForm.view";
import { Box, Button, Chip } from "@mui/material";
import { GridColDef, GridRowId } from "@mui/x-data-grid";
import { AttachmentState } from "@enums";
import { Colors } from "@configs/colors";

const ClientCompanyForm: React.FC<IClientCompanyForm.IProps> = props => {
    const { isLoading, passbookRows, setPassbookRows, passbookApiRef } = props;

    // ---------------------------------------------------------
    // TYPE CODE 조회 ( QUERY )
    // - [ 고객사 | 계약사 | 파트너사 ]
    // - 거래처 구분
    // ---------------------------------------------------------
    // const [typeOptions, setTypeOptions] = useState<
    //     { value: string; label: string }[]
    // >([]);
    // const { refetch: fetchTypeOptions } = useQuery(
    //     ["get company type"],
    //     () =>
    //         codeService.getCommonCode({
    //             where: {
    //                 category: { _eq: CodeCategory.COMPANY_TYPE },
    //                 value: { _eq: CompanyType.CLIENT },
    //                 is_used: { _eq: true },
    //             },
    //         }),
    //     {
    //         onSuccess(data) {
    //             const options: { value: string; label: string }[] = [];
    //             data.common_code.forEach(option => {
    //                 if (option.value !== CompanyType.HEAD) {
    //                     options.push({
    //                         value: option.code,
    //                         label: option.value,
    //                     });
    //                 }
    //             });
    //             setTypeOptions(options);
    //         },
    //     }
    // );

    // 첨부 파일 CHIP 추가
    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        id: GridRowId
    ) => {
        const file = e.target.files?.[0];

        if (file) {
            const updatedRow: any[] = [];

            passbookRows.forEach(row => {
                row.id === id
                    ? updatedRow.push({
                          ...row,
                          id,
                          file,
                          tag: AttachmentState.NEW,
                      })
                    : updatedRow.push(row);
            });
            setPassbookRows(updatedRow);
        }
    };
    // 첨부 파일 CHIP 삭제
    const handleChipDelete = (id: GridRowId) => {
        const updatedRow: any[] = [];

        passbookRows.forEach(row => {
            if (row.id === id) {
                delete row.file;
            }
            updatedRow.push(row);
        });
        setPassbookRows(updatedRow);
    };

    const columns: GridColDef[] = [
        {
            field: "bank_name",
            headerName: "은행",
            flex: 1,
            editable: true,
            valueSetter(params) {
                const { value, row } = params;
                return {
                    ...row,
                    tag: !!row.tag ? row.tag : AttachmentState.NEW,
                    bank_name: value,
                };
            },
            renderCell({ id, value }) {
                return (
                    <p
                        css={{
                            color:
                                value === "" ? Colors.softGray : Colors.black,
                        }}
                    >
                        {value === "" ? "은행" : value}
                    </p>
                );
            },
        },
        {
            field: "bank_account",
            headerName: "계좌번호",
            flex: 1.5,
            editable: true,
            valueSetter(params) {
                const { value, row } = params;
                return {
                    ...row,
                    tag: !!row.tag ? row.tag : AttachmentState.NEW,
                    bank_account: value,
                };
            },
            renderCell({ id, value }) {
                return (
                    <p
                        css={{
                            color:
                                value === "" ? Colors.softGray : Colors.black,
                        }}
                    >
                        {value === "" ? "계좌번호" : value}
                    </p>
                );
            },
        },
        {
            field: "passbook",
            headerName: "통장사본",
            flex: 2.5,
            editable: true,
            type: "custom",
            renderCell({ id, value }) {
                return (
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-around",
                            alignItems: "center",
                        }}
                    >
                        <input
                            type="file"
                            css={{ display: "none" }}
                            id={`passbook-${id || 0}`}
                            onChange={e => handleFileChange(e, id)}
                        />
                        <Box
                            sx={{
                                width: "75%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "start",
                                alignItems: "center",
                            }}
                        >
                            {!!passbookRows[(id as number) - 1] &&
                            !!passbookRows[(id as number) - 1].file ? (
                                <Chip
                                    key={`chip-${id}`}
                                    sx={{
                                        maxWidth: "90%",
                                        height: "60%",
                                        padding: "0px 8px",
                                        fontSize: 14,
                                    }}
                                    variant="outlined"
                                    label={
                                        passbookRows[(id as number) - 1].file
                                            .name
                                    }
                                    onDelete={() => handleChipDelete(id)}
                                />
                            ) : (
                                <p css={{ color: Colors.softGray }}>
                                    첨부파일을 추가해주세요.
                                </p>
                            )}
                        </Box>
                        <Button
                            variant="outlined"
                            disableElevation
                            sx={{
                                width: 100,
                                height: 30,
                                fontSize: 12,
                                cursor: "pointer",
                                borderStyle: "dashed",
                            }}
                        >
                            <label htmlFor={`passbook-${id || 0}`}>
                                첨부파일 추가
                            </label>
                        </Button>
                    </Box>
                );
            },
            renderEditCell({ id, value }) {
                return (
                    <Box
                        sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-around",
                            alignItems: "center",
                        }}
                    >
                        <input
                            type="file"
                            css={{ display: "none" }}
                            id={`passbook-${id || 0}`}
                            onChange={e => handleFileChange(e, id)}
                        />
                        <Box
                            sx={{
                                width: "75%",
                                height: "100%",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "start",
                                alignItems: "center",
                            }}
                        >
                            {!!passbookRows[(id as number) - 1] &&
                            !!passbookRows[(id as number) - 1].file ? (
                                <Chip
                                    key={`chip-edit-${id}`}
                                    sx={{
                                        maxWidth: "90%",
                                        height: "60%",
                                        padding: "0px 8px",
                                        fontSize: 14,
                                    }}
                                    variant="outlined"
                                    label={
                                        passbookRows[(id as number) - 1].file
                                            .name
                                    }
                                    onDelete={() => handleChipDelete(id)}
                                />
                            ) : (
                                <p css={{ color: Colors.softGray }}>
                                    첨부파일을 추가해주세요.
                                </p>
                            )}
                        </Box>
                        <Button
                            variant="outlined"
                            disableElevation
                            sx={{
                                width: 100,
                                height: 30,
                                fontSize: 12,
                                cursor: "pointer",
                                borderStyle: "dashed",
                            }}
                        >
                            <label htmlFor={`passbook-${id || 0}`}>
                                첨부파일 추가
                            </label>
                        </Button>
                    </Box>
                );
            },
        },
    ];
    // ROW 추가
    const handleClickAddRow = () => {
        const newRow = {
            id: passbookRows.length + 1,
            bank_name: "",
            bank_account: "",
        };
        setPassbookRows(prev => [...prev, newRow]);
    };

    // ROW 삭제
    const handleClickDeleteRow = () => {
        const allRowIds = passbookApiRef.current.getAllRowIds();
        const selectedRowIds: GridRowId[] = Array.from(
            passbookApiRef.current.getSelectedRows().keys()
        );
        passbookApiRef.current.setRowSelectionModel([]);
        const newRows = allRowIds
            .filter(id => !selectedRowIds.includes(id))
            .map((id, idx) => {
                const row = passbookApiRef.current.getRow(id);
                return {
                    ...row,
                    id: idx + 1,
                };
            });
        setPassbookRows(newRows);
    };

    return (
        <VClientCompanyForm
            {...props}
            // typeOptions={typeOptions}
            columns={columns.map(col => ({
                ...col,
                editable: col.editable ?? true,
                sortable: false,
                align: "center",
                headerAlign: "center",
            }))}
            handleClickAddRow={handleClickAddRow}
            handleClickDeleteRow={handleClickDeleteRow}
        />
    );
};

export default ClientCompanyForm;
