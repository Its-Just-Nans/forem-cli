import ForemClient from "./forem.js";
import axios from 'axios';
import { quest, formatQuestion, getArticles, sendArticles } from './utils.js';

import apikey from "./apikey.js";

let client = new ForemClient(axios);
client.setAPIkey(apikey);

let APIKEY = null;
let USERNAME = null;

const start = async () => {
    const ans = ["exit", "getArticles", "sendArticles"];
    const defQuestion = formatQuestion('-----------\nWhat do you want to do ?', ans);
    let answer = null;
    while ((answer = await quest(defQuestion)) !== "1") {
        switch (answer) {
            case (ans.indexOf("getArticles") + 1).toString(): {
                if (typeof USERNAME !== "undefined") {
                    USERNAME = await quest('Enter the name :');
                }
                await getArticles(client, USERNAME);
                break;
            }
            case (ans.indexOf("sendArticles") + 1).toString(): {
                await sendArticles(client);
                break;
            }
        }
    }
}

const job = async () => {
    let res;
    await start();

    res;
};
job();