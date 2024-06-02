import env from '#start/env'
import { StreamChat } from 'stream-chat'
const streamClient = StreamChat.getInstance(env.get('STREAM_API_KEY'), env.get('STREAM_API_SECRET'))
export default streamClient
