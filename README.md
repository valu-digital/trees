# @valu/trees

Javascript/TypeScript utility to turn WordPress like flat list (child ->
parent relation) of hierarchical items to a tree data structure.

## Install

```
npm install @valu/trees
```

Example:

```ts
import { flatListToTrees } from "@valu/trees";

const list = [
    {
        name: "Parent",
        id: 1,
        parent: 0,
    },
    {
        name: "Child 1",
        id: 2,
        parent: 1,
    },
    {
        name: "Child 2",
        id: 3,
        parent: 1,
    },
    {
        name: "Grandchild",
        id: 4,
        parent: 3,
    },
];

const trees = flatListToTrees(list, {
    getId: (item) => item.id,
    getParentId: (item) => item.parent,
});
```

will yield `trees` as

```ts
[
    {
        node: { name: "Parent", id: 1, parent: 0 },
        children: [
            { node: { name: "Child 1", id: 2, parent: 1 }, children: [] },
            {
                node: { name: "Child 2", id: 3, parent: 1 },
                children: [
                    {
                        node: { name: "Grandchild", id: 4, parent: 3 },
                        children: [],
                    },
                ],
            },
        ],
    },
];
```

This makes it easy to build recursive menu tree components in React

```tsx
function MenuTree(props: { trees: typeof trees }) {
    return (
        <div>
            {props.trees.map((tree) => (
                <div style={{ marginLeft: "1rem" }}>
                    <div>{tree.node.name}</div>
                    <MenuTree trees={tree.children} />
                </div>
            ))}
        </div>
    );
}
```

which will render roughly to:

```
Parent
    Child 1
    Child 2
        Grandchild
```
