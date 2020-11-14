const mongoose = require('mongoose');

//Attributes of Inventory
var inventorySchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: 'Please Insert Item Name First!'
    },
    quantity: {
        type: Number
    },
    unitPrice: {
        type: Number
    },
    dateReceived: {
        type: String
    },
    users: {
        type: String
    },
    total: {
        type: Number
    }
});

mongoose.model('Inventory', inventorySchema);