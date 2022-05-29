import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

import { WS_URL } from '@/services/config'

const socket = new SockJS(WS_URL)
const stompClient = Stomp.over(socket)
stompClient.debug = () => {}

export default stompClient