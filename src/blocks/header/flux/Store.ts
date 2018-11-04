import Dispatcher from "./Dispatcher.js";
import { IAction, MyLittleStore } from "./MyLittleFramework.js";

class SomeStore extends MyLittleStore {
    private pageName: string = "";

    constructor() {
        super();

        getPageQuery().then((pageNameFomServer) => {
            this.pageName = pageNameFomServer;
        });

        Dispatcher.register((action: IAction) => {
            switch ( action.type ) {
                case "change-page-action":
                    this.changePageMutation(action.payload);
                    break;
                default:
                    break;
            }
            this.emitChange();
        });
    }

    private changePageMutation = (payload: string | undefined) => {
        if (!!payload) {
            this.pageName = payload;
            savePageQuery(this.pageName);
        }
    }
}

const getPageQuery = (): Promise<string> => {
     return fetch("/getPage", { method: "GET"})
        .then((response) => {
            return response.json();
        }).then ((json) => {
            return json.lastVisited;
        }).catch(() => {
            throw new Error("Ошибка во время получения последней страницы с сервера");
        });
};

const savePageQuery = (page: string) => {
    return fetch("/savePage", {
            body: JSON.stringify({ pageName: page }),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            method: "POST",
        })
        .catch(() => {
            throw new Error("Ошибка во время сохранения страницы");
        });
};

const someStore = new SomeStore();

export default someStore;
