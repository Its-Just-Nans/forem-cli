import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'process';

export const quest = (question) => {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({ input, output });
        rl.question(question, (ans) => {
            rl.close();
            resolve(ans)
        });
    });
}

export const formatQuestion = (ques, arrayAns) => {
    let final = ques;
    let count = 1;
    arrayAns.forEach((temp) => {
        final += `\n${count++} - ${temp}`;
    });
    return `${final}\n`;
};

export const getArticles = async (client, USERNAME) => {
    let res = await client.GET_articles({ username: USERNAME });
    if (res && typeof res.length > 0) {
        res.forEach(element => {
            console.log(JSON.stringify(element));
        });
    } else {
        console.log("No articles ! :(")
    }
};

export const sendArticles = async (client) => {
    const article = await createArticle();
    let res = await client.POST_articles({
        article: article
    }).catch((e) => {
        if (e && e.response && e.response.status) {
            console.log(e.response.statusText);
        }
    });
    if (res && res.id) {
        console.log(`The Id of the new article : ${res.id}`)
    } else {
        console.log("No articles ! :(");
    }
}

const createArticle = async () => {
    const title = await quest("Title : ");
    const content = await quest("Content : ");
    const description = await quest("description : ");
    let published = await quest("published (bool) : ");
    published = published == "true" ? true : false;
    return {
        title,
        body_markdown: content,
        published,
        series: await quest("series : "),
        main_image: await quest("main_image : "),
        canonical_url: await quest("canonical_url : "),
        description: await quest("description : "),
        tags: await quest("tags : "),
        organization_id: await quest("organization_id : ")
    }
}