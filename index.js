import ForemClient from "forem-client";
import axios from 'axios';
import { quest, questSafe, formatQuestion, getArticles, sendArticles } from './utils.js';

let client = new ForemClient(axios);

const start = async () => {
    const ans = ["exit", "set user", "getArticles", "sendArticles", "set api-key"];
    const defQuestion = formatQuestion('-----------\nWhat do you want to do ?', ans);
    let answer = null;
    while ((answer = await quest(defQuestion)) !== "1") {
        switch (answer) {
            case (ans.indexOf("set user") + 1).toString(): {
                const username = await questSafe("Enter the username\n");
                if (username === "0") { continue };
                const clientObj = await client.GET_getUserByUsername(username).catch(() => { console.log("--> user not found ! :(") })
                if (typeof clientObj !== "undefined") {
                    client.setUser(clientObj);
                }
                break;
            }
            case (ans.indexOf("getArticles") + 1).toString(): {
                await getArticles(client);
                break;
            }
            case (ans.indexOf("sendArticles") + 1).toString(): {
                await sendArticles(client);
                break;
            }
            case (ans.indexOf("set api-key") + 1).toString(): {
                const apikey = await questSafe("Enter the api-key\n");
                if (apikey === "0") { continue };
                client.setAPIkey(apikey);
                break;
            }
        }
    }
}

start().catch((e) => {
    console.log("Exited")
})