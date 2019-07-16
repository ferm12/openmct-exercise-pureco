(function(){
var data = [], 
    order = "", 
    subscription = "", 
    typeOfRequest = "",
    telemetryId = "",
    timestampOrder = "",
    sockets = [],
    tableNode = document.querySelector('#table-data'),
    subscriptionNode = document.querySelector('#subscription');

var historicalTelemetry = function(telemetryId){
    let start = Date.now() - 15*60*1000, end = Date.now();
        url = document.location.origin +
        '/history/' +
        telemetryId +
        '?start=' + start +
        '&end=' + end;

    return http.get(url);
};

var socketSubscribe = function(telemetryId){
    let checkForSocket = findSocket(telemetryId);
    if (checkForSocket == null){
        let socket = new WebSocket(location.origin.replace(/^http/, 'ws') + '/realtime/');
        socket.onopen = function(e){
            socket.send('subscribe ' + telemetryId);
        };
        (telemetryId == "pwr.v") ? sockets.push({"pwr.v": socket}) : sockets.push({"pwr.c":socket});
    }
    console.log("sockets after subcribe:", sockets);
};

var socketUnsubscribe = function(telemetryId){
    console.log('tring to send unsubscrit', telemetryId);
    let lookForSocket = findSocket(telemetryId);
    if (lookForSocket != null){
        lookForSocket.send('unsubscribe ' + telemetryId);
        for( var i = 0; i < sockets.length; i++){ 
            if (telemetryId == "pwr.v"){
                if ( typeof sockets[i]["pwr.v"] === "object") {
                    sockets.splice(i, 1); 
                    i--;
                }
            }else if (telemetryId == "pwr.c"){
                if ( typeof sockets[i]["pwr.c"] === "object") {
                    sockets.splice(i, 1); 
                    i--;
                }
            }

        }
    }
    console.log("sockets after unsubcribe:", sockets);


};
var clearTable = function(){
    tableNode.innerHTML = "";
};

var telemetryData = function(data){
    let tableVals = function(el){
        let div = document.createElement('div');
        div.className ="table-wrapper table-values";
        div.innerHTML = `
            <div class="id">${el.id}</div>
            <div class="timestamp">${el.timestamp}</div>
            <div class="value">${el.value}</div>
        `;
        tableNode.appendChild(div);
    }
    if (Array.isArray(data)){
        data.forEach(function(el){
            tableVals(el);
        });
    }else if (typeof data == "object"){
        tableVals(data);
    }
};
// sorting
function compareValues(key, order) {
    return function(a, b) {
        
        // property doesn't exist on either object
        if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) { return 0;}

        const vara = a[key];
        const varb = b[key];

        let comparison = 0;
        if (vara > varb) {
            comparison = 1;
        } else if (vara < varb) {
            comparison = -1;
        }

        return ( (order == 'descending') ? (comparison * -1) : comparison);
    };
};

var findSocket = function(telemetryId){
    let el = null;
    if (telemetryId == "pwr.c") {
        sockets.forEach(function(elem){
            if(typeof elem["pwr.c"] == "object"){
                el = elem["pwr.c"];
            }
        });
    }
    if (telemetryId == "pwr.v"){
        sockets.forEach(function(elem){
            if(typeof elem["pwr.v"] == "object"){
                el = elem["pwr.v"];
            }
        });
    }
    return el;
};

var displayTable = function(){
    if (typeOfRequest == "realtime" && subscription == "subscribe"){
        data = [];
        // socketSubscribe(telemetryId);
        let foundSocket = findSocket(telemetryId);
        if (foundSocket != null){
            foundSocket
            .onmessage = function(e){
                let p = JSON.parse(e.data);
                console.log(p);
                data.push(p);
                telemetryData(p);
            };
        }

    }

    if (typeOfRequest == "historical" && telemetryId){
        console.log('historical data');
        historicalTelemetry(telemetryId)
        .then(function(resp){
            data = resp.data;
            telemetryData(resp.data);
        });
    }
};

var checkSubscription = function(){
    if (subscription == "unsubscribe"){
        socketUnsubscribe(telemetryId);
    }else if(subscription == "subscribe"){
        socketSubscribe(telemetryId);
    }
};

document.querySelector("#select-typeof-request").onchange = function(e){
    let selectedRequest = e.target.value;
    if (selectedRequest){
        if (selectedRequest == "historical"){
            subscriptionNode.style.display = "none";
            socketUnsubscribe("pwr.v");
            socketUnsubscribe("pwr.c");
        }else{
            subscriptionNode.style.display = "inline-block";
            checkSubscription();
        }
        
        typeOfRequest = selectedRequest;
        clearTable();
        displayTable();
    }else{
        typeOfRequest = ""; 
    }

};


document.querySelector("#select-telemetry").onchange = function(e){
    let selectedTelemetry = e.target.value; 
    console.log('selectedTelemetry', selectedTelemetry);
    if (selectedTelemetry){
        console.log('subscription:', subscription);
        telemetryId = selectedTelemetry;
        checkSubscription();
        clearTable();
        displayTable();
    }else{
        telemetryId = ""; 
    }
};

document.querySelector("#subscription").onchange = function(e){
    let selectedSubscription = e.target.value; 
    if (selectedSubscription){
        subscription = selectedSubscription;
        checkSubscription();
        clearTable();
        displayTable();
    }else {
        subscription = ""; 
    }
};

document.querySelector("#select-timestamp-order").onchange = function(e){
    let selectedOrder = e.target.value;
    if (selectedOrder){
        timestampOrder = selectedOrder;
        if (data.lenght !=  0){
            data.sort(compareValues('timestamp', selectedOrder));
            clearTable();
            telemetryData(data);
        }
    }else{
        timestampOrder = "";
    }
};

})();
