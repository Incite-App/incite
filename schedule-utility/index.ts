const fs = require('fs');
const request = require('request');
const downloadLinks = require('./links.json');
const del = require('del');
const EPub = require('epub');
const cheerio = require('cheerio');
import { Moment } from 'moment';
import * as moment from 'moment';

const Firestore = require('@google-cloud/firestore');

interface EpubFileMonth {
  monthName: string;
  monthYear: string;
  monthDate: Moment;
  epubFile: any
}

interface Part {
  index: number;
  title: string;
  length?: string;
  instructions?: string[];
  raw?: string;
}

interface Section {
  index: number;
  title: string;
  parts?: Part[];
}

interface Meeting {
  startDate: string;
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

function getPartFromTitle(title: string, index: number): Part {
  title = title || '';
  // Grab the actual title from the first part of the string
  let sanitizedTitle = title.split('\n')[0].trim();
  sanitizedTitle = sanitizedTitle.split(':')[0];

  let length = '';
  let truncatedInstructions = title;

  console.log('TITLE', title);

  // If the part has the part length, the instructions will be after that
  if (title.indexOf('min. or less)') >= 0) {
    truncatedInstructions = title.substr(title.indexOf('min. or less)') + 13);
  } else if (title.indexOf('min.)') >= 0) {
    truncatedInstructions = title.substr(title.indexOf('min.)') + 5);
  }

  // Check if title contains part length in parentheses
  if (title.indexOf(')') >= 0 && title.indexOf('(') >= 0) {
    const potentialLengths: string[] = title.split('(');
    for (let i = 0; i < potentialLengths.length; i++) {
      if ((potentialLengths[i] || '').indexOf('min.') >= 0 && (potentialLengths[i] || '').indexOf(')') >= 0) {
        let closeIndex = (potentialLengths[i] || '').indexOf(')');
        length = (potentialLengths[i] || '').substring(0, closeIndex);
        break;
      }
    }
  }

  console.log('TRUNCATED INSTRUCTIONS', truncatedInstructions);

  // Instructions usually have line breaks, and sometimes more than one in a row
  // No need to keep songs in the instructions
  const instructions = truncatedInstructions
    .split('\n')
    .map((i: string) => (i || '').trim())
    .filter((i: string) => {return !!i && (i || '').toLowerCase().indexOf('song') === -1;});

  return {
    index: index,
    title: sanitizedTitle,
    length: length,
    instructions: instructions
  }
}

function getMeeting(chapter: any, epubFileMonth: EpubFileMonth): Promise<Meeting> {
  return new Promise((resolve, reject) => {
    epubFileMonth.epubFile.getChapter(chapter.id, (error, content) => {
      if (!!error) {
        reject(error);
      }

      const $ = cheerio.load(content);
      // Grab the chapter heading and clean out weird whitespace characters
      const headingName = ($('#p1').first().text() || '').replace(/\xA0/g, ' ');

      // Check if the heading begins with the month name we are expecting, if so we must be in a new meeting
      if (headingName.indexOf(epubFileMonth.monthName) === 0) {
        // Get the actual date of the start of the week within the month that this meeting starts in
        let startDate = headingName.split(' ')[1].split('-')[0];
        if (startDate.indexOf(String.fromCharCode(8211)) >= 0) {
          startDate = startDate.substring(0, startDate.indexOf(String.fromCharCode(8211)));
        }

        const meeting: Meeting = {
          weekName: headingName,
          startDate: epubFileMonth.monthDate.clone().date(startDate).format('YYYY-MM-DD'),
          sections: []
        };

        // Parse the sections in this meeting and add it to the final collection
        $('.section').each((i: number, el: any) => {
          if ($(el).find('h1, h2, h3').length >= 1) {
            const newSection: Section = {
              index: i,
              title: $(el).find('h1, h2, h3').first().text(),
              parts: []
            };

            const firstPartEl = $(el).find('ul > li').first();
            newSection.parts.push(getPartFromTitle(firstPartEl.text(), 0));
            firstPartEl.siblings().each((siblingIndex: number, siblingEl: any) => {
              newSection.parts.push(getPartFromTitle($(siblingEl).first().text(), siblingIndex + 1));
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
  console.log('Parsing epubs...');

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

  let meetings = await Promise.all(meetingPromises);
  meetings = meetings.filter((meeting: Meeting) => !!meeting);

  fs.writeFileSync('results.json', JSON.stringify(meetings));

  console.log('Connecting to Firestore...');
  const firestore = new Firestore({projectId: 'incite-10624', keyFilename: './key.json'});
  meetings.forEach(async (meeting: Meeting) => {
    console.log('Saving meeting', meeting.weekName);
    const meetingDocRef = firestore.doc(`meetings/${meeting.startDate}`);
    try {
      await meetingDocRef.set({startDate: meeting.startDate, weekName: meeting.weekName});
      meeting.sections.forEach(async (section: Section) => {
        const sectionRef = firestore.doc(`meetings/${meeting.startDate}/sections/${section.index}`);
        await sectionRef.set({title: section.title});
        section.parts.forEach(async (part: Part) => {
          const partRef = firestore.doc(`meetings/${meeting.startDate}/sections/${section.index}/parts/${part.index}`);
          await partRef.set(part);
        });
      })
    } catch (error) {
      console.warn(error);
    }
  });

  console.log('ALL DONE!');
}

doStuff();
