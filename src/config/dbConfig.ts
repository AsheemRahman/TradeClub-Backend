import mongoose from "mongoose";


const mongoDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}`, { dbName: "TradeClub", });
        console.log("mongodb is connected");
    } catch (error) {
        console.log("error while connectiong with mongodb", error);
    }
};

export default mongoDB;