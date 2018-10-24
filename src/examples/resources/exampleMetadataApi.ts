import {
    ElementModel, LinkModel, ElementTypeIri, LinkTypeIri, PropertyTypeIri, MetadataApi, CancellationToken,
    AuthoringKind, LinkChange, ValidationApi, ValidationEvent, ValidationOperation, isLinkConnectedToElement,
} from '../../index';

const owlPrefix = 'http://www.w3.org/2002/07/owl#';
const rdfsPrefix = 'http://www.w3.org/2000/01/rdf-schema#';

const schema = {
    class: owlPrefix + 'Class' as ElementTypeIri,
    objectProperty: owlPrefix + 'ObjectProperty' as ElementTypeIri,
    domain: owlPrefix + 'domain' as LinkTypeIri,
    range: owlPrefix + 'range' as LinkTypeIri,
    subClassOf: rdfsPrefix + 'subClassOf' as LinkTypeIri,
    subPropertyOf: rdfsPrefix + 'subPropertyOf' as LinkTypeIri,
};

const METADATA_DELAY: number = 0; /* ms */
function delay(): Promise<void> {
    if (METADATA_DELAY === 0) {
        return Promise.resolve();
    }
    return new Promise(resolve => setTimeout(resolve, METADATA_DELAY));
}

export class ExampleMetadataApi implements MetadataApi {
    async canDropOnCanvas(source: ElementModel, ct: CancellationToken): Promise<boolean> {
        await delay();
        return true;
    }

    async canDropOnElement(source: ElementModel, target: ElementModel, ct: CancellationToken): Promise<boolean> {
        await delay();
        return true;
    }

    async possibleLinkTypes(source: ElementModel, target: ElementModel, ct: CancellationToken): Promise<LinkTypeIri[]> {
        await delay();
        return [schema.domain, schema.range, schema.subClassOf, schema.subPropertyOf];
    }

    async typesOfElementsDraggedFrom(source: ElementModel, ct: CancellationToken): Promise<ElementTypeIri[]> {
        await delay();
        return [schema.class, schema.objectProperty];
    }

    async propertiesForType(type: ElementTypeIri, ct: CancellationToken): Promise<PropertyTypeIri[]> {
        await delay();
        return [];
    }

    async canDeleteElement(element: ElementModel, ct: CancellationToken): Promise<boolean> {
        await delay();
        return true;
    }

    async canCreateElement(elementType: ElementTypeIri, ct: CancellationToken): Promise<boolean> {
        await delay();
        return true;
    }

    async canEditElement(element: ElementModel, ct: CancellationToken): Promise<boolean> {
        await delay();
        return true;
    }

    async canLinkElement(element: ElementModel, ct: CancellationToken): Promise<boolean> {
        await delay();
        return true;
    }

    async canDeleteLink(
        link: LinkModel, source: ElementModel, target: ElementModel, ct: CancellationToken
    ): Promise<boolean> {
        await delay();
        return true;
    }

    async canEditLink(
        link: LinkModel, source: ElementModel, target: ElementModel, ct: CancellationToken
    ): Promise<boolean> {
        await delay();
        return true;
    }
}

export class ExampleValidationApi implements ValidationApi {
    validate(event: ValidationEvent): ReadonlyArray<ValidationOperation> {
        const results: ValidationOperation[] = [];
        if (event.target.types.indexOf(schema.class) >= 0) {
            const newLinkEvent = event.state.events.find(e =>
                e.type === AuthoringKind.ChangeLink &&
                !e.before &&
                isLinkConnectedToElement(e.after, event.target.id)
            ) as LinkChange | undefined;

            if (newLinkEvent) {
                results.push({
                    type: 'link',
                    target: newLinkEvent.after,
                    errors: Promise.resolve([{
                        message: 'Cannot add links from/to classes'
                    }])
                });
                results.push({
                    type: 'element',
                    target: event.target.id,
                    errors: Promise.resolve([{
                        message: 'Cannot add links from/to classes'
                    }])
                });
            }
        }
        return results;
    }
}
