// Side-effect import MUST be first: on native it resolves to interop.native.ts
// which calls cssInterop on the RN primitives we wrap, so className → style
// works regardless of whether NativeWind's babel transform reached this file.
// On web it resolves to interop.ts which is a no-op.
import './interop';

export * from './View';
export * from './Text';
export * from './Pressable';
export * from './Image';
export * from './ScrollView';
export * from './Screen';
export * from './Stack';
export * from './Button';
export * from './TextInput';
