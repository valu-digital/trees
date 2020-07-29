import { flatListToTrees } from "../src";

test("flatListToTree can convert flat list to tree data structure", () => {
    type Item = {
        uri: string;
        id: string;
        parent: null | {
            id: string;
        };
    };

    const data: (Item | null)[] = [
        {
            uri: "parent",
            id: "1",
            parent: null,
        },
        {
            uri: "parent/childA",
            id: "2",
            parent: {
                id: "1",
            },
        },
        {
            uri: "parent/childB",
            id: "3",
            parent: {
                id: "1",
            },
        },
        {
            uri: "parent/childB/nested",
            id: "4",
            parent: {
                id: "2",
            },
        },
        {
            uri: "no-children",
            id: "5",
            parent: null,
        },
    ];

    const trees = flatListToTrees(data, {
        getId: (item) => item?.id,
        getParentId: (item) => item?.parent?.id,
    });

    // Find the parent node with children
    const hNode = trees.find((node) => node.node.uri === "parent");
    expect(hNode).not.toBeFalsy();
    expect(hNode?.children).toHaveLength(2);

    // Find the child with children
    const nodeWithMoreChildren = hNode?.children.find(
        (hNode) => hNode.node.id === "2",
    );
    expect(nodeWithMoreChildren).not.toBeFalsy();

    // It has one nested child
    expect(nodeWithMoreChildren?.children[0].node.uri).toEqual(
        "parent/childB/nested",
    );

    // Find the parent node with no children
    const noChildren = trees.find((node) => node.node.uri === "no-children");
    expect(noChildren).not.toBeFalsy();
    expect(noChildren?.children).toHaveLength(0);

    // @ts-expect-error not any
    const typecheck: number = trees[0].children[0].node.uri;
});

test("readme", () => {
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

    expect(trees).toEqual([
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
    ]);
});
