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
    //console.log(data);
    data[8] = data[8] % 80;
    if (tempData !== data[8]) {
        tempData = data[8];
        console.log({'raw':data[8], '>>': data[8] >> 3});
    }
    
});