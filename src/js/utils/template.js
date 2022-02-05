function isString(string) {
  return typeof string == 'string' || string instanceof String;
}

export function forEachElement(root, callback) {
    if (!root) return [];
    function _foreach(root) {
        if (
            root.nodeType &&
            (root.nodeType == Node.ELEMENT_NODE ||
                root.nodeType == Node.DOCUMENT_FRAGMENT_NODE)
        ) {
            callback(root);
        }
        if (root.firstChild) {
            for (const child of root.childNodes) {
                _foreach(child);
            }
        }
    }
    _foreach(root);
}

export function flattenElements(root) {
    const result = [];
    if (root) forEachElement(root, (element) => result.push(element));
    return result;
}

function forEachAttribute(element, callback) {
    if (!element || !element.attributes || !callback) return;
    for (const a of Array.from(element.attributes)) callback(a.name, a.value);
}

function stripPrefixedAttributes(element, prefix) {
    forEachAttribute(element, (key) => {
        if (key.startsWith(prefix)) element.removeAttribute(key);
    });
}

export default class Template {
    constructor(templateElement) {
        this.fragment = templateElement;
    }

    static fillElement(element, data, prefix) {
        forEachAttribute(element, (templateAttributeName, value) => {
            // Assert templateAttributeName is a string.
            if (!templateAttributeName || !isString(templateAttributeName))
                return;

            const targetAttributeName =
                prefix.length && templateAttributeName.slice(prefix.length);

            // Check wether the attribute should be handled.
            if (!templateAttributeName.startsWith(prefix) || !(value in data))
                return;

            switch (targetAttributeName.toLowerCase()) {
                case "text":
                    element.textContent = data[value];
                    break;
                case "style":
                    Object.assign(element.style, data[value]);
                    break;
                case "handle":
                    break;
                default:
                    element.setAttribute(targetAttributeName, data[value]);
            }
        });
    }

    /**
     * Build an object where keys are the value of filterAttribute and
     * values are a reference to the HTMLElement.
     * 
     * Returns an empty object if no handles are found.
     * Throws and Error if there is a duplicate handle name.
     */
    static getElementHandles(root, filterAttribute) {
        if (!root) return {};
        const elements = Array.isArray(root) ? root : flattenElements(root);
        const result = {};
        elements.forEach((element) => {
            if (
                !element ||
                !element.nodeType ||
                element.nodeType != Node.ELEMENT_NODE
            )
                return;

            const handleName = element.getAttribute(filterAttribute);

            if (handleName) {
                if (handleName in result) {
                    throw new Error(
                        [
                            `${filterAttribute} must be unique in template scope`,
                            `Duplicate value: ${handleName}`,
                        ].join("\n")
                    );
                }
                result[handleName] = element;
            }
        });
        return result;
    }

    static fillElements(element, data = {}, prefix) {
        flattenElements(element).forEach((element) => {
            Template.fillElement(element, data, prefix);
        });
        return element;
    }

    render(data) {
        const fragment = this.fragment.cloneNode(true);
        const handles = Template.getElementHandles(fragment, "x:handle");
        Template.fillElements(fragment, data, "x:");
        flattenElements(fragment).forEach((element) =>
            stripPrefixedAttributes(element, "x:")
        );
        return [fragment, handles];
    }
}
