const nodemailer = require('nodemailer');

function sendemail(email) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "prezenzaattendencesystem@gmail.com",
            pass: "map@2021"
        }
    });

    const options = {
        from: "prezenzaattendencesystem@gmail.com",
        to: email,
        subject: "Attendence",
        text: "Attendence Marked Successfully",
        html: `<div class="container-fluid px-0">
        <div class="row">
            <div class="col-6 info">
                <div class="title">
        <h1>Your Attendence Has Been Marked Successfully</h1>
        <div class="col-6" id="image">
        <img class="img-fluid" src="https://i.pinimg.com/564x/91/b4/87/91b4877767eddd602b41070e091370a0.jpg">
        </div>
                    <h2 class="h text-shadow display-2">
                        Presenza<sup class="display-6">&copy;</sup></h2>
                    <p class="display-sm">(Attendence in Italian)</p>
                </div>
                <div class="text">
                    <p class="h3">Contactless Attendence Management System</p>
                    <p class="h4">Safest in the times of COVID-19</p>
                    <p class="h5">Reliable | Robust | Secure</p>
                </div>
            </div>
           
        </div>
    </div>
</div>`
    };

    transporter.sendMail(options, function (err, info) {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("Sent:" + info.response);
        }

    });
}

module.exports = { sendemail };