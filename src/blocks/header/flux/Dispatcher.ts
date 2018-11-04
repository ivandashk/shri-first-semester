import { IAction, MyLittleDispatcher } from "./MyLittleFramework.js";

class Dispatcher extends MyLittleDispatcher {
    public changePage = (pageName: string) => {
        const action: IAction = {
            payload: pageName,
            type: "change-page-action",
        };

        this.dispatch(action);
    }
}

const dispatcher = new Dispatcher();

export default dispatcher;
