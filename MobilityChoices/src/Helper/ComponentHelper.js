import ObjectHelper from './ObjectHelper';

export default class ComponentHelper {
    // generic implementations with dynamic field access
    static async updateObjectStateValue(self, value, objName, valueName, hasChangedName) {
        // these values can be updated directly, because react recognizes the change in properties of objects
        if (self.state != undefined) {
            self.state[objName][valueName] = value;
        } else {
            self[valueName] = value;
        }

        if (hasChangedName) {
            await self.setState({[hasChangedName]: true});
        }
    }

    static async propertiesHaveChangedTimeout(func) {
        setTimeout(func, 0);
    }

    static async userInteractionTimeout(func) {
        setTimeout(func, 200);
    }

    // Triggers a change event when the property is not null. This indicates that no timeout was set for this property.
    // After the event has finished the valueName on the context ctx will be set to null.
    static async triggerChangeEvent(ctx, valueName, nextValue, func) {
        var previousValue = ctx[valueName];
        ctx[valueName] = nextValue;

        // trigger ony a change event when no timout was set
        if (!previousValue) {
            ComponentHelper.userInteractionTimeout(async () => {
                await func();
                ctx[valueName] = null;
            });
        }
    }
}
