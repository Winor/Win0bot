import Commend from '../Commend'
import type w0bMessage from '../adapters/discord/adapter'
import puppeteer from 'puppeteer'

export default class Movie extends Commend {
    constructor() {
        super({
            name: 'movie',
            description: `Look for today's movie screen times at Yes Planet Haifa`,
            cmd: ['movie', 'mvi'],
            hear: [],
            globalHear: [],
            platform: "any",
            lvl: 0,
            discord: {
                options: [{
                name: 'name',
                type: 'STRING',
                description: 'Movie name',
                required: true,
              }]
            }
        })
    }
    
    async run(msg: w0bMessage): Promise<void> {
        try {
            msg.defer()
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(`https://www.yesplanet.co.il/search?query=${msg.text}`);
            await page.setViewport({
                width: 350,
                height: 900,
                deviceScaleFactor: 1,
              })
            await page.setCookie({name: 'selectedSessionCinemaCode', value: '1070'})
            const firstRes = await page.$('div.media:nth-child(1)')
            const movieNameRes = await page.$eval('div.media:nth-child(1) > div:nth-child(2) > h2:nth-child(1)',(element) => {
                return element.innerHTML 
            })
            await firstRes?.click()
            try {
                const movieScreen = await page.waitForSelector('.movie-row', {timeout: 20000})
                const buffer = await movieScreen?.screenshot()
            if (buffer) {
                msg.backPhoto(buffer, movieNameRes);
            }
            } catch (e) {
                msg.back('Cannot find movie')
            }
        } catch (e) {
            console.log(e)
        }   
    }
    }