import { expect } from "chai";
import "mocha";
import { IAction, MyLittleDispatcher } from "../src/blocks/header/flux/MyLittleFramework";

class DispatcherStub extends MyLittleDispatcher {
    public testMethod = () => {
        const action: IAction = {
            type: "test-action",
        };

        this.dispatch(action);
    }

    public testMethodWithPayload = () => {
        const action: IAction = {
            payload: "test-payload",
            type: "test-action",
        };

        this.dispatch(action);
    }
}

describe("Работа с диспетчером", () => {
    it("Можно зарегистрировать callback'и", () => {
        const dispatcher: DispatcherStub = new DispatcherStub();

        dispatcher.register(() => { const test = "1"; });
        const id2 = dispatcher.register(() => { const test = "2"; });

        expect(id2).to.equal(2);
    });

    it("При вызове действия, срабатывают зарегистрированные callback'и", () => {
        const dispatcher: DispatcherStub = new DispatcherStub();
        let isTriggered = false;

        dispatcher.register(() => { isTriggered = true; });
        dispatcher.testMethod();

        expect(isTriggered).to.equal(true);
    });

    it("Из действия в callback передаются пользовательские данные", () => {
        const dispatcher: DispatcherStub = new DispatcherStub();
        let payload: string = "";

        dispatcher.register((action: IAction) => { payload = action.payload; });
        dispatcher.testMethodWithPayload();

        expect(payload).to.equal("test-payload");
    });
});
