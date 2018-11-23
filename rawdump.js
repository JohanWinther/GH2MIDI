var HID = require('node-hid');
var devices = HID.devices();
var vendorId, productId;
for (let device of devices) {
    if (device.product && device.product.slice(0,6) === 'Guitar') {
        console.log("Guitar found!");
        vendorId = device.vendorId;
        productId = device.productId;
    }
}

var tempData = 0;
var hid = new HID.HID(vendorId, productId);
hid.on("data", function(data) {
    let idx = 6;
    //console.log(data);
    if (tempData !== data[idx]) {
        tempData = data[idx];
        console.log({'raw':data[idx], '>>': data[idx] >> 3});
    }
    
});