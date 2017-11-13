const fs = require('fs');
const request = require('request');
const downloadLinks = require('./links.json');
const del = require('del');
const EPub = require('epub');
const cheerio = require('cheerio');
import { Moment } from 'moment';
import * as moment from 'moment';

interface EpubFileMonth {
  monthName: string;
  monthYear: string;
  monthDate: Moment;
  epubFile: any
}

interface Part {
  title: string;
  length?: string;
}

interface Section {
  title: string;
  parts?: Part[];
}

interface Meeting {
  startDate: Date;
  weekName: string;
  sections?: Section[];
}

const download = (url: string, destination: string) => {

  if (fs.existsSync(destination)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    const sendReq = request.get(url);

    // verify response code
    sendReq.on('response', (response) => {
      if (response.statusCode !== 200) {
        return reject('Response status was ' + response.statusCode);
      }
    });

    // check for request errors
    sendReq.on('error', (err) => {
      fs.unlink(destination);
      return reject(err.message);
    });

    sendReq.pipe(file);

    file.on('finish', () => {
      file.close();  // close() is async, call cb after close completes.
      resolve();
    });

    file.on('error', (err) => { // Handle errors
      fs.unlink(destination); // Delete the file async. (But we don't check the result)
      return reject(err.message);
    });
  });
};

const parseEpub = (fileName: string): Promise<EpubFileMonth> => {
  return new Promise((resolve, reject) => {
    const yearMonth = fileName.substr(fileName.indexOf('mwb_E_') + 6, 6);
    const monthDate = moment(yearMonth, 'YYYYMM').startOf('month');

    const epubFile = new EPub(fileName);
    epubFile.on('end', () => {
      const returnValue: EpubFileMonth = {
        monthDate: monthDate,
        monthName: monthDate.format('MMMM'),
        monthYear: monthDate.format('YYYY'),
        epubFile: epubFile
      };
      resolve(returnValue);
    });
    epubFile.parse();
  });
};

function getMeeting(chapter: any, epubFileMonth: EpubFileMonth): Promise<Meeting> {
  return new Promise((resolve, reject) => {
    epubFileMonth.epubFile.getChapter(chapter.id, (error, content) => {
      if (!!error) {
        reject(error);
      }

      const $ = cheerio.load(content);
      const headingName = ($('#p1').first().text() || '').replace(/\xA0/g, ' ');
      if (headingName.indexOf(epubFileMonth.monthName) === 0) {
        let startDate = headingName.split(' ')[1].split('-')[0];
        if (startDate.indexOf(String.fromCharCode(8211)) >= 0) {
          startDate = startDate.substring(0, startDate.indexOf(String.fromCharCode(8211)));
        }
        const meeting: Meeting = {
          weekName: headingName,
          startDate: epubFileMonth.monthDate.clone().date(startDate).toDate(),
          sections: []
        };

        $('.section').each((i: number, el: any) => {
          if ($(el).find('h1, h2, h3').length >= 1) {
            const newSection: Section = {
              title: $(el).find('h1, h2, h3').first().text(),
              parts: []
            };

            const firstPartEl = $(el).find('ul > li').first();
            newSection.parts.push({title: firstPartEl.text()});
            firstPartEl.siblings().each((siblingIndex: number, siblingEl: any) => {

            });

            meeting.sections.push(newSection);
          }
        });

        resolve(meeting);
      }
      resolve();
    });
  });
}

async function doStuff(): Promise<any> {
  // console.log('Deleting old files...');
  // del.sync('./data/**/*');
  console.log('Downloading files...');
  const files: string[] = [];
  const downloadPromises = downloadLinks.map((link: string) => {
    const fileName = `data/${link.split('/')[link.split('/').length - 1]}`;
    files.push(fileName);
    console.log('DOWNLOADING', fileName);
    return download(link, fileName);
  });

  await Promise.all(downloadPromises);
  console.log('Finished downloading files');
  console.log('Parsing epub...');

  const epubFilePromises = files.map(parseEpub);

  const epubFiles: EpubFileMonth[] = await Promise.all(epubFilePromises);

  if (fs.existsSync('results.json')) {
    del.sync('results.json')
  }

  const meetingPromises: Promise<Meeting>[] = [];

  epubFiles.forEach((epubFileMonth: EpubFileMonth) => {
    epubFileMonth.epubFile.toc.forEach((chapter: any) => {
      meetingPromises.push(getMeeting(chapter, epubFileMonth));
    });
  });

  console.log('MEETING PROMISES', meetingPromises.length);

  let meetings = await Promise.all(meetingPromises);
  meetings = meetings.filter((meeting: Meeting) => !!meeting);

  console.log('MEETINGS', meetings);

  fs.writeFileSync('results.json', JSON.stringify(meetings));

}

doStuff();
