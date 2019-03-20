import * as fs from "fs";
import { IMergeTreeDeltaOpCallbackArgs } from "..";
import { Client } from "../client";
import { Marker, MergeTree, SubSequence, TextSegment } from "../mergeTree";
import * as ops from "../ops";
import * as Properties from "../properties";
import { loadText } from "../text";

export function loadTextFromFile(filename: string, mergeTree: MergeTree, segLimit = 0) {
    // tslint:disable-next-line:non-literal-fs-path
    const content = fs.readFileSync(filename, "utf8");
    return loadText(content, mergeTree, segLimit);
}

export function loadTextFromFileWithMarkers(filename: string, mergeTree: MergeTree, segLimit = 0) {
    // tslint:disable-next-line:non-literal-fs-path
    const content = fs.readFileSync(filename, "utf8");
    return loadText(content, mergeTree, segLimit, true);
}

// tslint:disable:no-unsafe-any
export function specToSegment(spec: any) {
    const maybeText = TextSegment.fromJSONObject(spec);
    if (maybeText) {
        return maybeText;
    }

    const maybeMarker = Marker.fromJSONObject(spec);
    if (maybeMarker) {
        return maybeMarker;
    }

    const maybeSubSequence = SubSequence.fromJSONObject(spec);
    if (maybeSubSequence) {
        return maybeSubSequence;
    }

    throw new Error(`Unrecognized IJSONSegment type: '${JSON.stringify(spec)}'`);
}
// tslint:enable:no-unsafe-any

export function insertMarker(
    mergeTree: MergeTree,
    pos: number,
    refSeq: number,
    clientId: number,
    seq: number,
    behaviors: ops.ReferenceType, props: Properties.PropertySet, opArgs: IMergeTreeDeltaOpCallbackArgs,
) {
    mergeTree.insertSegment(pos, refSeq, clientId, seq, Marker.make(behaviors, props, seq, clientId), opArgs);
}

export function insertText(
    mergeTree: MergeTree,
    pos: number,
    refSeq: number,
    clientId: number,
    seq: number,
    text: string,
    props: Properties.PropertySet,
    opArgs: IMergeTreeDeltaOpCallbackArgs,
) {
    mergeTree.insertSegment(pos, refSeq, clientId, seq, TextSegment.make(text, props, seq, clientId), opArgs);
}

export function insertTextLocal(
    client: Client,
    text: string,
    pos: number,
    props?: Properties.PropertySet,
    opArgs?: IMergeTreeDeltaOpCallbackArgs,
) {
    const segment = new TextSegment(text);
    if (props) {
        segment.addProperties(props);
    }
    client.insertSegmentLocal(pos, segment, opArgs);
}

export function insertMarkerLocal(
    client: Client,
    pos: number,
    behaviors: ops.ReferenceType,
    props?: Properties.PropertySet,
    opArgs?: IMergeTreeDeltaOpCallbackArgs,
) {
    const segment = new Marker(behaviors);
    if (props) {
        segment.addProperties(props);
    }
    client.insertSegmentLocal(pos, segment, opArgs);
}

export function insertItemsRemote(
    client: Client,
    items: ops.SequenceItem[],
    pos: number,
    props: Properties.PropertySet,
    seq: number,
    refSeq: number,
    clientId: number,
    opArgs?: IMergeTreeDeltaOpCallbackArgs,
) {
    const segment = new SubSequence(items);
    if (props) {
        segment.addProperties(props);
    }
    client.insertSegmentRemote(segment, pos, seq, refSeq, clientId, opArgs);
}

export function insertMarkerRemote(
    client: Client, markerDef:
    ops.IMarkerDef,
    pos: number,
    props: Properties.PropertySet,
    seq: number,
    refSeq: number,
    clientId: number, opArgs?: IMergeTreeDeltaOpCallbackArgs,
) {
    const segment = new Marker(markerDef.refType);
    if (props) {
        segment.addProperties(props);
    }
    client.insertSegmentRemote(segment, pos, seq, refSeq, clientId, opArgs);
}

export function insertTextRemote(
    client: Client,
    text: string,
    pos: number,
    props: Properties.PropertySet,
    seq: number,
    refSeq: number,
    clientId: number,
    opArgs?: IMergeTreeDeltaOpCallbackArgs,
) {
    const segment = new TextSegment(text);
    if (props) {
        segment.addProperties(props);
    }
    client.insertSegmentRemote(segment, pos, seq, refSeq, clientId, opArgs);
}
