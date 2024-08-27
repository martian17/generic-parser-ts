
let str;
let ptr;

/*
type matcher = string | RegExp | (string) => [string, result]
string ... string
RegExp ... string
func ... result
*/


// function a(a: string): string;
// function a(a: RegExp): number;
//function a<T extends (i: any) => any>(a: T): ReturnType<T>;
function a(a: "1"): "r1";
function a(a: "2"): "r2";
function a(a: "3"): "r3";
function a(a: "4"): "r4";
// function a(a: "5"): "r5";
// function a(a: "6"): "r6";
// function a(a: "7"): "r7";
// function a(a: "8"): "r8";
// function a(a: "9"): "r9";
// function a(a: "10"): "r10";
// function a(a: "11"): "r11";
// function a(a: "12"): "r12";
// function a(a: "13"): "r13";
// function a(a: "14"): "r14";
// function a(a: "15"): "r15";
// function a(a: "16"): "r16";
// function a(a: "17"): "r17";
// function a(a: "18"): "r18";
// function a(a: "19"): "r19";
function a(a: any): any{

}

type GetReturnType1<Type> = Type extends (...args: never[]) => infer Return
  ? Return
  : never;
// type GetReturnType2<Type, Arguments extends any[]> = Type extends (...args: Argument[]) => infer Return ? Return : never;
// type GetReturnType2<Type, Arguments extends any[]> = 
//     Type extends (...args: Arguments) => infer Return ? Return : never;
// type GetReturnType2<Type, Arguments extends any[]> = 
//     Type extends (...args: infer A) => infer Return
//         ? Arguments extends A 
//             ? Return 
//             : never
//         : never;
// type GetReturnType2<Type, Arguments extends any[]> =
//     Type extends (...args: [...Arguments, ...any[]]) => infer Return
//         ? Return
//         : never;
// type GetReturnType2<Type, Arguments extends any[]> =
// Type extends (...args: [...Arguments]) => infer Return
//     ? Return
//     : never;

type GetReturnType2<T extends (...args: any[]) => any, ARGS_T> =
Extract<
    T extends { (...args: infer A1): infer R1; (...args: infer A2): infer R2; (...args: infer A3): infer R3; (...args: infer A4): infer R4; } ? [A1, R1] | [A2, R2] | [A3, R3] | [A4, R4] :
    T extends { (...args: infer A1): infer R1; (...args: infer A2): infer R2; (...args: infer A3): infer R3; } ? [A1, R1] | [A2, R2] | [A3, R3] :
    T extends { (...args: infer A1): infer R1; (...args: infer A2): infer R2; } ? [A1, R1] | [A2, R2] :
    T extends { (...args: infer A1): infer R1; } ? [A1, R1] :
    never,
    [ARGS_T, any]
>[1]

//type b = typeof (a(""));

type b = GetReturnType1<typeof a>
type c = GetReturnType2<typeof a, ["1"]>

// parse the repeated sequence
// (a, b, c) etc
// function parseRepeats<>(start: matcher, content: matcher, separator: matcher, end: matcher): {
// 
// }{
//     
// }
