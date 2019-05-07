import * as msg from 'gen/cli/msg_generated';
import * as flatbuffers from './flatbuffers';
import { assert } from './util';
import * as dispatch from './dispatch';

function req(
  from: number,
  to: number
): [flatbuffers.Builder, msg.Any, flatbuffers.Offset] {
  // Get a builder to create a serialized buffer
  const builder = flatbuffers.createBuilder();
  msg.RandRange.startRandRange(builder);
  // Put stuff inside the buffer!
  msg.RandRange.addFrom(builder, from);
  msg.RandRange.addTo(builder, to);
  const inner = msg.RandRange.endRandRange(builder);
  // We return these 3 pieces of information
  // dispatch.sendSync/sendAsync will need these as arguments!
  // (treat such as bilerplate)
  return [builder, msg.Any.RandRange, inner];
}

function res(baseRes: null | msg.Base): number {
  // Some checks
  assert(baseRes !== null);
  // Make sure we actually do get a correct response type
  assert(msg.Any.RandRangeRes === baseRes!.innerType());
  // Create the RandRangeRes template
  const res = new msg.RandRangeRes();
  // Deserialize!
  assert(baseRes!.inner(res) !== null);
  // Extract the result
  return res.result();
}

export function randRangeSync(from: number, to: number): number {
  return res(dispatch.sendSync(...req(from, to)));
}

export async function randRange(from: number, to: number): Promise<number> {
  return res(await dispatch.sendAsync(...req(from, to)));
}
