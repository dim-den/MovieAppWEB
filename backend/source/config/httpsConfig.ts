var fs = require('fs');

export const httpsConfig = {
    key: fs.readFileSync('C:\\Users\\dimde\\OneDrive\\Рабочий стол\\ПСКП\\SEM 6\\Курсовой\\MovieAppWEB\\backend\\source\\certs\\key.pem'),
    cert: fs.readFileSync('C:\\Users\\dimde\\OneDrive\\Рабочий стол\\ПСКП\\SEM 6\\Курсовой\\MovieAppWEB\\backend\\source\\certs\\cert.pem')
};