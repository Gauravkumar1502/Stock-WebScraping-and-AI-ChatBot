document.getElementsByClassName("chat-box")[0].style.display = "none";
const hide = document.getElementsByClassName("chat-btn")[0];
hide.addEventListener("click", () => {
  // hide div container Class named : schat-box
  let element = document.getElementsByClassName("chat-box");
  if (element[0].style.display == "none") element[0].style.display = "block";
  else element[0].style.display = "none";
});
const chats=document.getElementsByClassName("chats")[0];

document
.getElementsByClassName("send-img")[0]
.addEventListener("click", async () => {
  let inputbox=document.getElementsByClassName("content")[0];
  let text=inputbox.value;
  if(text==='') return;
  
  let div=document.createElement("div");
  div.className="my-chat";
  div.textContent=text;
  chats.appendChild(div);
  inputbox.value="";
  //send data to server
  let msg=text, user="user2";

  var data = { msg, user };
  var options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const response = await fetch("/api",options);   
  const json=await response.json();

  // add bot response to chats
  let serverRes=document.createElement("div");
  serverRes.className="client-chat";
  if(typeof(json.res)==='string'){
    let serverMsg=json.res;
    serverMsg=serverMsg.replace(/Farish's/gi, "Gaurav's");
    serverMsg=serverMsg.replace(/Mohammed Farish/gi, "Gaurav");
    serverRes.textContent=serverMsg;
    chats.appendChild(serverRes);
  }else{
    let serverMsg=`<pre>Name : ${json.res.stockName}<br> <em>${json.res.metaData}</em><br>Price : ${json.res.stockPrice}</pre>`;
    serverRes.innerHTML=serverMsg;
    chats.appendChild(serverRes);
  }
});
