const request = require('request');
const express = require('express');
const puppeteer=require('puppeteer');
const app = express();
var axios = require("axios").default;
const { puppeteerErrors } = require('puppeteer');

app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

app.listen(3000, () => console.log('listening at 3000'));

var options = {
  method: 'GET',
  url: 'https://ai-chatbot.p.rapidapi.com/chat/free',
  params: {message: '', uid: ''},
  headers: {
    'x-rapidapi-key': 'c8860574c4msh8717e41c7f6c591p1377aejsn30645d12972f',
    'x-rapidapi-host': 'ai-chatbot.p.rapidapi.com'
  }
};
// let botRespone={"chatbot":{"message":"","response":""}};

app.post('/api', async (req, res) => {  
  
  // call google finance if msg starts with !
  if((req.body.msg).startsWith('!')){
    var data=await getStockData_yahoo((req.body.msg));
    res.json({
      res:data
    });
  }else{  
    options.params.message=req.body.msg;
    options.params.uid=req.body.user;
    axios.request(options).then(function (response) {
      res.json({
        res:response.data.chatbot.response
      });
    }).catch(function (error) {
      console.error(error);
    });
  }
});

var yh_url="https://in.finance.yahoo.com/quote/TCS.NS?p=TCS.NS&.tsrc=fin-srch";
async function getStockData_yahoo(stock){
  const browser=await puppeteer.launch({headless:true});
  const page=await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (request.resourceType() === 'image') request.abort();
    else request.continue();
  });
  await page.goto(yh_url);
  await page.setDefaultNavigationTimeout(0);
  await page.waitForSelector("#fin-srch-assist");
  await page.click("#fin-srch-assist");
  await page.type("#yfin-usr-qry",stock.slice(1),{delay:400});
  await page.keyboard.press('Enter');
  await page.waitForNavigation({
    waitUntil: 'networkidle0',
  });

  const StockData=await page.evaluate(()=>{
    var allData=document.querySelector("#quote-header-info").textContent.replace("Add to watchlist"," ");
    var stockName=allData.slice(0,allData.indexOf(')')+1);
    allData=allData.replace(stockName,"");

    var metaData=allData.slice(0,allData.indexOf('.')+1);
    allData=allData.replace(metaData,"").trim();

    var stockPrice;
    stockPrice=allData.slice(0,allData.indexOf('.')+3);
    // var stockPrice;
    // if(allData.indexOf('+')===-1)    stockPrice=allData.slice(0,allData.indexOf('-'));
    // else    stockPrice=allData.slice(0,allData.indexOf('+'));
    // allData=allData.replace(stockPrice,"");

    // var metaPrice=allData.slice(0,allData.indexOf(')')+1);
    // allData=allData.replace(metaPrice,"");
    return {stockName,metaData,stockPrice};
  });
  await browser.close();
  return StockData;
}