export const method = {
    get: 'GET',
    post: 'POST',
    put: 'PUT',
    delete: 'DELETE'
}
export const responseStatus = {
    Invalid: 0,
    Success: 1,
    Exception: 2,
    ForceLogOut: 3,
    Maintenance: -1,
    VersionInvalid: -2,
}

export const config = {
    apiUrl: 'https://magiccard.live/api',
    pageSize: 10
};



export const fileExtension = {
    xslx: ".xlsx",
    csv: ".csv",
    pdf: ".pdf"
};