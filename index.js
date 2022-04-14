import ForemClient from "forem-client";
import axios from 'axios';
import { quest, questSafe, formatQuestion, getArticles, sendArticles, getConfig, saveConfig } from './utils.js';

let client = new ForemClient(axios);

const start = async () => {
    const ans = ["exit", "set user", "getArticles", "sendArticles", "set api-key", "push articles", "save config"];
    const defQuestion = formatQuestion('-----------\nWhat do you want to do ?', ans);
    let answer = null;
    let config = getConfig();
    if (typeof config.client !== "undefined") {
        client.setUser(config.client);
    }
    if (typeof config.apikey !== "undefined") {
        client.setAPIkey(config.apikey);
    }
    if (config.client && config.client.username) {
        console.log(`--> Using ${config.client.username}`);
    }
    while ((answer = await quest(defQuestion)) !== "1") {
        switch (answer) {
            case (ans.indexOf("set user") + 1).toString(): {
                const username = await questSafe("Enter the username\n");
                if (username === "0") { continue };
                const clientObj = await client.GET_getUserByUsername(username).catch(() => { console.log("--> user not found ! :(") })
                if (typeof clientObj !== "undefined") {
                    client.setUser(clientObj);
                    config.client = clientObj;
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
                const needSave = await questSafe(formatQuestion("Save api-key in config ?", ["yes", "no"]));
                if (needSave === "0") { continue } else if (needSave.indexOf("yes")) {
                    config.apikey = apikey;
                    console.log("--> API key registered in the config (don't forget to save the config !)")
                }
                break;
            }
            case (ans.indexOf("push articles") + 1).toString(): {
                pushArticles();
                break;
            }
            case (ans.indexOf("save config") + 1).toString(): {
                saveConfig(config);
                break;
            }
        }
    }
}

start().catch((e) => {
    if (typeof e !== "undefined") {
        console.log(`ERROR : ${e.message}`);
    }
    console.log("Exited")
})