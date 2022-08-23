import { Console } from "console";
import { Transform } from "stream";

export function consoleTableObj(data: object) {
    const ts = new Transform({ transform(chunk, enc, cb) { cb(null, chunk) } });
    const logger = new Console({ stdout: ts });
    logger.table(data);
    let table = (ts.read() || '').toString();
    table = table.split(/[\r\n]+/);
    table.splice(0, 2);
    table[0] = table[0].replace(/├/g, '┌');
    table[0] = table[0].replace(/┼/g, '┬');
    table[0] = table[0].replace(/┤/g, '┐');

    let result = '';

    for (let row of table) {
        const r = row.replace(/'/g, ' ');
        result += `${r}\n`;
    };

    console.log(`\n${result}`);
};

export function consoleTable(data: any) {
    const ts = new Transform({ transform(chunk, enc, cb) { cb(null, chunk) } });
    const logger = new Console({ stdout: ts });
    logger.table(data);
    const table = (ts.read() || '').toString();
    let result = '';
    for (let row of table.split(/[\r\n]+/)) {
        let r = row.replace(/[^┬]*┬/, '┌');
        r = r.replace(/^├─*┼/, '├');
        r = r.replace(/│[^│]*/, '');
        r = r.replace(/^└─*┴/, '└');
        r = r.replace(/'/g, ' ');
        result += `${r}\n`;
    };
    console.log(`\n${result}`);
};

export function mysqlDatetime(date?: any) {
    const datetime = new Date(date || Date.now());

    const timestamp = datetime.valueOf();
    const timezoneOffset = datetime.getTimezoneOffset() * 60 * 1000;

    const newDate = new Date(timestamp - timezoneOffset);
    return newDate.toISOString().replace("T", " ").replace("Z", "");
};
