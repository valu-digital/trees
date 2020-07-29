export interface Tree<T> {
    node: T;
    children: Tree<T>[];
}

/**
 * Type Guard function for filtering empty values out of arrays.
 *
 * Usage: arr.filter(notEmpty)
 */
export function notEmpty<TValue>(
    value: TValue | null | undefined,
): value is TValue {
    return value !== null && value !== undefined;
}

/**
 * Generate hierarchical tree data structure from flat node list with parent id
 */
export function flatListToTrees<T extends unknown[]>(
    data: T | null | undefined,
    options: {
        getId: (item: T[0]) => any;
        getParentId: (item: T[0]) => any;
    },
): Tree<NonNullable<T[0]>>[] {
    if (!data) {
        return [];
    }

    // wrap nodes to the tree interface
    const trees = data.filter(notEmpty).map((node) => {
        return ({
            node,
            children: [],
        } as unknown) as Tree<NonNullable<T[0]>>;
    });

    // tree roots ie. pages without parent
    const treeRoots = trees.filter((tree) => !options.getParentId(tree.node));

    for (const child of trees) {
        if (!options.getParentId(child.node)) {
            continue;
        }

        for (const parent of trees) {
            if (
                options.getId(parent.node) &&
                options.getParentId(child.node) &&
                options.getId(parent.node) === options.getParentId(child.node)
            ) {
                parent.children.push(child);
            }
        }
    }

    return treeRoots;
}
