import * as assert from "assert";
import * as MergeTree from "..";
import { insertMarkerLocal, insertTextLocal, specToSegment } from "./testUtils";

describe("MergeTree.Client", () => {

    const localUserLongId = "localUser";
    let client: MergeTree.Client;

    beforeEach(() => {
        client = new MergeTree.Client("", specToSegment);

        client.startCollaboration(localUserLongId);
    });

    describe(".findTile", () => {
        it("Should be able to find non preceding tile based on label", () => {
            const tileLabel = "EOP";

            insertMarkerLocal(
                client,
                0,
                MergeTree.ReferenceType.Tile,
                {
                    [MergeTree.reservedTileLabelsKey]: [tileLabel],
                    [MergeTree.reservedMarkerIdKey]: "some-id",
                });

            insertTextLocal(client, "abc", 0);

            console.log(client.getText());

            assert.equal(client.getLength(), 4, "length not expected");

            const tile = client.mergeTree.findTile(0, client.getClientId(), tileLabel, false);

            assert(tile, "Returned tile undefined.");

            assert.equal(tile.pos, 3, "Tile with label not at expected position");
        });
    });

    describe(".findTile", () => {
        it("Should be able to find non preceding tile position based on label from client with single tile", () => {
            const tileLabel = "EOP";
            insertTextLocal(client, "abc d", 0);

            insertMarkerLocal(
                client,
                0,
                MergeTree.ReferenceType.Tile,
                {
                    [MergeTree.reservedTileLabelsKey]: [tileLabel],
                    [MergeTree.reservedMarkerIdKey]: "some-id",
                });
            console.log(client.getText());

            assert.equal(client.getLength(), 6, "length not expected");

            const tile = client.findTile(0, tileLabel, false);

            assert(tile, "Returned tile undefined.");

            assert.equal(tile.pos, 0, "Tile with label not at expected position");
        });
    });

    describe(".findTile", () => {
        it("Should be able to find preceding tile position based on label from client with multiple tile", () => {
            const tileLabel = "EOP";
            insertMarkerLocal(
                client,
                0,
                MergeTree.ReferenceType.Tile,
                {
                    [MergeTree.reservedTileLabelsKey]: [tileLabel],
                    [MergeTree.reservedMarkerIdKey]: "some-id",
                });

            insertTextLocal(client, "abc d", 0);

            insertMarkerLocal(
                client,
                0,
                MergeTree.ReferenceType.Tile,
                {
                    [MergeTree.reservedTileLabelsKey]: [tileLabel],
                    [MergeTree.reservedMarkerIdKey]: "some-id",
                });

            insertTextLocal(client, "ef", 7);
            insertMarkerLocal(
                client,
                8,
                MergeTree.ReferenceType.Tile,
                {
                    [MergeTree.reservedTileLabelsKey]: [tileLabel],
                    [MergeTree.reservedMarkerIdKey]: "some-id",
                });
            console.log(client.getText());

            assert.equal(client.getLength(), 10, "length not expected");

            const tile = client.findTile(5, tileLabel);

            assert(tile, "Returned tile undefined.");

            assert.equal(tile.pos, 0, "Tile with label not at expected position");
        });
    });

    describe(".findTile", () => {
        it("Should be able to find non preceding tile position from client with multiple tile", () => {
            const tileLabel = "EOP";
            insertMarkerLocal(
                client,
                0,
                MergeTree.ReferenceType.Tile,
                {
                    [MergeTree.reservedTileLabelsKey]: [tileLabel],
                    [MergeTree.reservedMarkerIdKey]: "some-id",
                });

            insertTextLocal(client, "abc d", 0);

            insertMarkerLocal(
                client,
                0,
                MergeTree.ReferenceType.Tile,
                {
                    [MergeTree.reservedTileLabelsKey]: [tileLabel],
                    [MergeTree.reservedMarkerIdKey]: "some-id",
                });

            insertTextLocal(client, "ef", 7);
            insertMarkerLocal(
                client,
                8,
                MergeTree.ReferenceType.Tile,
                {
                    [MergeTree.reservedTileLabelsKey]: [tileLabel],
                    [MergeTree.reservedMarkerIdKey]: "some-id",
                });
            console.log(client.getText());

            assert.equal(client.getLength(), 10, "length not expected");

            const tile = client.findTile(5, tileLabel, false);

            assert(tile, "Returned tile undefined.");

            assert.equal(tile.pos, 6, "Tile with label not at expected position");
        });
    });

    describe(".findTile", () => {
        it("Should be able to find  tile from client with text length 1", () => {
            const tileLabel = "EOP";
            insertMarkerLocal(
                client,
                0,
                MergeTree.ReferenceType.Tile,
                {
                    [MergeTree.reservedTileLabelsKey]: [tileLabel],
                    [MergeTree.reservedMarkerIdKey]: "some-id",
                });

            console.log(client.getText());

            assert.equal(client.getLength(), 1, "length not expected");

            const tile = client.findTile(0, tileLabel);

            assert(tile, "Returned tile undefined.");

            assert.equal(tile.pos, 0, "Tile with label not at expected position");

            const tile1 = client.findTile(0, tileLabel, false);

            assert(tile1, "Returned tile undefined.");

            assert.equal(tile1.pos, 0, "Tile with label not at expected position");
        });
    });

    describe(".findTile", () => {
        it("Should be able to find only preceding but not non preceeding tile with index out of bound", () => {
            const tileLabel = "EOP";
            insertMarkerLocal(
                client,
                0,
                MergeTree.ReferenceType.Tile,
                {
                    [MergeTree.reservedTileLabelsKey]: [tileLabel],
                    [MergeTree.reservedMarkerIdKey]: "some-id",
                });

            insertTextLocal(client, "abc", 0);
            console.log(client.getText());

            assert.equal(client.getLength(), 4, "length not expected");

            const tile = client.findTile(5, tileLabel);

            assert(tile, "Returned tile undefined.");

            assert.equal(tile.pos, 3, "Tile with label not at expected position");

            const tile1 = client.findTile(5, tileLabel, false);

            assert.equal(typeof(tile1), "undefined", "Returned tile should be undefined.");
        });
    });

    describe(".findTile", () => {
        it("Should return undefined when trying to find tile from text without the specified tile", () => {
            const tileLabel = "EOP";
            insertTextLocal(client, "abc", 0);
            console.log(client.getText());

            assert.equal(client.getLength(), 3, "length not expected");

            const tile = client.findTile(1, tileLabel);

            assert.equal(typeof(tile), "undefined", "Returned tile should be undefined.");

            const tile1 = client.findTile(1, tileLabel, false);

            assert.equal(typeof(tile1), "undefined", "Returned tile should be undefined.");
        });
    });

    describe(".findTile", () => {
        it("Should return undefined when trying to find tile from null text", () => {
            const tileLabel = "EOP";

            const tile = client.findTile(1, tileLabel);

            assert.equal(typeof(tile), "undefined", "Returned tile should be undefined.");

            const tile1 = client.findTile(1, tileLabel, false);

            assert.equal(typeof(tile1), "undefined", "Returned tile should be undefined.");
        });
    });
});
