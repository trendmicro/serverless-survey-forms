/**
 *  Mixin for some shared methods between components
 **/
import { saveAs } from 'file-saver';

function generateRow(colArray) {
    // Temporary delimiter characters unlikely to be typed by keyboard
    // This is to avoid accidentally splitting the actual contents
    const tmpColDelim = String.fromCharCode(11); // vertical tab character
    const tmpRowDelim = String.fromCharCode(0); // null character
    // actual delimiter characters for CSV format
    const colDelim = '","';
    const rowDelim = '"\r\n"';
    return colArray.map((row) =>
            row.map((col) => col.replace(/"/g, '""'))
                .join(tmpColDelim)
        )
        .join(tmpRowDelim).split(tmpRowDelim)
        .join(rowDelim)
        .split(tmpColDelim)
        .join(colDelim);
}

const mixins = {
    generateQuestionID() {
        return (Date.now().toString(32) + Math.random().toString(36).substr(2, 12)).toUpperCase();
    },

    getParameterByName(name) {
        const url = window.location.href;
        const rename = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp(`[?&]${rename}(=([^&#]*)|&|#|$)`);
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },

    exportCSV(filename = 'Qustom', v = 'v1', header, content) {
        const rowDelim = '"\r\n"';
        const headerCSV = generateRow(header);
        const contentCSV = generateRow(content);
        const csv = `"${headerCSV}${rowDelim}${contentCSV}"`;

        // Use <a> click event to download CSV
        // The BOM will not work in Excel for Mac OS X,
        // it will only present it with some odd characters in the beginning of the file
        // so it need to open in Numbers for Mac OS X
        // check this issue in FileSaver.js git issues#28
        const downloadLink = document.createElement('a');
        downloadLink.addEventListener('click', () => {
            if (navigator.userAgent.match(/Version\/([0-9\._]+).*Safari/)) {
                // eslint-disable-next-line no-alert
                alert('Safari is unsupported this. Please manually press command + S.');
            }
            const blob = new Blob([csv], { type: 'text/csv;charset=charset=utf-8;' });
            saveAs(blob, `${filename}.csv`);
        });
        downloadLink.click();
    },

    fixScrollbar() {
        const html = document.getElementsByTagName('html')[0];
        const scrollTop = (document.documentElement && document.documentElement.scrollTop)
            || document.body.scrollTop;
        html.style.top = `${0 - scrollTop}px`;
        html.classList.add('non-scroll');
    },

    freeScrollbar() {
        const html = document.getElementsByTagName('html')[0];
        const scrollTop = html.style.top.replace(/px/g, '');
        const body = document.documentElement && document.documentElement.scrollTop ?
            document.documentElement : document.body;
        html.style.top = '';
        html.classList.remove('non-scroll');
        body.scrollTop = 0 - scrollTop;
    }
};

export default mixins;
