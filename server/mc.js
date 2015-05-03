var Simplify = require("simplify-commerce"),
    client = Simplify.getClient({
	publicKey: 'sbpb_M2E1Mjc2YTAtOGRlMy00NjBkLWE2MDktOTM3NTVkM2JjMDU4'
    });

client.payment.create({
	amount : "123123",
	description : "payment description",
	card : {
		expMonth : "11",
		expYear : "19",
		cvc : "123",
		number : "5555555555554444"
	},
	currency : "USD"
}, function(errData, data){
	
	if(errData){
		    console.error("Error Message: " + errData.data.error.message);
		    // handle the error
		    return;
	    }
	        console.log("Payment Status: " + data.paymentStatus);
});
