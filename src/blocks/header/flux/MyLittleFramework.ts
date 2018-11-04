// tslint:disable:max-classes-per-file
interface ICallbacks {
    [key: string]: (action: IAction) => void;
}

interface IAction {
    type: string;
    payload?: any;
}

class MyLittleDispatcher {
    private lastId: number = 1;
    private callbacks: ICallbacks = {};

    public register = (callback: (action: IAction) => void) => {
        const id = (this.lastId++).toString();
        this.callbacks[id] = callback;
    }

    protected dispatch = (payload: IAction) => {
        for (const id of Object.keys(this.callbacks)) {
            this.callbacks[id](payload);
        }
    }
}

class MyLittleStore {
    public emitChange = () => {
        document.dispatchEvent(new CustomEvent("change"));
    }

    public addChangeListener = (callback: () => void) => {
        document.addEventListener("change", callback);
    }
}

export { MyLittleDispatcher, MyLittleStore, IAction };
