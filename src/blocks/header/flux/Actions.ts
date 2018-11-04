import Dispatcher from "./Dispatcher.js";

export default class Actions {
    public static changePage = (pageName: string) => {
        Dispatcher.changePage(pageName);
    }
}
