import puppeteer from 'puppeteer-core';
import MarkdownIt from 'markdown-it';
import { logger } from './logger.util';
import { env } from '../../env';

export const generatePDFUtil = async (
  title: string,
  content: string,
): Promise<Buffer> => {
  const md = new MarkdownIt();
  const result = `<h1>${title}</h1>${md.render(content)}`;

  let browser = null;
  let file = null;

  try {
    browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${env.browserless.token}`,
    });
    const page = await browser.newPage();

    await page.setContent(result);

    file = await page.pdf({
      format: 'a4',
      margin: {
        top: '10mm',
        bottom: '10mm',
        left: '15mm',
        right: '8mm',
      },
    });
  } catch (error) {
    logger.info(error);
  } finally {
    if (browser) {
      browser.close();
    }
  }

  return file;
};
