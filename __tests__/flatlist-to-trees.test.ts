import { flatListToTrees } from "../src/tree";

test("flatListToTree can convert flat list to tree data structure", () => {
  const data: ({
    uri: string;
    id: string;
    parent: null | {
      id: string;
    };
  } | null)[] = [
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

  const tree = flatListToTrees(data, {
    getId: (item) => item?.id,
    getParentId: (item) => item?.parent?.id,
  });

  // Find the parent node with children
  const hNode = tree.find((node) => node.node.uri === "parent");
  expect(hNode).not.toBeFalsy();
  expect(hNode?.children).toHaveLength(2);

  // Find the child with children
  const nodeWithMoreChildren = hNode?.children.find(
    (hNode) => hNode.node.id === "2"
  );
  expect(nodeWithMoreChildren).not.toBeFalsy();

  // It has one nested child
  expect(nodeWithMoreChildren?.children[0].node.uri).toEqual(
    "parent/childB/nested"
  );

  // Find the parent node with no children
  const noChildren = tree.find((node) => node.node.uri === "no-children");
  expect(noChildren).not.toBeFalsy();
  expect(noChildren?.children).toHaveLength(0);
});