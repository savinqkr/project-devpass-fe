const fetchFile = async (fileId: number, fileName: string) => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_NEST_APP_ENDPOINT}/file/download/${fileId}`
    );
    const fileBlob = await response.blob();
    return new File([fileBlob], fileName);
};

export default fetchFile;
