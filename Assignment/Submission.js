const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({

    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    assignment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Assignment"
    },

    answer:String,

    submission_date:{
        type:Date,
        default:Date.now
    },

    status:{
        type:String,
        default:"Submitted"
    }

});

module.exports = mongoose.model("Submission",submissionSchema);