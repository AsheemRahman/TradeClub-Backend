import mongoose from "mongoose";


const mongoDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}`, { dbName: "TradeClub", });
        console.log("MongoDB is connected");
    } catch (error) {
        console.log("Error while connectiong with mongodb", error);
    }
};

export default mongoDB;