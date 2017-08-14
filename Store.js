const mongoose = require("mongoose")
const { Store } = require("koa-session2")

const SessionSchema = new mongoose.Schema({
    sessionId: String,
    user: Object,
})

const Session = mongoose.model('Session', SessionSchema);

class MongoStore extends Store {
    constructor() {
        super();
        // this.mongo = 
    }

    async get(sid) {
        let data = await Session.findOne({ sessionId: sid })
        return data
    }

    async set(session, { sid = this.getID(24), maxAge = 1000000 } = {}) {
        try {
            const newSession = new Session({
                sessionId: sid,
                user: session,
            });
            // console.log('new session:', newSession)
            await newSession.save()
        } catch (e) { console.error(e) }
        return sid;
    }

    async destroy(sid) {
        return await Session.remove({ sessionId: sid });
    }
}

module.exports = MongoStore;